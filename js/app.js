const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const complete = () => Object.fromEntries(days.map((day) => [day, 'COMPLETA']));
const seed = [
  { id: 1, name: 'Trabajador 1', rut: '', hours: 30, overnight: false, availability: complete() },
  { id: 2, name: 'Trabajador 2', rut: '', hours: 20, overnight: false, availability: complete() },
];

let state = { employees: seed, week: getMonday(), view: 'availability', schedule: {}, recommendations: {} };
let saveTimer;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function getMonday() {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
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

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem('turnofacil-html-v1'));
    if (saved?.employees) state = { ...state, ...saved };
  } catch (_) { /* Mantener datos iniciales si el almacenamiento está dañado. */ }
  const systemWeek = getMonday();
  if (state.week !== systemWeek) {
    state.week = systemWeek;
    state.schedule = {};
    state.recommendations = {};
  }
}

function save() {
  localStorage.setItem('turnofacil-html-v1', JSON.stringify(state));
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
  return timeValues.filter((time) => parseTime(time) < limit).map((time) => `<option value="${time}" ${time === selected ? 'selected' : ''}>${time}</option>`).join('');
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
  return parseWindow(value)?.capacity ?? 0;
}

function makeShift(start, duration) {
  return `${formatTime(start)} - ${formatTime(start + duration * 60)}`;
}

function shiftDescription(value, note = '') {
  const window = parseWindow(value);
  if (!window) return value;
  const suffix = note ? ` · ${note}` : '';
  return `${formatTime(window.start)} → ${formatTime(window.end)} · ${formatNumber(window.capacity)} h${suffix}`;
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
  if (pattern.weekendOnly) return 'Solo sábado y domingo · 8 h/día';
  return `${pattern.code} · ${pattern.dailyHours} h/día`;
}

function shiftOptions(employee, day) {
  const availability = String(employee.availability[day] || '').trim().toUpperCase();
  const options = [{ value: 'LIBRE', hours: 0, label: 'Libre' }];
  const pattern = workPattern(employee);
  if (pattern && !pattern.allowedDays.includes(day)) return options;
  if (!availability || availability === 'X') return options;

  const collected = new Map();
  const add = (value, note = '') => {
    if (value !== 'LIBRE' && !collected.has(value)) collected.set(value, { value, hours: shiftHours(value), label: shiftDescription(value, note) });
  };

  const rawWindow = parseWindow(availability);
  const employeeClosing = employee.overnight ? closingMinutes(day) : Math.min(closingMinutes(day), 1440);
  const window = rawWindow && rawWindow.start < employeeClosing
    ? { ...rawWindow, end: Math.min(rawWindow.end, employeeClosing), capacity: (Math.min(rawWindow.end, employeeClosing) - rawWindow.start) / 60 }
    : null;
  if (rawWindow && !window) return options;
  if (window) {
    const requestedDurations = pattern ? [pattern.dailyHours] : [4, 6, 8];
    const durations = requestedDurations.filter((duration) => duration <= window.capacity);
    if (!durations.length && !pattern) add(`${formatTime(window.start)} - ${formatTime(window.end)}`, 'todo el rango');
    durations.forEach((duration) => {
      add(makeShift(window.start, duration), 'desde apertura');
      const closingStart = window.end - duration * 60;
      add(makeShift(closingStart, duration), 'hasta cierre');
    });
    if (!pattern && window.capacity <= 10 && !durations.some((duration) => Math.abs(duration - window.capacity) < 0.01)) {
      add(`${formatTime(window.start)} - ${formatTime(window.end)}`, 'rango completo');
    }
  } else {
    const starts = day === 'Sábado' || day === 'Domingo' ? [10, 12, 14] : [9, 10, 12, 14];
    const durations = pattern ? [pattern.dailyHours] : [4, 6, 8];
    durations.forEach((duration) => {
      starts.filter((start) => start * 60 + duration * 60 <= employeeClosing).forEach((start) => add(makeShift(start * 60, duration)));
      const closingStart = employeeClosing - duration * 60;
      if (closingStart >= 0 && closingStart < 1440) add(makeShift(closingStart, duration), closingMinutes(day) > 1440 && employee.overnight ? 'cierre 01:00' : 'hasta cierre');
    });
  }
  return [...options, ...collected.values()];
}

