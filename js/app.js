const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const storageKey = 'turnofacil-html-v1';
const appVersion = 3;
const mealBreakHours = 1;
const openingMinutes = 9 * 60;
const complete = () => Object.fromEntries(days.map((day) => [day, 'COMPLETA']));
const emptyDays = () => Object.fromEntries(days.map((day) => [day, 'LIBRE']));
const seed = [
  { id: 1, name: 'Trabajador 1', rut: '', role: 'Crew', hours: 30, overnight: false, availability: complete() },
  { id: 2, name: 'Trabajador 2', rut: '', role: 'Crew', hours: 20, overnight: false, availability: complete() },
];

let state = { version: appVersion, employees: seed, week: getMonday(), view: 'availability', schedule: {}, recommendations: {}, history: {} };
let shiftClipboard = null;
let saveTimer;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const clone = (value) => JSON.parse(JSON.stringify(value));

function getMonday(source = new Date()) {
  const now = source;
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  return localDateValue(date);
}

function normalizeMonday(value) {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? getMonday() : getMonday(date);
}

function addDaysToDate(value, amount) {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + amount);
  return localDateValue(date);
}

function localDateValue(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function dateForDay(index) {
  const date = new Date(`${state.week}T12:00:00`);
  date.setDate(date.getDate() + index);
  return date;
}

function dayDateLabel(index) {
  const date = dateForDay(index);
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function normalizeEmployeeRole(value) {
  return String(value || '').trim().toLocaleLowerCase('es') === 'crew-master' ? 'Crew-Master' : 'Crew';
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved?.employees) {
      state = {
        ...state,
        ...saved,
        version: appVersion,
        employees: saved.employees.map((employee, index) => ({ ...employee, id: Number(employee.id) || Date.now() + index, role: normalizeEmployeeRole(employee.role), availability: { ...complete(), ...(employee.availability || {}) } })),
        history: saved.history && typeof saved.history === 'object' ? saved.history : {},
      };
      delete state.coverageRules;
      delete state.strategy;
      Object.values(state.history).forEach((week) => { if (week && typeof week === 'object') delete week.strategy; });
      if (!state.history[state.week] && (Object.keys(state.schedule || {}).length || Object.keys(state.recommendations || {}).length)) persistCurrentWeek();
    }
  } catch (_) { /* Mantener datos iniciales si el almacenamiento está dañado. */ }
  const systemWeek = getMonday();
  if (state.week !== systemWeek) {
    state.week = systemWeek;
    restoreWeek(systemWeek);
  }
  state.view = ['availability', 'schedule'].includes(state.view) ? state.view : 'availability';
}

function persistCurrentWeek() {
  state.history ??= {};
  state.history[state.week] = { schedule: clone(state.schedule || {}), recommendations: clone(state.recommendations || {}), updatedAt: new Date().toISOString() };
}

function restoreWeek(week) {
  const savedWeek = state.history?.[week];
  state.schedule = clone(savedWeek?.schedule || {});
  state.recommendations = clone(savedWeek?.recommendations || {});
}

function save() {
  persistCurrentWeek();
  localStorage.setItem(storageKey, JSON.stringify(state));
  const indicator = $('#save-state');
  indicator.textContent = '✓ Guardado en este navegador';
  indicator.classList.add('saved');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    indicator.textContent = 'Guardado automático';
    indicator.classList.remove('saved');
  }, 1300);
}