function enforceClosingLimits() {
  let changed = false;
  for (const employee of state.employees) {
    for (const day of days) {
      const availability = availabilityParts(employee.availability[day]);
      if (availability.mode === 'range' && !endWithinClosing(day, availability.start, availability.end)) {
        if (parseTime(availability.start) >= Math.min(closingMinutes(day), 1440)) employee.availability[day] = 'X';
        else employee.availability[day] = `${availability.start} - ${closingTime(day)}`;
        changed = true;
      }
      const current = state.schedule?.[employee.id]?.[day];
      if (current && current !== 'LIBRE' && !shiftOptions(employee, day).some((option) => option.value === current)) {
        state.schedule[employee.id][day] = 'LIBRE';
        if (state.recommendations?.[employee.id]) state.recommendations[employee.id][day] = 'LIBRE';
        changed = true;
      }
    }
  }
  if (changed) localStorage.setItem('turnofacil-html-v1', JSON.stringify(state));
}

function bestShift(employee, day, remaining) {
  const pattern = workPattern(employee);
  const options = shiftOptions(employee, day).filter((option) => option.hours > 0 && (!pattern || Math.abs(option.hours - pattern.dailyHours) < 0.01));
  if (!options.length) return null;
  const target = pattern ? pattern.dailyHours : Math.min(8, remaining);
  const notOver = options.filter((option) => option.hours <= remaining + 0.001);
  const pool = notOver.length ? notOver : options;
  return pool.sort((a, b) => Math.abs(a.hours - target) - Math.abs(b.hours - target))[0];
}

function generateSchedule() {
  state.week = getMonday();
  const schedule = {};
  const recommendations = {};
  for (const employee of state.employees) {
    const pattern = workPattern(employee);
    let remaining = Number(employee.hours || 0);
    schedule[employee.id] = Object.fromEntries(days.map((day) => [day, 'LIBRE']));
    recommendations[employee.id] = Object.fromEntries(days.map((day) => [day, 'LIBRE']));
    const eligibleDays = pattern ? pattern.allowedDays : days;
    const availableDays = eligibleDays.filter((day) => shiftOptions(employee, day).some((option) => option.hours > 0 && (!pattern || Math.abs(option.hours - pattern.dailyHours) < 0.01)));
    const recommendedDays = pattern ? availableDays.slice(0, pattern.workDays) : availableDays;
    for (const day of recommendedDays) {
      if (remaining <= 0.01) break;
      const option = bestShift(employee, day, remaining);
      if (!option) continue;
      schedule[employee.id][day] = option.value;
      recommendations[employee.id][day] = option.value;
      remaining = Math.max(0, remaining - option.hours);
    }
  }
  state.schedule = schedule;
  state.recommendations = recommendations;
  state.view = 'schedule';
  save();
  render();
  toast('Recomendaciones generadas según disponibilidad y horas semanales.');
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
    const availableDays = pattern.allowedDays.filter((day) => shiftOptions(employee, day).some((option) => Math.abs(option.hours - pattern.dailyHours) < 0.01));
    return Math.min(availableDays.length, pattern.workDays) * pattern.dailyHours;
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
  return usedDays.length === pattern.workDays
    && usedDays.every((day) => pattern.allowedDays.includes(day) && Math.abs(shiftHours(state.schedule[employee.id]?.[day]) - pattern.dailyHours) < 0.01);
}

function renderMetrics() {
  const totalContracted = state.employees.reduce((sum, employee) => sum + Number(employee.hours || 0), 0);
  const totalAssigned = state.employees.reduce((sum, employee) => sum + assignedHours(employee.id), 0);
  const alerts = state.employees.filter((employee) => {
    if (state.view === 'schedule' && state.schedule[employee.id]) return !followsWorkPattern(employee);
    return availabilityCapacity(employee) < Number(employee.hours || 0);
  }).length;
  const metrics = [
    ['Equipo', state.employees.length, 'trabajadores activos', '●'],
    [state.view === 'schedule' ? 'Horas programadas' : 'Horas contratadas', state.view === 'schedule' ? totalAssigned : totalContracted, state.view === 'schedule' ? `de ${totalContracted} contratadas` : 'horas semanales', '◷'],
    ['Alertas', alerts, state.view === 'schedule' ? 'contratos por ajustar' : 'disponibilidad insuficiente', alerts ? '!' : '✓'],
  ];
  $('#metrics').innerHTML = metrics.map(([label, value, note, icon]) => `<div class="metric"><div class="metric-label"><span>${label}</span><span class="metric-icon">${icon}</span></div><div class="metric-value">${formatNumber(value)}</div><div class="metric-note">${note}</div></div>`).join('');
}

function renderTable() {
  const table = $('#schedule-table');
  const body = state.employees.length ? state.employees.map(rowHtml).join('') : '<tr><td colspan="11" class="empty-row">No hay trabajadores. Usa “Agregar trabajador” para comenzar.</td></tr>';
  const today = localDateValue(new Date());
  table.innerHTML = `<thead><tr><th>Trabajador</th><th class="hours">${state.view === 'schedule' ? 'Asignadas' : 'Horas'}</th>${days.map((day, index) => `<th class="day ${localDateValue(dateForDay(index)) === today ? 'today' : ''}"><span>${day}</span><small>${dayDateLabel(index)} · Cierre ${closingDisplay(day)}</small></th>`).join('')}<th class="overnight">Cierre hasta 01:00</th><th class="remove"></th></tr></thead><tbody>${body}</tbody>`;
  table.querySelectorAll('[data-field]').forEach((input) => input.addEventListener('change', onCellChange));
  table.querySelectorAll('[data-action="availability-start"]').forEach((select) => select.addEventListener('change', onAvailabilityStartChange));
  table.querySelectorAll('[data-action="availability-end"]').forEach((select) => select.addEventListener('change', onAvailabilityEndChange));
  table.querySelectorAll('[data-action="shift"]').forEach((select) => select.addEventListener('change', onShiftChange));
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
    const options = shiftOptions(employee, day);
    const recommended = state.recommendations?.[employee.id]?.[day] || 'LIBRE';
    if (current !== 'LIBRE' && !options.some((option) => option.value === current)) {
      options.splice(1, 0, { value: current, hours: shiftHours(current), label: `${shiftDescription(current)} · guardado` });
    }
    const currentWindow = parseWindow(current);
    const isRecommended = current !== 'LIBRE' && current === recommended;
    const details = currentWindow
      ? `<div class="shift-details ${isRecommended ? 'recommended' : ''}"><div class="shift-details-head"><span>${isRecommended ? '★ Recomendado' : 'Turno elegido'}</span><strong>${formatNumber(currentWindow.capacity)} h</strong></div><div class="shift-times"><span><small>Inicio</small><b>${formatTime(currentWindow.start)}</b></span><i>→</i><span><small>Fin</small><b>${formatTime(currentWindow.end)}</b></span></div></div>`
      : '<div class="shift-free">Sin turno asignado</div>';
    return `<td><div class="shift-cell"><select class="shift-select ${current === 'LIBRE' ? 'off' : ''}" data-id="${employee.id}" data-day="${day}" data-action="shift" aria-label="Turno de ${escapeHtml(employee.name)} para ${day}">${options.map((option) => { const label = option.value !== 'LIBRE' && option.value === recommended ? `★ Recomendada · ${option.label}` : option.label; return `<option value="${escapeHtml(option.value)}" ${option.value === current ? 'selected' : ''}>${escapeHtml(label)}</option>`; }).join('')}</select>${details}</div></td>`;
  }).join('');
  const hoursCell = state.view === 'schedule'
    ? `<div class="hours-summary ${hoursClass}"><strong>${formatNumber(assigned)}</strong><span>/ ${formatNumber(employee.hours)} h</span><small>${patternSummary(employee)}</small></div>`
    : `<div class="hours-editor"><input class="hours-input" type="number" min="1" max="60" data-id="${employee.id}" data-field="hours" value="${employee.hours}" /><small>${patternSummary(employee)}</small></div>`;
  return `<tr><td class="person"><input class="person-input" data-id="${employee.id}" data-field="name" value="${escapeHtml(employee.name)}" /><input class="person-input rut" data-id="${employee.id}" data-field="rut" value="${escapeHtml(employee.rut)}" placeholder="RUT" /></td><td>${hoursCell}</td>${dayCells}<td><button class="toggle ${employee.overnight ? 'on' : ''}" data-id="${employee.id}" data-action="overnight" aria-label="${escapeHtml(employee.name)}: puede tener cierre hasta la 01:00, ${employee.overnight ? 'sí' : 'no'}">${employee.overnight ? 'SÍ' : 'NO'}</button></td><td class="remove-cell"><button class="delete" title="Eliminar trabajador" data-id="${employee.id}" data-action="delete">×</button></td></tr>`;
}