function parseTime(value) {
  const [hours, minutes] = String(value).split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTime(minutes) {
  const normalized = ((Math.round(minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(normalized / 60)).padStart(2, '0')}:${String(normalized % 60).padStart(2, '0')}`;
}

const timeValues = Array.from({ length: 48 }, (_, index) => formatTime(index * 30));

function closingMinutes(day) {
  return day === 'Viernes' || day === 'Sábado' ? 25 * 60 : 23 * 60;
}

function closingTime(day) {
  return formatTime(closingMinutes(day));
}

function closingDisplay(day) {
  return closingMinutes(day) > 1440 ? `${closingTime(day)} (+1 día)` : closingTime(day);
}

function startTimeOptionsHtml(day, selected = '') {
  const limit = Math.min(closingMinutes(day), 1440);
  return timeValues.filter((time) => parseTime(time) >= openingMinutes && parseTime(time) < limit).map((time) => `<option value="${time}" ${time === selected ? 'selected' : ''}>${time}</option>`).join('');
}

function endMinutesForRange(start, end) {
  let endMinutes = parseTime(end);
  const startMinutes = parseTime(start);
  if (endMinutes <= startMinutes) endMinutes += 1440;
  return endMinutes;
}

function endTimeOptionsHtml(day, start, selected = '') {
  if (!start || start === 'COMPLETA' || start === 'X') return `<option value="">Máx. ${closingDisplay(day)}</option>`;
  const startMinutes = parseTime(start);
  const seen = new Set();
  const options = [];
  for (let minutes = startMinutes + 30; minutes <= closingMinutes(day); minutes += 30) {
    const value = formatTime(minutes);
    if (seen.has(value)) continue;
    seen.add(value);
    const label = minutes >= 1440 ? `${value} (+1 día)` : value;
    options.push(`<option value="${value}" ${value === selected ? 'selected' : ''}>${label}</option>`);
  }
  return options.length ? options.join('') : '<option value="">Sin horas disponibles</option>';
}

function endWithinClosing(day, start, end) {
  return Boolean(start && end && start !== end && endMinutesForRange(start, end) <= closingMinutes(day));
}

function defaultEndForDay(day, start) {
  return formatTime(Math.min(parseTime(start) + 8 * 60, closingMinutes(day)));
}

function parseWindow(value) {
  const match = String(value).match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
  if (!match) return null;
  const start = parseTime(match[1]);
  let end = parseTime(match[2]);
  if (end <= start) end += 1440;
  return { start, end, capacity: (end - start) / 60 };
}

function availabilityParts(value) {
  const normalized = String(value || '').trim().toUpperCase();
  if (normalized === 'COMPLETA') return { mode: 'complete', start: 'COMPLETA', end: '' };
  if (!normalized || normalized === 'X') return { mode: 'unavailable', start: 'X', end: '' };
  const window = parseWindow(normalized);
  if (!window) return { mode: 'unavailable', start: 'X', end: '' };
  return { mode: 'range', start: formatTime(window.start), end: formatTime(window.end) };
}

function shiftHours(value) {
  if (!value || value === 'LIBRE') return 0;
  const elapsed = parseWindow(value)?.capacity ?? 0;
  return Math.max(0, elapsed - mealBreakHours);
}

function makeShift(start, workedHours) {
  return `${formatTime(start)} - ${formatTime(start + (workedHours + mealBreakHours) * 60)}`;
}

function shiftDescription(value, note = '') {
  const window = parseWindow(value);
  if (!window) return value;
  const suffix = note ? ` · ${note}` : '';
  return `${formatTime(window.start)} → ${formatTime(window.end)} · ${formatNumber(shiftHours(value))} h trabajo + 1 h colación${suffix}`;
}

function workPattern(employee) {
  const weeklyHours = Number(employee.hours || 0);
  if (weeklyHours === 30) return { code: '5x2', workDays: 5, restDays: 2, dailyHours: 6, allowedDays: days };
  if (weeklyHours === 20) return { code: '4x3', workDays: 4, restDays: 3, dailyHours: 5, allowedDays: days };
  if (weeklyHours === 16) return { code: 'Fin de semana', workDays: 2, restDays: 5, dailyHours: 8, allowedDays: ['Sábado', 'Domingo'], weekendOnly: true };
  return null;
}

function patternSummary(employee) {
  const pattern = workPattern(employee);
  if (!pattern) return 'Distribución flexible';
  if (pattern.weekendOnly) return 'Solo sábado y domingo · 8 h + 1 h colación';
  return `${pattern.code} · horas ajustadas a disponibilidad`;
}

function workWindow(employee, day) {
  const availability = String(employee.availability[day] || '').trim().toUpperCase();
  const pattern = workPattern(employee);
  if ((pattern && !pattern.allowedDays.includes(day)) || !availability || availability === 'X') return null;
  const employeeClosing = employee.overnight ? closingMinutes(day) : Math.min(closingMinutes(day), 1440);
  const rawWindow = parseWindow(availability);
  if (rawWindow) {
    const start = Math.max(rawWindow.start, openingMinutes);
    const end = Math.min(rawWindow.end, employeeClosing);
    if (start >= end) return null;
    return { start, end, capacity: (end - start) / 60, ranged: true };
  }
  if (availability !== 'COMPLETA') return null;
  const start = openingMinutes;
  if (start >= employeeClosing) return null;
  return { start, end: employeeClosing, capacity: (employeeClosing - start) / 60, ranged: false };
}

function dayWorkCapacity(employee, day) {
  const capacity = (workWindow(employee, day)?.capacity ?? 0) - mealBreakHours;
  return Math.max(0, Math.floor(capacity * 2) / 2);
}

function shiftOptions(employee, day, extraDurations = []) {
  const options = [{ value: 'LIBRE', hours: 0, label: 'Libre' }];
  const window = workWindow(employee, day);
  if (!window) return options;
  const pattern = workPattern(employee);

  const collected = new Map();
  const add = (value, note = '') => {
    const hours = shiftHours(value);
    if (value !== 'LIBRE' && hours > 0 && !collected.has(value)) collected.set(value, { value, hours, label: shiftDescription(value, note) });
  };

  const dynamicDurations = extraDurations
    .map(Number)
    .filter((duration) => Number.isFinite(duration) && duration > 0)
    .map((duration) => Math.round(duration * 2) / 2);
  const baseDurations = pattern && dynamicDurations.length ? [] : pattern ? [pattern.dailyHours] : [4, 6, 8];
  const durations = [...new Set([...baseDurations, ...dynamicDurations])]
    .filter((duration) => duration + mealBreakHours <= window.capacity);
  if (!durations.length && !pattern) add(`${formatTime(window.start)} - ${formatTime(window.end)}`, 'todo el rango');
  durations.forEach((duration) => {
    const elapsedMinutes = (duration + mealBreakHours) * 60;
    for (let start = window.start; start + elapsedMinutes <= window.end; start += 30) {
      const note = start === window.start
        ? window.ranged ? 'desde disponibilidad' : ''
        : start + elapsedMinutes === window.end
          ? window.ranged ? 'hasta fin disponible' : closingMinutes(day) > 1440 && employee.overnight ? 'cierre 01:00' : 'hasta cierre'
          : '';
      add(makeShift(start, duration), note);
    }
  });
  if (!pattern && window.capacity <= 10 && !durations.some((duration) => Math.abs(duration + mealBreakHours - window.capacity) < 0.01)) {
    add(`${formatTime(window.start)} - ${formatTime(window.end)}`, 'rango completo');
  }
  return [...options, ...collected.values()];
}

function historicalClosingCount(employeeId) {
  return Object.values(state.history || {}).reduce((total, week) => total + days.filter((day) => {
    const window = parseWindow(week.schedule?.[employeeId]?.[day]);
    return window && window.end === closingMinutes(day);
  }).length, 0);
}

function optionScore(employee, day, option) {
  const window = parseWindow(option.value);
  if (!window) return -Infinity;
  const closes = window.end === closingMinutes(day);
  return -(closes ? 70 + historicalClosingCount(employee.id) * 8 : 0) - window.start / 1000;
}

function patternDayCandidates(employee, pattern) {
  return pattern.allowedDays
    .map((day) => ({ day, capacity: dayWorkCapacity(employee, day), index: days.indexOf(day) }))
    .filter((candidate) => candidate.capacity > 0);
}

function selectPatternDays(employee, pattern) {
  const candidates = patternDayCandidates(employee, pattern).sort((a, b) => a.index - b.index);
  let selected = candidates.slice(0, pattern.workDays);
  if (selected.reduce((sum, candidate) => sum + candidate.capacity, 0) < Number(employee.hours || 0)) selected = [...candidates].sort((a, b) => b.capacity - a.capacity || a.index - b.index).slice(0, pattern.workDays);
  return selected
    .slice(0, pattern.workDays)
    .sort((a, b) => a.index - b.index);
}

function allocateContractHours(totalHours, candidates) {
  const allocations = new Map();
  let remaining = Number(totalHours || 0);
  candidates.forEach((candidate, index) => {
    const futureCapacity = candidates.slice(index + 1).reduce((sum, item) => sum + item.capacity, 0);
    const minimumHere = Math.max(0, remaining - futureCapacity);
    const ideal = Math.ceil((remaining / (candidates.length - index)) * 2) / 2;
    const assigned = Math.min(candidate.capacity, remaining, Math.max(minimumHere, ideal));
    allocations.set(candidate.day, Math.round(assigned * 2) / 2);
    remaining = Math.max(0, Math.round((remaining - assigned) * 2) / 2);
  });
  return allocations;
}

function enforceClosingLimits() {
  let changed = false;
  for (const employee of state.employees) {
    for (const day of days) {
      let availability = availabilityParts(employee.availability[day]);
      if (availability.mode === 'range' && parseTime(availability.start) < openingMinutes) {
        const endMinutes = endMinutesForRange(availability.start, availability.end);
        employee.availability[day] = endMinutes <= openingMinutes ? 'X' : `${formatTime(openingMinutes)} - ${availability.end}`;
        availability = availabilityParts(employee.availability[day]);
        changed = true;
      }
      if (availability.mode === 'range' && !endWithinClosing(day, availability.start, availability.end)) {
        if (parseTime(availability.start) >= Math.min(closingMinutes(day), 1440)) employee.availability[day] = 'X';
        else employee.availability[day] = `${availability.start} - ${closingTime(day)}`;
        changed = true;
      }
      const current = state.schedule?.[employee.id]?.[day];
      if (current && current !== 'LIBRE' && !shiftOptions(employee, day, [shiftHours(current)]).some((option) => option.value === current)) {
        state.schedule[employee.id][day] = 'LIBRE';
        if (state.recommendations?.[employee.id]) state.recommendations[employee.id][day] = 'LIBRE';
        changed = true;
      }
    }
  }
  if (changed) save();
}

function bestShift(employee, day, remaining, requestedHours = null) {
  const pattern = workPattern(employee);
  const target = requestedHours ?? (pattern ? pattern.dailyHours : Math.min(8, remaining));
  const options = shiftOptions(employee, day, [target]).filter((option) => option.hours > 0 && (requestedHours === null || Math.abs(option.hours - target) < 0.01));
  if (!options.length) return null;
  const notOver = options.filter((option) => option.hours <= remaining + 0.001);
  const pool = notOver.length ? notOver : options;
  return pool.sort((a, b) => optionScore(employee, day, b) - optionScore(employee, day, a)
    || Math.abs(a.hours - target) - Math.abs(b.hours - target))[0];
}

function generateSchedule() {
  const schedule = {};
  const recommendations = {};
  const orderedEmployees = [...state.employees].sort((a, b) => availabilityCapacity(a) - availabilityCapacity(b));
  for (const employee of orderedEmployees) {
    const pattern = workPattern(employee);
    schedule[employee.id] = emptyDays();
    recommendations[employee.id] = emptyDays();
    const capacities = days.map((day) => dayWorkCapacity(employee, day)).filter((capacity) => capacity > 0).sort((a, b) => b - a);
    let accumulated = 0;
    let flexibleDays = 0;
    while (flexibleDays < capacities.length && accumulated < Number(employee.hours || 0)) accumulated += capacities[flexibleDays++];
    const effectivePattern = pattern || { allowedDays: days, workDays: Math.max(1, flexibleDays), dailyHours: 8 };
    const candidates = selectPatternDays(employee, effectivePattern);
    const allocations = allocateContractHours(employee.hours, candidates);
    for (const candidate of candidates) {
      const requestedHours = allocations.get(candidate.day) || 0;
      if (requestedHours <= 0) continue;
      const option = bestShift(employee, candidate.day, requestedHours, requestedHours);
      if (!option) continue;
      schedule[employee.id][candidate.day] = option.value;
      recommendations[employee.id][candidate.day] = option.value;
    }
  }
  state.schedule = schedule;
  state.recommendations = recommendations;
  state.view = 'schedule';
  save();
  render();
  toast('Horario generado según disponibilidad y horas contratadas.');
}

function weekLabel() {
  const start = new Date(`${state.week}T12:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const formatter = new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'short' });
  return `${formatter.format(start)} — ${formatter.format(end)}`;
}