function renderAvailabilityForm() {
  $('#availability-form').innerHTML = days.map((day) => `<div class="availability-row" data-form-day="${day}"><div class="day-close"><strong>${day}</strong><small>Cierre ${closingDisplay(day)}</small></div><select class="availability-mode" aria-label="Disponibilidad de ${day}"><option value="complete">Completa</option><option value="range">Rango horario</option><option value="unavailable">No disponible</option></select><div class="time-fields" hidden><label>Desde <select class="start-time" aria-label="Hora de inicio de ${day}">${startTimeOptionsHtml(day, '09:00')}</select></label><label>Hasta <select class="end-time" aria-label="Hora de término de ${day}">${endTimeOptionsHtml(day, '09:00', '18:00')}</select></label></div></div>`).join('');
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
  if (pattern?.weekendOnly) note.textContent = '16 horas: solo se considerarán sábado y domingo, con turnos de 8 horas.';
  else if (pattern) note.textContent = `${hours} horas: regla ${pattern.code}, ${pattern.workDays} días de ${pattern.dailyHours} horas según disponibilidad.`;
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
  renderAvailabilityForm();
  $('#employee-dialog').showModal();
  setTimeout(() => $('#employee-name').focus(), 0);
}

function addEmployeeFromForm(event) {
  event.preventDefault();
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
    rut: formatRut($('#employee-rut').value),
    hours: weeklyHours,
    overnight: $('#employee-overnight').checked,
    availability,
  });
  state.schedule = {};
  state.recommendations = {};
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

function onCellChange(event) {
  const employee = state.employees.find((item) => item.id === Number(event.target.dataset.id));
  if (!employee) return;
  const field = event.target.dataset.field;
  if (field === 'hours') employee.hours = Number(event.target.value);
  else if (field === 'rut') employee.rut = formatRut(event.target.value);
  else employee[field] = event.target.value;
  state.schedule = {};
  state.recommendations = {};
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
  state.schedule = {};
  state.recommendations = {};
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
  state.schedule = {};
  state.recommendations = {};
  save();
  render();
}

function onShiftChange(event) {
  const id = Number(event.target.dataset.id);
  state.schedule[id] ??= Object.fromEntries(days.map((day) => [day, 'LIBRE']));
  state.schedule[id][event.target.dataset.day] = event.target.value;
  save();
  render();
}

function toggleOvernight(event) {
  const employee = state.employees.find((item) => item.id === Number(event.currentTarget.dataset.id));
  if (!employee) return;
  employee.overnight = !employee.overnight;
  state.schedule = {};
  state.recommendations = {};
  save();
  render();
}

function deleteEmployee(event) {
  const id = Number(event.currentTarget.dataset.id);
  state.employees = state.employees.filter((item) => item.id !== id);
  delete state.schedule[id];
  delete state.recommendations[id];
  save();
  render();
}

function exportCsv() {
  const rows = [['Trabajador', 'RUT', 'Horas semanales', ...days], ...state.employees.map((employee) => [employee.name, employee.rut, String(employee.hours), ...days.map((day) => state.schedule[employee.id]?.[day] || employee.availability[day])])];
  const content = '\ufeff' + rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(';')).join('\r\n');
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `horario-${state.week}.csv`;
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  link.remove();
  toast('Horario descargado correctamente.');
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
  $$('.tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.view === state.view));
  renderMetrics();
  renderTable();
}

$('#generate').addEventListener('click', generateSchedule);
$('#open-add').addEventListener('click', openEmployeeDialog);
$('#close-add').addEventListener('click', () => $('#employee-dialog').close());
$('#cancel-add').addEventListener('click', () => $('#employee-dialog').close());
$('#employee-form').addEventListener('submit', addEmployeeFromForm);
$('#employee-hours').addEventListener('input', updateAvailabilityFormPattern);
$('#export').addEventListener('click', exportCsv);
$('#print').addEventListener('click', () => window.print());
$$('.tab').forEach((tab) => tab.addEventListener('click', () => { state.view = tab.dataset.view; render(); }));

load();
enforceClosingLimits();
render();