function availabilityCapacity(employee) {
  const pattern = workPattern(employee);
  if (pattern) {
    return Math.min(Number(employee.hours || 0), selectPatternDays(employee, pattern).reduce((sum, candidate) => sum + candidate.capacity, 0));
  }
  return days.filter((day) => shiftOptions(employee, day).length > 1).reduce((total, day) => {
    const max = Math.max(...shiftOptions(employee, day).map((option) => option.hours));
    return total + max;
  }, 0);
}

function assignedHours(employeeId) {
  return days.reduce((sum, day) => sum + shiftHours(state.schedule[employeeId]?.[day]), 0);
}

function followsWorkPattern(employee) {
  const pattern = workPattern(employee);
  if (!pattern) return Math.abs(assignedHours(employee.id) - Number(employee.hours || 0)) < 0.01;
  const usedDays = days.filter((day) => shiftHours(state.schedule[employee.id]?.[day]) > 0);
  return Math.abs(assignedHours(employee.id) - Number(employee.hours || 0)) < 0.01
    && usedDays.length <= pattern.workDays
    && usedDays.every((day) => pattern.allowedDays.includes(day));
}

function isValidRut(value) {
  const clean = String(value || '').replace(/[^0-9kK]/g, '').toUpperCase();
  if (!/^\d{7,8}[0-9K]$/.test(clean)) return false;
  const body = clean.slice(0, -1);
  let multiplier = 2;
  let sum = 0;
  for (let index = body.length - 1; index >= 0; index -= 1) {
    sum += Number(body[index]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const result = 11 - (sum % 11);
  const verifier = result === 11 ? '0' : result === 10 ? 'K' : String(result);
  return verifier === clean.slice(-1);
}

function buildAlerts() {
  const alerts = [];
  state.employees.forEach((employee) => {
    if (!isValidRut(employee.rut)) alerts.push({ type: 'data', text: `${employee.name}: RUT pendiente o inválido.` });
    const capacity = availabilityCapacity(employee);
    if (capacity + 0.01 < Number(employee.hours || 0)) alerts.push({ type: 'warning', text: `${employee.name}: disponibilidad para ${formatNumber(capacity)} de ${formatNumber(employee.hours)} h.` });
    if (state.view !== 'availability' && state.schedule[employee.id] && !followsWorkPattern(employee)) {
      const difference = Number(employee.hours || 0) - assignedHours(employee.id);
      alerts.push({ type: 'warning', text: `${employee.name}: ${difference > 0 ? 'faltan' : 'sobran'} ${formatNumber(Math.abs(difference))} h por ajustar.` });
    }
  });
  return alerts;
}

function renderMetrics() {
  const totalContracted = state.employees.reduce((sum, employee) => sum + Number(employee.hours || 0), 0);
  const totalAssigned = state.employees.reduce((sum, employee) => sum + assignedHours(employee.id), 0);
  const alerts = buildAlerts();
  const metrics = [
    ['Equipo', state.employees.length, 'trabajadores activos', '●'],
    ['Horas programadas', totalAssigned, `de ${totalContracted} contratadas`, '◷'],
    ['Alertas', alerts.length, alerts.length ? 'revisiones pendientes' : 'todo en orden', alerts.length ? '!' : '✓'],
  ];
  $('#metrics').innerHTML = metrics.map(([label, value, note, icon]) => `<div class="metric"><div class="metric-label"><span>${label}</span><span class="metric-icon">${icon}</span></div><div class="metric-value">${typeof value === 'number' ? formatNumber(value) : value}</div><div class="metric-note">${note}</div></div>`).join('');
}

function renderAlerts() {
  const alerts = buildAlerts();
  const panel = $('#alerts-panel');
  if (!alerts.length) {
    panel.innerHTML = '<div class="alerts-ok"><strong>✓ Sin alertas</strong><span>Las horas contratadas y disponibilidades están correctamente ajustadas.</span></div>';
    return;
  }
  const visible = alerts.slice(0, 8);
  panel.innerHTML = `<div class="alerts-head"><strong>Revisiones recomendadas</strong><span>${alerts.length} alerta${alerts.length === 1 ? '' : 's'}</span></div><div class="alert-list">${visible.map((alert) => `<span class="alert-chip ${alert.type}">${escapeHtml(alert.text)}</span>`).join('')}${alerts.length > visible.length ? `<span class="alert-chip more">＋ ${alerts.length - visible.length} adicionales</span>` : ''}</div>`;
}

function renderTable() {
  const table = $('#schedule-table');
  table.className = '';
  const body = state.employees.length ? state.employees.map(rowHtml).join('') : '<tr><td colspan="11" class="empty-row">No hay trabajadores. Usa “Agregar trabajador” para comenzar.</td></tr>';
  const today = localDateValue(new Date());
  table.innerHTML = `<thead><tr><th>Trabajador y cargo</th><th class="hours">${state.view === 'schedule' ? 'Asignadas' : 'Horas'}</th>${days.map((day, index) => `<th class="day ${localDateValue(dateForDay(index)) === today ? 'today' : ''}"><span>${day}</span><small>${dayDateLabel(index)} · 09:00–${closingDisplay(day)}</small></th>`).join('')}<th class="overnight">Cierre hasta 01:00</th><th class="remove"></th></tr></thead><tbody>${body}</tbody>`;
  table.querySelectorAll('[data-field]').forEach((input) => input.addEventListener('change', onCellChange));
  table.querySelectorAll('[data-action="availability-start"]').forEach((select) => select.addEventListener('change', onAvailabilityStartChange));
  table.querySelectorAll('[data-action="availability-end"]').forEach((select) => select.addEventListener('change', onAvailabilityEndChange));
  table.querySelectorAll('[data-action="shift"]').forEach((select) => select.addEventListener('change', onShiftChange));
  table.querySelectorAll('[data-action="copy-shift"]').forEach((button) => button.addEventListener('click', copyShift));
  table.querySelectorAll('[data-action="paste-shift"]').forEach((button) => button.addEventListener('click', pasteShift));
  table.querySelectorAll('[data-action="overnight"]').forEach((button) => button.addEventListener('click', toggleOvernight));
  table.querySelectorAll('[data-action="delete"]').forEach((button) => button.addEventListener('click', deleteEmployee));
}

function rowHtml(employee, index) {
  const assigned = assignedHours(employee.id);
  const hoursDifference = assigned - Number(employee.hours || 0);
  const hoursClass = Math.abs(hoursDifference) < 0.01 ? 'hours-ok' : 'hours-warning';
  const dayCells = days.map((day) => {
    if (state.view === 'availability') {
      const pattern = workPattern(employee);
      if (pattern?.weekendOnly && !pattern.allowedDays.includes(day)) return '<td><div class="weekend-only"><strong>Descanso</strong><span>Solo fin de semana</span></div></td>';
      const availability = availabilityParts(employee.availability[day]);
      const startClass = availability.mode === 'unavailable' ? 'unavailable' : '';
      return `<td><div class="availability-controls"><label class="availability-line"><span>Desde</span><select class="availability-time-select ${startClass}" data-id="${employee.id}" data-day="${day}" data-action="availability-start" aria-label="Hora de inicio de ${escapeHtml(employee.name)} para ${day}"><option value="COMPLETA" ${availability.start === 'COMPLETA' ? 'selected' : ''}>Completa</option><option value="X" ${availability.start === 'X' ? 'selected' : ''}>No disponible</option><optgroup label="Horas">${startTimeOptionsHtml(day, availability.mode === 'range' ? availability.start : '')}</optgroup></select></label><label class="availability-line"><span>Hasta</span><select class="availability-time-select availability-end" data-id="${employee.id}" data-day="${day}" data-action="availability-end" aria-label="Hora de término de ${escapeHtml(employee.name)} para ${day}" ${availability.mode !== 'range' ? 'disabled' : ''}>${endTimeOptionsHtml(day, availability.mode === 'range' ? availability.start : '', availability.end)}</select></label></div></td>`;
    }
    const current = state.schedule[employee.id]?.[day] || 'LIBRE';
    const recommended = state.recommendations?.[employee.id]?.[day] || 'LIBRE';
    const options = shiftOptions(employee, day, [shiftHours(current), shiftHours(recommended)]);
    if (current !== 'LIBRE' && !options.some((option) => option.value === current)) {
      options.splice(1, 0, { value: current, hours: shiftHours(current), label: `${shiftDescription(current)} · guardado` });
    }
    const currentWindow = parseWindow(current);
    const isRecommended = current !== 'LIBRE' && current === recommended;
    const kind = currentWindow ? currentWindow.start === openingMinutes ? 'opening' : currentWindow.end === closingMinutes(day) ? 'closing' : 'middle' : 'free';
    const details = currentWindow
      ? `<div class="shift-details ${isRecommended ? 'recommended' : ''} ${kind}"><div class="shift-details-head"><span>${isRecommended ? '★ Recomendado' : kind === 'opening' ? 'Apertura' : kind === 'closing' ? 'Cierre' : 'Turno elegido'}</span><strong>${formatNumber(shiftHours(current))} h trabajo</strong></div><div class="shift-times"><span><small>Inicio</small><b>${formatTime(currentWindow.start)}</b></span><i>→</i><span><small>Fin</small><b>${formatTime(currentWindow.end)}</b></span></div><div class="meal-note">＋ 1 h de colación incluida</div></div>`
      : '<div class="shift-free">Sin turno asignado</div>';
    const canPaste = Boolean(shiftClipboard && shiftOptions(employee, day, [shiftClipboard.hours]).some((option) => option.value === shiftClipboard.value));
    return `<td><div class="shift-cell"><select class="shift-select ${current === 'LIBRE' ? 'off' : ''}" data-id="${employee.id}" data-day="${day}" data-action="shift" aria-label="Turno de ${escapeHtml(employee.name)} para ${day}">${options.map((option) => { const label = option.value !== 'LIBRE' && option.value === recommended ? `★ Recomendada · ${option.label}` : option.label; return `<option value="${escapeHtml(option.value)}" ${option.value === current ? 'selected' : ''}>${escapeHtml(label)}</option>`; }).join('')}</select>${details}<div class="shift-tools"><button type="button" data-action="copy-shift" data-id="${employee.id}" data-day="${day}" ${current === 'LIBRE' ? 'disabled' : ''}>Copiar</button><button type="button" data-action="paste-shift" data-id="${employee.id}" data-day="${day}" ${canPaste ? '' : 'disabled'}>Pegar</button></div></div></td>`;
  }).join('');
  const hoursCell = state.view === 'schedule'
    ? `<div class="hours-summary ${hoursClass}"><strong>${formatNumber(assigned)}</strong><span>/ ${formatNumber(employee.hours)} h</span><small>${patternSummary(employee)}</small></div>`
    : `<div class="hours-editor"><input class="hours-input" type="number" min="1" max="60" data-id="${employee.id}" data-field="hours" value="${employee.hours}" /><small>${patternSummary(employee)}</small></div>`;
  return `<tr><td class="person"><input class="person-input" data-id="${employee.id}" data-field="name" value="${escapeHtml(employee.name)}" /><input class="person-input rut" data-id="${employee.id}" data-field="rut" value="${escapeHtml(employee.rut)}" placeholder="RUT" /><select class="person-input role" data-id="${employee.id}" data-field="role"><option value="Crew" ${employee.role === 'Crew' ? 'selected' : ''}>Crew</option><option value="Crew-Master" ${employee.role === 'Crew-Master' ? 'selected' : ''}>Crew-Master</option></select></td><td>${hoursCell}</td>${dayCells}<td><button class="toggle ${employee.overnight ? 'on' : ''}" data-id="${employee.id}" data-action="overnight" aria-label="${escapeHtml(employee.name)}: puede tener cierre hasta la 01:00, ${employee.overnight ? 'sí' : 'no'}">${employee.overnight ? 'SÍ' : 'NO'}</button></td><td class="remove-cell"><button class="delete" title="Eliminar trabajador" data-id="${employee.id}" data-action="delete">×</button></td></tr>`;
}

function renderAvailabilityForm() {
  $('#availability-form').innerHTML = days.map((day) => `<div class="availability-row" data-form-day="${day}"><div class="day-close"><strong>${day}</strong><small>09:00–${closingDisplay(day)}</small></div><select class="availability-mode" aria-label="Disponibilidad de ${day}"><option value="complete">Completa</option><option value="range">Rango horario</option><option value="unavailable">No disponible</option></select><div class="time-fields" hidden><label>Desde <select class="start-time" aria-label="Hora de inicio de ${day}">${startTimeOptionsHtml(day, '09:00')}</select></label><label>Hasta <select class="end-time" aria-label="Hora de término de ${day}">${endTimeOptionsHtml(day, '09:00', '18:00')}</select></label></div></div>`).join('');
  $$('.availability-mode').forEach((select) => select.addEventListener('change', () => {
    const row = select.closest('.availability-row');
    row.querySelector('.time-fields').hidden = select.value !== 'range';
  }));
  $$('.start-time').forEach((select) => select.addEventListener('change', () => {
    const row = select.closest('.availability-row');
    const day = row.dataset.formDay;
    const endSelect = row.querySelector('.end-time');
    const selectedEnd = endWithinClosing(day, select.value, endSelect.value) ? endSelect.value : defaultEndForDay(day, select.value);
    endSelect.innerHTML = endTimeOptionsHtml(day, select.value, selectedEnd);
  }));
  updateAvailabilityFormPattern();
}

function updateAvailabilityFormPattern() {
  const hours = Number($('#employee-hours').value || 0);
  const pattern = workPattern({ hours });
  const note = $('#availability-pattern-note');
  if (pattern?.weekendOnly) note.textContent = '16 horas: sábado y domingo. Las horas se reparten según la disponibilidad de ambos días, más 1 hora de colación por turno.';
  else if (pattern) note.textContent = `${hours} horas: máximo ${pattern.workDays} días de trabajo (${pattern.code}); las horas diarias se ajustan para completar el contrato según disponibilidad.`;
  else note.textContent = 'Selecciona completa, no disponible o un rango horario.';
  $$('.availability-row').forEach((row) => {
    const locked = Boolean(pattern?.weekendOnly && !pattern.allowedDays.includes(row.dataset.formDay));
    const wasLocked = row.classList.contains('pattern-disabled');
    row.classList.toggle('pattern-disabled', locked);
    const mode = row.querySelector('.availability-mode');
    mode.disabled = locked;
    if (locked) {
      mode.value = 'unavailable';
      row.querySelector('.time-fields').hidden = true;
    } else if (wasLocked) {
      mode.value = 'complete';
    }
  });
}

function openEmployeeDialog() {
  $('#employee-form').reset();
  $('#employee-hours').value = 30;
  $('#employee-role').value = 'Crew';
  renderAvailabilityForm();
  $('#employee-dialog').showModal();
  setTimeout(() => $('#employee-name').focus(), 0);
}

function addEmployeeFromForm(event) {
  event.preventDefault();
  const rut = formatRut($('#employee-rut').value);
  if (!isValidRut(rut)) {
    toast('El RUT ingresado no es válido.');
    $('#employee-rut').focus();
    return;
  }
  const weeklyHours = Number($('#employee-hours').value);
  const pattern = workPattern({ hours: weeklyHours });
  const availability = {};
  for (const row of $$('.availability-row')) {
    const day = row.dataset.formDay;
    if (pattern?.weekendOnly && !pattern.allowedDays.includes(day)) {
      availability[day] = 'X';
      continue;
    }
    const mode = row.querySelector('.availability-mode').value;
    if (mode === 'unavailable') availability[day] = 'X';
    else if (mode === 'complete') availability[day] = 'COMPLETA';
    else {
      const start = row.querySelector('.start-time').value;
      const end = row.querySelector('.end-time').value;
      if (!start || !end || start === end) {
        toast(`Revisa el rango horario de ${day}.`);
        return;
      }
      availability[day] = `${start} - ${end}`;
    }
  }
  state.employees.push({
    id: Date.now(),
    name: $('#employee-name').value.trim(),
    rut,
    role: normalizeEmployeeRole($('#employee-role').value),
    hours: weeklyHours,
    overnight: $('#employee-overnight').checked,
    availability,
  });
  save();
  $('#employee-dialog').close();
  render();
  toast('Trabajador agregado correctamente.');
}

function formatRut(value) {
  const clean = String(value).replace(/[^0-9kK]/g, '').toUpperCase();
  if (clean.length < 2) return clean;
  const verifier = clean.slice(-1);
  const body = clean.slice(0, -1);
  const grouped = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${grouped}-${verifier}`;
}

function clearEmployeeSchedule(id) {
  delete state.schedule[id];
  delete state.recommendations[id];
}

function onCellChange(event) {
  const employee = state.employees.find((item) => item.id === Number(event.target.dataset.id));
  if (!employee) return;
  const field = event.target.dataset.field;
  if (field === 'hours') employee.hours = Number(event.target.value);
  else if (field === 'rut') employee.rut = formatRut(event.target.value);
  else employee[field] = field === 'role' ? normalizeEmployeeRole(event.target.value) : event.target.value.trim();
  clearEmployeeSchedule(employee.id);
  save();
  render();
}

function onAvailabilityStartChange(event) {
  const employee = state.employees.find((item) => item.id === Number(event.target.dataset.id));
  if (!employee) return;
  const day = event.target.dataset.day;
  const start = event.target.value;
  if (start === 'COMPLETA' || start === 'X') {
    employee.availability[day] = start;
  } else {
    const current = availabilityParts(employee.availability[day]);
    const previousDuration = current.mode === 'range' ? endMinutesForRange(start, current.end) - parseTime(start) : 0;
    const canKeepEnd = current.mode === 'range' && endWithinClosing(day, start, current.end) && previousDuration <= 16 * 60;
    const end = canKeepEnd ? current.end : defaultEndForDay(day, start);
    employee.availability[day] = `${start} - ${end}`;
  }
  clearEmployeeSchedule(employee.id);
  save();
  render();
}

function onAvailabilityEndChange(event) {
  const employee = state.employees.find((item) => item.id === Number(event.target.dataset.id));
  if (!employee || !event.target.value) return;
  const day = event.target.dataset.day;
  const current = availabilityParts(employee.availability[day]);
  if (current.mode !== 'range' || !endWithinClosing(day, current.start, event.target.value)) {
    toast(`El turno debe terminar antes del cierre de ${closingDisplay(day)}.`);
    render();
    return;
  }
  employee.availability[day] = `${current.start} - ${event.target.value}`;
  clearEmployeeSchedule(employee.id);
  save();
  render();
}

function onShiftChange(event) {
  const id = Number(event.target.dataset.id);
  state.schedule[id] ??= emptyDays();
  state.schedule[id][event.target.dataset.day] = event.target.value;
  save();
  render();
}

function copyShift(event) {
  const id = Number(event.currentTarget.dataset.id);
  const day = event.currentTarget.dataset.day;
  const value = state.schedule?.[id]?.[day];
  if (!value || value === 'LIBRE') return;
  shiftClipboard = { value, hours: shiftHours(value) };
  render();
  toast(`Turno ${value} copiado.`);
}

function pasteShift(event) {
  const id = Number(event.currentTarget.dataset.id);
  const day = event.currentTarget.dataset.day;
  const employee = state.employees.find((item) => item.id === id);
  const valid = shiftClipboard && employee && shiftOptions(employee, day, [shiftClipboard.hours]).some((option) => option.value === shiftClipboard.value);
  if (!valid) {
    toast('Ese turno no cabe en la disponibilidad seleccionada.');
    return;
  }
  state.schedule[id] ??= emptyDays();
  state.schedule[id][day] = shiftClipboard.value;
  save();
  render();
  toast('Turno pegado correctamente.');
}

function toggleOvernight(event) {
  const employee = state.employees.find((item) => item.id === Number(event.currentTarget.dataset.id));
  if (!employee) return;
  employee.overnight = !employee.overnight;
  clearEmployeeSchedule(employee.id);
  save();
  render();
}

function deleteEmployee(event) {
  const id = Number(event.currentTarget.dataset.id);
  if (!window.confirm('¿Eliminar este trabajador? Sus turnos guardados también se eliminarán.')) return;
  state.employees = state.employees.filter((item) => item.id !== id);
  delete state.schedule[id];
  delete state.recommendations[id];
  Object.values(state.history || {}).forEach((week) => {
    if (week.schedule) delete week.schedule[id];
    if (week.recommendations) delete week.recommendations[id];
  });
  save();
  render();
}

function changeWeek(week) {
  persistCurrentWeek();
  state.week = normalizeMonday(week);
  restoreWeek(state.week);
  state.view = 'schedule';
  save();
  render();
}

function copyPreviousWeek() {
  persistCurrentWeek();
  const previous = addDaysToDate(state.week, -7);
  const saved = state.history?.[previous];
  if (!saved?.schedule || !Object.keys(saved.schedule).length) {
    toast('La semana anterior todavía no tiene un horario guardado.');
    return;
  }
  state.schedule = clone(saved.schedule);
  state.recommendations = clone(saved.recommendations || saved.schedule);
  enforceClosingLimits();
  state.view = 'schedule';
  save();
  render();
  toast('Horario de la semana anterior copiado.');
}

function downloadBlob(content, type, filename) {
  const blob = new Blob([content], { type });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  link.remove();
}

function exportExcel() {
  const headers = ['Trabajador', 'RUT', 'Cargo', 'Horas contratadas', ...days, 'Horas asignadas'];
  const rows = state.employees.map((employee) => [employee.name, employee.rut, normalizeEmployeeRole(employee.role), employee.hours, ...days.map((day) => state.schedule[employee.id]?.[day] || 'LIBRE'), assignedHours(employee.id)]);
  const table = `<table><tr>${headers.map((cell) => `<th>${escapeHtml(cell)}</th>`).join('')}</tr>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</table>`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>table{border-collapse:collapse;font-family:Arial}th{background:#195c3b;color:#fff}th,td{border:1px solid #bbb;padding:6px}td{mso-number-format:"\\@"}</style></head><body><h2>TurnoFácil · ${escapeHtml(weekLabel())}</h2>${table}</body></html>`;
  downloadBlob(`\ufeff${html}`, 'application/vnd.ms-excel;charset=utf-8', `horario-${state.week}.xls`);
  toast('Archivo para Excel descargado.');
}

function exportBackup() {
  persistCurrentWeek();
  const backup = { application: 'TurnoFácil', version: appVersion, exportedAt: new Date().toISOString(), data: state };
  downloadBlob(JSON.stringify(backup, null, 2), 'application/json;charset=utf-8', `turnofacil-respaldo-${state.week}.json`);
  toast('Respaldo completo descargado.');
}

async function importBackup(event) {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    toast('El respaldo supera el límite de 5 MB.');
    return;
  }
  try {
    const parsed = JSON.parse(await file.text());
    const imported = parsed.data || parsed;
    if (!Array.isArray(imported.employees)) throw new Error('Formato inválido');
    if (!window.confirm('El respaldo reemplazará los datos actuales de este navegador. ¿Continuar?')) return;
    state = {
      ...state,
      ...imported,
      version: appVersion,
      week: normalizeMonday(imported.week || getMonday()),
      employees: imported.employees.map((employee, index) => ({ ...employee, id: Number(employee.id) || Date.now() + index, role: normalizeEmployeeRole(employee.role), availability: { ...complete(), ...(employee.availability || {}) } })),
      history: imported.history && typeof imported.history === 'object' ? imported.history : {},
    };
    delete state.coverageRules;
    delete state.strategy;
    Object.values(state.history).forEach((week) => { if (week && typeof week === 'object') delete week.strategy; });
    state.view = ['availability', 'schedule'].includes(state.view) ? state.view : 'availability';
    enforceClosingLimits();
    save();
    render();
    toast('Respaldo importado correctamente.');
  } catch (_) {
    toast('No se pudo importar: el archivo no es un respaldo válido.');
  }
}

function savePdf() {
  state.view = 'schedule';
  render();
  toast('En la ventana de impresión selecciona “Guardar como PDF”.');
  setTimeout(() => window.print(), 200);
}

function employeeHistoryStats(employeeId) {
  const weeks = Object.values(state.history || {});
  return weeks.reduce((stats, week) => {
    days.forEach((day) => {
      const value = week.schedule?.[employeeId]?.[day];
      const window = parseWindow(value);
      stats.hours += shiftHours(value);
      if (window && window.end === closingMinutes(day)) stats.closings += 1;
    });
    return stats;
  }, { hours: 0, closings: 0, weeks: weeks.length });
}

function renderIndividualReport() {
  const id = Number($('#individual-employee').value);
  const employee = state.employees.find((item) => item.id === id);
  if (!employee) {
    $('#individual-report-content').innerHTML = '<div class="empty-row">Selecciona un trabajador.</div>';
    return;
  }
  persistCurrentWeek();
  const stats = employeeHistoryStats(employee.id);
  const rows = days.map((day, index) => {
    const shift = state.schedule?.[employee.id]?.[day] || 'LIBRE';
    return `<tr><td><strong>${day}</strong><br><small>${dayDateLabel(index)}</small></td><td>${shift === 'LIBRE' ? 'Libre' : escapeHtml(shiftDescription(shift))}</td><td>${formatNumber(shiftHours(shift))} h</td></tr>`;
  }).join('');
  $('#individual-report-content').innerHTML = `<div class="individual-summary"><div><span>Cargo</span><strong>${escapeHtml(normalizeEmployeeRole(employee.role))}</strong></div><div><span>Contrato</span><strong>${formatNumber(employee.hours)} h</strong></div><div><span>Esta semana</span><strong>${formatNumber(assignedHours(employee.id))} h</strong></div><div><span>Historial</span><strong>${formatNumber(stats.hours)} h · ${stats.closings} cierres</strong></div></div><table class="individual-schedule"><thead><tr><th>Día</th><th>Turno</th><th>Trabajo</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function openIndividualReport() {
  if (!state.employees.length) {
    toast('Agrega un trabajador antes de abrir la vista individual.');
    return;
  }
  $('#individual-employee').innerHTML = state.employees.map((employee) => `<option value="${employee.id}">${escapeHtml(employee.name)} · ${escapeHtml(normalizeEmployeeRole(employee.role))}</option>`).join('');
  renderIndividualReport();
  $('#individual-dialog').showModal();
}

function printIndividualReport() {
  const employee = state.employees.find((item) => item.id === Number($('#individual-employee').value));
  if (!employee) return;
  const popup = window.open('', '_blank', 'width=850,height=700');
  if (!popup) {
    toast('El navegador bloqueó la ventana de impresión.');
    return;
  }
  popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Horario de ${escapeHtml(employee.name)}</title><style>body{font-family:Arial;padding:28px;color:#172019}h1{margin-bottom:4px}p{color:#68736b}.individual-summary{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid #ddd}.individual-summary div{padding:10px}.individual-summary span{display:block;font-size:9px;text-transform:uppercase;color:#68736b}.individual-summary strong{display:block;margin-top:4px}table{width:100%;border-collapse:collapse;margin-top:16px}th{background:#195c3b;color:white}th,td{border:1px solid #ccc;padding:8px;text-align:left}</style></head><body><h1>${escapeHtml(employee.name)}</h1><p>${escapeHtml(employee.rut)} · ${escapeHtml(normalizeEmployeeRole(employee.role))} · Semana ${escapeHtml(weekLabel())}</p>${$('#individual-report-content').innerHTML}</body></html>`);
  popup.document.close();
  popup.focus();
  setTimeout(() => popup.print(), 250);
}

function toast(message) {
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('show');
  setTimeout(() => element.classList.remove('show'), 2500);
}

function formatNumber(value) {
  return Number.isInteger(Number(value)) ? String(Number(value)) : Number(value).toFixed(1);
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character]);
}

function render() {
  $('#week').value = state.week;
  $('#week-title').textContent = `Horario del ${weekLabel()}`;
  $('#row-count').textContent = `${state.employees.length} trabajadores`;
  $('#view-hint').innerHTML = state.view === 'availability'
    ? 'Define la disponibilidad real; el generador nunca asignará un turno fuera de estos rangos.'
    : 'Puedes cambiar, copiar y pegar turnos válidos. Cada turno incluye <b>1 hora de colación</b>.';
  $$('.tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.view === state.view));
  renderMetrics();
  renderAlerts();
  renderTable();
}

$('#generate').addEventListener('click', generateSchedule);
$('#previous-week').addEventListener('click', () => changeWeek(addDaysToDate(state.week, -7)));
$('#next-week').addEventListener('click', () => changeWeek(addDaysToDate(state.week, 7)));
$('#current-week').addEventListener('click', () => changeWeek(getMonday()));
$('#week').addEventListener('change', (event) => changeWeek(event.target.value));
$('#copy-previous').addEventListener('click', copyPreviousWeek);
$('#open-add').addEventListener('click', openEmployeeDialog);
$('#close-add').addEventListener('click', () => $('#employee-dialog').close());
$('#cancel-add').addEventListener('click', () => $('#employee-dialog').close());
$('#employee-form').addEventListener('submit', addEmployeeFromForm);
$('#employee-hours').addEventListener('input', updateAvailabilityFormPattern);
$('#export').addEventListener('click', exportExcel);
$('#print').addEventListener('click', savePdf);
$('#individual-report').addEventListener('click', openIndividualReport);
$('#individual-employee').addEventListener('change', renderIndividualReport);
$('#close-individual').addEventListener('click', () => $('#individual-dialog').close());
$('#cancel-individual').addEventListener('click', () => $('#individual-dialog').close());
$('#print-individual').addEventListener('click', printIndividualReport);
$('#export-backup').addEventListener('click', exportBackup);
$('#import-backup').addEventListener('click', () => $('#backup-file').click());
$('#backup-file').addEventListener('change', importBackup);
$$('.tab').forEach((tab) => tab.addEventListener('click', () => { state.view = tab.dataset.view; render(); }));

load();
enforceClosingLimits();
render();
