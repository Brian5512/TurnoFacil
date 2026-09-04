const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const storageKey = 'turnofacil-html-v1';
const appVersion = 6;
const burgerKingLogoPng = 'data:image/png;base64,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';
const mealBreakHours = 1;
const complete = () => Object.fromEntries(days.map((day) => [day, 'COMPLETA']));
const emptyDays = () => Object.fromEntries(days.map((day) => [day, 'LIBRE']));
const defaultBusinessHours = () => Object.fromEntries(days.map((day) => [day, {
  start: '09:00',
  end: day === 'Viernes' || day === 'Sábado' ? '01:00' : '23:00',
}]));
const seed = [
  { id: 1, name: 'Trabajador 1', rut: '', role: 'Crew', hours: 30, overnight: false, availability: complete() },
  { id: 2, name: 'Trabajador 2', rut: '', role: 'Crew', hours: 20, overnight: false, availability: complete() },
];

let state = { version: appVersion, storeName: 'Plaza Bio Bio', employees: seed, week: getMonday(), view: 'availability', schedule: {}, businessHours: defaultBusinessHours(), history: {} };
let shiftClipboard = null;
let saveTimer;
const mobileExpandedEmployees = new Set();
let mobileExpansionInitialized = false;

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

function dayDateHeaderLabel(index) {
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic'];
  const date = dateForDay(index);
  return `${String(date.getDate()).padStart(2, '0')}-${months[date.getMonth()]}`;
}

function normalizeEmployeeRole(value) {
  return String(value || '').trim().toLocaleLowerCase('es') === 'crew-master' ? 'Crew-Master' : 'Crew';
}

function normalizeStoreName(value) {
  const normalized = String(value || '').trim().replace(/\s+/g, ' ');
  return normalized || 'Plaza Bio Bio';
}

function storeSlug(value) {
  return normalizeStoreName(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'tienda';
}

function normalizeBusinessHours(value) {
  const defaults = defaultBusinessHours();
  return Object.fromEntries(days.map((day) => {
    const candidate = value?.[day] || {};
    const start = timeValues.includes(candidate.start) ? candidate.start : defaults[day].start;
    const end = timeValues.includes(candidate.end) && candidate.end !== start ? candidate.end : defaults[day].end;
    return [day, { start, end }];
  }));
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved?.employees) {
      state = {
        ...state,
        ...saved,
        version: appVersion,
        storeName: normalizeStoreName(saved.storeName),
        employees: saved.employees.map((employee, index) => ({ ...employee, id: Number(employee.id) || Date.now() + index, role: normalizeEmployeeRole(employee.role), availability: { ...complete(), ...(employee.availability || {}) } })),
        businessHours: normalizeBusinessHours(saved.businessHours),
        history: saved.history && typeof saved.history === 'object' ? saved.history : {},
      };
      delete state.coverageRules;
      delete state.strategy;
      if (!Object.keys(state.schedule || {}).length && state.recommendations) state.schedule = clone(state.recommendations);
      delete state.recommendations;
      Object.values(state.history).forEach((week) => {
        if (!week || typeof week !== 'object') return;
        delete week.strategy;
        if (!Object.keys(week.schedule || {}).length && week.recommendations) week.schedule = clone(week.recommendations);
        delete week.recommendations;
      });
      if (!state.history[state.week] && Object.keys(state.schedule || {}).length) persistCurrentWeek();
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
  state.history[state.week] = {
    schedule: clone(state.schedule || {}),
    businessHours: clone(normalizeBusinessHours(state.businessHours)),
    updatedAt: new Date().toISOString(),
  };
}

function restoreWeek(week) {
  const savedWeek = state.history?.[week];
  state.schedule = clone(savedWeek?.schedule || {});
  state.businessHours = normalizeBusinessHours(savedWeek?.businessHours);
}

function save() {
  persistCurrentWeek();
  localStorage.setItem(storageKey, JSON.stringify(state));
  const indicator = $('#save-state');
  indicator.textContent = 'Guardado en este navegador';
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
const scheduleTimeValues = timeValues.filter((time) => parseTime(time) <= 23 * 60);

function businessHoursFor(day, source = state.businessHours) {
  return source?.[day] || defaultBusinessHours()[day];
}

function openingMinutesFor(day, source = state.businessHours) {
  return parseTime(businessHoursFor(day, source).start);
}

function closingMinutes(day, source = state.businessHours) {
  const hours = businessHoursFor(day, source);
  const start = parseTime(hours.start);
  let end = parseTime(hours.end);
  if (end <= start) end += 1440;
  return end;
}

function closingTime(day) {
  return formatTime(closingMinutes(day));
}

function closingDisplay(day) {
  return closingTime(day);
}

function businessHoursDisplay(day) {
  const hours = businessHoursFor(day);
  return `${hours.start} a ${hours.end}`;
}

function startTimeOptionsHtml(day, selected = '') {
  const limit = Math.min(closingMinutes(day), 1440);
  const available = timeValues.filter((time) => parseTime(time) >= openingMinutesFor(day) && parseTime(time) < limit);
  const current = selected && !available.includes(selected) ? `<option value="${selected}" selected>${selected}</option>` : '';
  return `${current}${available.map((time) => `<option value="${time}" ${time === selected ? 'selected' : ''}>${time}</option>`).join('')}`;
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
    options.push(`<option value="${value}" ${value === selected ? 'selected' : ''}>${value}</option>`);
  }
  const current = selected && !seen.has(selected) ? `<option value="${selected}" selected>${selected}</option>` : '';
  return options.length || current ? `${current}${options.join('')}` : '<option value="">Sin horas disponibles</option>';
}

function endWithinClosing(day, start, end) {
  return Boolean(start && end && start !== end && endMinutesForRange(start, end) <= closingMinutes(day));
}

function defaultEndForDay(day, start) {
  return formatTime(Math.min(parseTime(start) + 8 * 60, closingMinutes(day)));
}

function scheduleTimeOptionsHtml(selected = '') {
  const blank = !selected ? '<option value="" selected>—</option>' : '';
  const current = selected && !scheduleTimeValues.includes(selected)
    ? `<option value="${selected}" selected>${selected}</option>`
    : '';
  return `${blank}${current}${scheduleTimeValues.map((time) => `<option value="${time}" ${time === selected ? 'selected' : ''}>${time}</option>`).join('')}`;
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
  const suffix = note ? ` | ${note}` : '';
  return `${formatTime(window.start)} a ${formatTime(window.end)} | ${formatNumber(shiftHours(value))} h trabajo + 1 h colación${suffix}`;
}

function suggestedShiftHours(employee) {
  const weeklyHours = Number(employee.hours || 0);
  if (weeklyHours === 30) return 6;
  if (weeklyHours === 20) return 5;
  if (weeklyHours === 16) return 8;
  return Math.min(8, weeklyHours || 8);
}

function scheduleWindow(employee, day) {
  const end = employee.overnight ? closingMinutes(day) : Math.min(closingMinutes(day), 1440);
  const start = openingMinutesFor(day);
  return { start, end, capacity: Math.max(0, (end - start) / 60), ranged: false };
}

function dayWorkCapacity(employee, day) {
  const capacity = (scheduleWindow(employee, day)?.capacity ?? 0) - mealBreakHours;
  return Math.max(0, Math.floor(capacity * 2) / 2);
}

function shiftOptions(employee, day, extraDurations = []) {
  const options = [{ value: 'LIBRE', hours: 0, label: 'Libre' }];
  const window = scheduleWindow(employee, day);
  if (!window) return options;

  const collected = new Map();
  const add = (value, note = '') => {
    const hours = shiftHours(value);
    if (value !== 'LIBRE' && hours > 0 && !collected.has(value)) collected.set(value, { value, hours, label: shiftDescription(value, note) });
  };

  const dynamicDurations = extraDurations
    .map(Number)
    .filter((duration) => Number.isFinite(duration) && duration > 0)
    .map((duration) => Math.round(duration * 2) / 2);
  const maximumWorkHours = Math.max(0, Math.floor((window.capacity - mealBreakHours) * 2) / 2);
  const manualDurations = Array.from({ length: Math.floor(maximumWorkHours * 2) }, (_, index) => (index + 2) / 2);
  const durations = [...new Set([...manualDurations, ...dynamicDurations])]
    .filter((duration) => duration > 0 && duration <= maximumWorkHours);
  durations.forEach((duration) => {
    const elapsedMinutes = (duration + mealBreakHours) * 60;
    for (let start = window.start; start + elapsedMinutes <= window.end; start += 30) {
      const note = start + elapsedMinutes === window.end
        ? closingMinutes(day) > 1440 && employee.overnight ? 'cierre 01:00' : 'hasta cierre'
        : '';
      add(makeShift(start, duration), note);
    }
  });
  return [...options, ...collected.values()];
}

function weekLabel() {
  const start = new Date(`${state.week}T12:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const formatter = new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'short' });
  return `${formatter.format(start)} al ${formatter.format(end)}`;
}

function assignedHours(employeeId) {
  return days.reduce((sum, day) => sum + shiftHours(state.schedule[employeeId]?.[day]), 0);
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

function renderTable() {
  const table = $('#schedule-table');
  table.className = '';
  const body = state.employees.length ? state.employees.map(rowHtml).join('') : '<tr><td colspan="11" class="empty-row">No hay trabajadores. Usa “Agregar trabajador” para comenzar.</td></tr>';
  table.innerHTML = `<thead><tr><th>Trabajador y cargo</th><th class="hours">${state.view === 'schedule' ? 'Asignadas' : 'Horas'}</th>${days.map((day, index) => `<th class="day"><span>${day}</span><small><span class="day-date">${dayDateLabel(index)}</span><button type="button" class="day-window-button" data-action="business-hours" data-day="${day}" aria-label="Editar apertura y cierre de ${day}">${businessHoursDisplay(day)}</button></small></th>`).join('')}<th class="overnight">Cierre hasta 01:00</th><th class="remove"></th></tr></thead><tbody>${body}</tbody>`;
  table.querySelectorAll('[data-action="business-hours"]').forEach((button) => button.addEventListener('click', openBusinessHoursDialog));
  table.querySelectorAll('[data-field]').forEach((input) => input.addEventListener('change', onCellChange));
  table.querySelectorAll('[data-action="availability-start"]').forEach((select) => select.addEventListener('change', onAvailabilityStartChange));
  table.querySelectorAll('[data-action="availability-end"]').forEach((select) => select.addEventListener('change', onAvailabilityEndChange));
  table.querySelectorAll('[data-action="shift-start"]').forEach((select) => select.addEventListener('change', onShiftStartChange));
  table.querySelectorAll('[data-action="shift-end"]').forEach((select) => select.addEventListener('change', onShiftEndChange));
  table.querySelectorAll('[data-action="free-day"]').forEach((button) => button.addEventListener('click', setFreeDay));
  table.querySelectorAll('[data-action="copy-shift"]').forEach((button) => button.addEventListener('click', copyShift));
  table.querySelectorAll('[data-action="paste-shift"]').forEach((button) => button.addEventListener('click', pasteShift));
  table.querySelectorAll('[data-action="toggle-mobile-worker"]').forEach((button) => button.addEventListener('click', toggleMobileWorker));
  table.querySelectorAll('[data-action="overnight"]').forEach((button) => button.addEventListener('click', toggleOvernight));
  table.querySelectorAll('[data-action="delete"]').forEach((button) => button.addEventListener('click', deleteEmployee));
}

function employeeInitials(name) {
  return String(name || 'T').trim().split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase() || 'T';
}

function rowHtml(employee, index) {
  const assigned = assignedHours(employee.id);
  const mobileExpanded = mobileExpandedEmployees.has(employee.id);
  const hoursDifference = assigned - Number(employee.hours || 0);
  const hoursClass = hoursDifference > 0.001
    ? 'hours-over'
    : Math.abs(hoursDifference) < 0.01 ? 'hours-ok' : 'hours-warning';
  const dayCells = days.map((day) => {
    if (state.view === 'availability') {
      const availability = availabilityParts(employee.availability[day]);
      const startClass = availability.mode === 'unavailable' ? 'unavailable' : '';
      return `<td class="day-cell" data-label="${day}"><div class="availability-controls"><label class="availability-line"><span>Desde</span><select class="availability-time-select ${startClass}" data-id="${employee.id}" data-day="${day}" data-action="availability-start" aria-label="Hora de inicio de ${escapeHtml(employee.name)} para ${day}"><option value="COMPLETA" ${availability.start === 'COMPLETA' ? 'selected' : ''}>Completa</option><option value="X" ${availability.start === 'X' ? 'selected' : ''}>No disponible</option><optgroup label="Horas">${startTimeOptionsHtml(day, availability.mode === 'range' ? availability.start : '')}</optgroup></select></label><label class="availability-line"><span>Hasta</span><select class="availability-time-select availability-end" data-id="${employee.id}" data-day="${day}" data-action="availability-end" aria-label="Hora de término de ${escapeHtml(employee.name)} para ${day}" ${availability.mode !== 'range' ? 'disabled' : ''}>${endTimeOptionsHtml(day, availability.mode === 'range' ? availability.start : '', availability.end)}</select></label></div></td>`;
    }
    const current = state.schedule[employee.id]?.[day] || 'LIBRE';
    const currentWindow = parseWindow(current);
    const selectedStart = currentWindow ? formatTime(currentWindow.start) : '';
    const selectedEnd = currentWindow ? formatTime(currentWindow.end) : '';
    const canPaste = Boolean(shiftClipboard && !assignmentValidationMessage(employee, day, shiftClipboard.value));
    return `<td class="day-cell" data-label="${day}"><div class="shift-cell"><div class="shift-time-grid"><label class="shift-time-field"><span>Desde</span><select class="shift-time-select shift-start-select ${current === 'LIBRE' ? 'off' : ''}" data-id="${employee.id}" data-day="${day}" data-action="shift-start" aria-label="Hora de inicio de ${escapeHtml(employee.name)} para ${day}">${scheduleTimeOptionsHtml(selectedStart)}</select></label><label class="shift-time-field"><span>Hasta</span><select class="shift-time-select" data-id="${employee.id}" data-day="${day}" data-action="shift-end" aria-label="Hora de término de ${escapeHtml(employee.name)} para ${day}" ${currentWindow ? '' : 'disabled'}>${scheduleTimeOptionsHtml(selectedEnd)}</select></label></div><div class="shift-actions"><button type="button" class="shift-free-button ${current === 'LIBRE' ? 'active' : ''}" data-action="free-day" data-id="${employee.id}" data-day="${day}" aria-pressed="${current === 'LIBRE'}">Libre</button><div class="shift-tools"><button type="button" data-action="copy-shift" data-id="${employee.id}" data-day="${day}" ${current === 'LIBRE' ? 'disabled' : ''}>Copiar</button><button type="button" data-action="paste-shift" data-id="${employee.id}" data-day="${day}" ${canPaste ? '' : 'disabled'}>Pegar</button></div></div></div></td>`;
  }).join('');
  const hoursCell = state.view === 'schedule'
    ? `<div class="hours-summary ${hoursClass}"><strong>${formatNumber(assigned)}</strong><span>/ ${formatNumber(employee.hours)} h</span></div>`
    : `<div class="hours-editor"><input class="hours-input" type="number" min="1" max="60" data-id="${employee.id}" data-field="hours" value="${employee.hours}" aria-label="Horas semanales de ${escapeHtml(employee.name)}" /></div>`;
  return `<tr class="${mobileExpanded ? 'mobile-expanded' : ''}"><td class="person" data-label="Trabajador"><span class="person-avatar" aria-hidden="true">${escapeHtml(employeeInitials(employee.name))}</span><div class="person-fields"><input class="person-input" data-id="${employee.id}" data-field="name" value="${escapeHtml(employee.name)}" aria-label="Nombre del trabajador" /><input class="person-input rut" data-id="${employee.id}" data-field="rut" value="${escapeHtml(employee.rut)}" placeholder="RUT" aria-label="RUT de ${escapeHtml(employee.name)}" /><select class="person-input role" data-id="${employee.id}" data-field="role" aria-label="Cargo de ${escapeHtml(employee.name)}"><option value="Crew" ${employee.role === 'Crew' ? 'selected' : ''}>Crew</option><option value="Crew-Master" ${employee.role === 'Crew-Master' ? 'selected' : ''}>Crew-Master</option></select></div><button type="button" class="mobile-worker-toggle" data-id="${employee.id}" data-action="toggle-mobile-worker" aria-expanded="${mobileExpanded}">${mobileExpanded ? 'Ocultar semana' : 'Ver semana'}</button></td><td class="hours-cell" data-label="${state.view === 'schedule' ? 'Asignadas' : 'Horas'}">${hoursCell}</td>${dayCells}<td class="overnight-cell" data-label="Cierre hasta 01:00"><button class="toggle ${employee.overnight ? 'on' : ''}" data-id="${employee.id}" data-action="overnight" aria-label="${escapeHtml(employee.name)}: puede tener cierre hasta la 01:00, ${employee.overnight ? 'sí' : 'no'}">${employee.overnight ? 'SÍ' : 'NO'}</button></td><td class="remove-cell" data-label="Eliminar"><button class="delete" title="Eliminar trabajador" aria-label="Eliminar a ${escapeHtml(employee.name)}" data-id="${employee.id}" data-action="delete"></button></td></tr>`;
}

function toggleMobileWorker(event) {
  const id = Number(event.currentTarget.dataset.id);
  const expanded = mobileExpandedEmployees.has(id);
  if (expanded) mobileExpandedEmployees.delete(id);
  else mobileExpandedEmployees.add(id);
  const row = event.currentTarget.closest('tr');
  row.classList.toggle('mobile-expanded', !expanded);
  event.currentTarget.setAttribute('aria-expanded', String(!expanded));
  event.currentTarget.textContent = expanded ? 'Ver semana' : 'Ocultar semana';
}

function renderAvailabilityForm() {
  $('#availability-form').innerHTML = days.map((day) => {
    const start = businessHoursFor(day).start;
    const end = defaultEndForDay(day, start);
    return `<div class="availability-row" data-form-day="${day}"><div class="day-close"><strong>${day}</strong><small>${businessHoursDisplay(day)}</small></div><select class="availability-mode" aria-label="Disponibilidad de ${day}"><option value="complete">Completa</option><option value="range">Rango horario</option><option value="unavailable">No disponible</option></select><div class="time-fields" hidden><label>Desde <select class="start-time" aria-label="Hora de inicio de ${day}">${startTimeOptionsHtml(day, start)}</select></label><label>Hasta <select class="end-time" aria-label="Hora de término de ${day}">${endTimeOptionsHtml(day, start, end)}</select></label></div></div>`;
  }).join('');
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

function businessTimeOptionsHtml(selected) {
  return timeValues.map((time) => `<option value="${time}" ${time === selected ? 'selected' : ''}>${time}</option>`).join('');
}

function renderBusinessHoursFields() {
  $('#business-hours-fields').innerHTML = days.map((day) => {
    const hours = businessHoursFor(day);
    return `<div class="business-hours-row" data-business-day="${day}"><strong>${day}</strong><label>Desde<select data-business-field="start" aria-label="Hora de apertura de ${day}">${businessTimeOptionsHtml(hours.start)}</select></label><label>Hasta<select data-business-field="end" aria-label="Hora de cierre de ${day}">${businessTimeOptionsHtml(hours.end)}</select></label></div>`;
  }).join('');
}

function openBusinessHoursDialog(event) {
  renderBusinessHoursFields();
  const dialog = $('#business-hours-dialog');
  dialog.showModal();
  const day = event?.currentTarget?.dataset?.day;
  const target = day
    ? dialog.querySelector(`[data-business-day="${day}"] [data-business-field="start"]`)
    : dialog.querySelector('[data-business-field="start"]');
  setTimeout(() => target?.focus(), 0);
}

function saveBusinessHours(event) {
  event.preventDefault();
  const next = {};
  for (const row of $$('.business-hours-row')) {
    const day = row.dataset.businessDay;
    const start = row.querySelector('[data-business-field="start"]').value;
    const endSelect = row.querySelector('[data-business-field="end"]');
    const end = endSelect.value;
    if (start === end) {
      toast(`La apertura y el cierre de ${day} no pueden ser iguales.`);
      endSelect.focus();
      return;
    }
    next[day] = { start, end };
  }
  state.businessHours = normalizeBusinessHours(next);
  save();
  $('#business-hours-dialog').close();
  render();
  toast('Horarios de apertura y cierre actualizados.');
}

function updateAvailabilityFormPattern() {
  const note = $('#availability-pattern-note');
  note.textContent = 'Información de referencia: no limita la asignación manual de turnos.';
  $$('.availability-row').forEach((row) => {
    row.classList.remove('pattern-disabled');
    const mode = row.querySelector('.availability-mode');
    mode.disabled = false;
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
  const availability = {};
  for (const row of $$('.availability-row')) {
    const day = row.dataset.formDay;
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
  const employee = {
    id: Date.now(),
    name: $('#employee-name').value.trim(),
    rut,
    role: normalizeEmployeeRole($('#employee-role').value),
    hours: weeklyHours,
    overnight: $('#employee-overnight').checked,
    availability,
  };
  state.employees.push(employee);
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
  else employee[field] = field === 'role' ? normalizeEmployeeRole(event.target.value) : event.target.value.trim();
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
  save();
  render();
}

function validShiftOptionsForStart(employee, day, start) {
  return shiftOptions(employee, day)
    .filter((option) => option.value !== 'LIBRE' && formatTime(parseWindow(option.value).start) === start);
}

function onShiftStartChange(event) {
  const id = Number(event.target.dataset.id);
  const day = event.target.dataset.day;
  const employee = state.employees.find((item) => item.id === id);
  if (!employee) return;
  if (!event.target.value) return;
  const candidates = validShiftOptionsForStart(employee, day, event.target.value);
  if (!candidates.length) {
    toast(`No hay un turno válido desde las ${event.target.value} para ${day}.`);
    render();
    return;
  }
  const currentHours = shiftHours(state.schedule?.[id]?.[day]);
  const targetHours = currentHours || suggestedShiftHours(employee);
  candidates.sort((a, b) => Math.abs(a.hours - targetHours) - Math.abs(b.hours - targetHours) || a.hours - b.hours);
  state.schedule[id] ??= emptyDays();
  state.schedule[id][day] = candidates[0].value;
  save();
  render();
}

function setFreeDay(event) {
  const id = Number(event.currentTarget.dataset.id);
  const day = event.currentTarget.dataset.day;
  if (!state.employees.some((employee) => employee.id === id)) return;
  state.schedule[id] ??= emptyDays();
  state.schedule[id][day] = 'LIBRE';
  save();
  render();
}

function onShiftEndChange(event) {
  const id = Number(event.target.dataset.id);
  const day = event.target.dataset.day;
  const employee = state.employees.find((item) => item.id === id);
  const current = state.schedule?.[id]?.[day];
  const currentWindow = parseWindow(current);
  if (!employee || !currentWindow) return;
  const value = `${formatTime(currentWindow.start)} - ${event.target.value}`;
  const error = assignmentValidationMessage(employee, day, value);
  if (error) {
    toast(error);
    render();
    return;
  }
  state.schedule[id][day] = value;
  save();
  render();
}

function assignmentValidationMessage(employee, day, value) {
  if (!value || value === 'LIBRE') return '';
  if (!shiftOptions(employee, day, [shiftHours(value)]).some((option) => option.value === value)) return 'Ese turno no respeta el horario permitido para ese día.';
  return '';
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
  const error = shiftClipboard && employee ? assignmentValidationMessage(employee, day, shiftClipboard.value) : 'No hay un turno válido para pegar.';
  if (error) {
    toast(error);
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
  save();
  render();
}

function deleteEmployee(event) {
  const id = Number(event.currentTarget.dataset.id);
  if (!window.confirm('¿Eliminar este trabajador? Sus turnos guardados también se eliminarán.')) return;
  state.employees = state.employees.filter((item) => item.id !== id);
  delete state.schedule[id];
  Object.values(state.history || {}).forEach((week) => {
    if (week.schedule) delete week.schedule[id];
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

function buildExcelWorkbook() {
  if (typeof ExcelJS === 'undefined') throw new Error('ExcelJS no está disponible');
  persistCurrentWeek();
  const storeName = normalizeStoreName(state.storeName);
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'TurnoFácil';
  workbook.company = storeName;
  workbook.subject = `Horario crew — ${weekLabel()}`;
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Horario', {
    views: [{ showGridLines: false }],
    pageSetup: {
      paperSize: 1,
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 1,
      horizontalCentered: true,
      margins: { left: 0.2, right: 0.2, top: 0.2, bottom: 0.2, header: 0, footer: 0 },
    },
  });

  worksheet.columns = [
    { width: 5.3 },
    { width: 28 },
    { width: 6.57 },
    { width: 6 },
    ...days.map(() => ({ width: 11 })),
    { width: 12 },
    { width: 12 },
  ];

  const darkFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF632B2E' } };
  const dateFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7B3638' } };
  const greenFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9F1D2' } };
  const redFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFD6D6' } };
  const blackFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
  const thinBorder = {
    top: { style: 'thin', color: { argb: 'FF111111' } },
    left: { style: 'thin', color: { argb: 'FF111111' } },
    bottom: { style: 'thin', color: { argb: 'FF111111' } },
    right: { style: 'thin', color: { argb: 'FF111111' } },
  };

  worksheet.mergeCells('A1:D1');
  worksheet.mergeCells('G1:I1');
  worksheet.mergeCells('L1:M1');
  worksheet.getCell('A1').value = `Tienda: ${storeName}`;
  worksheet.getCell('G1').value = 'Horario crew';
  worksheet.getCell('L1').value = `Semana del ${weekLabel()}`;
  worksheet.getRow(1).height = 46;
  worksheet.getCell('A1').font = { name: 'Arial', size: 12, bold: true };
  worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'left' };
  worksheet.getCell('G1').font = { name: 'Arial', size: 16, bold: true, italic: true, underline: true };
  worksheet.getCell('G1').alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getCell('L1').font = { name: 'Arial', size: 9, bold: true };
  worksheet.getCell('L1').alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };

  worksheet.mergeCells('A2:A3');
  worksheet.mergeCells('B2:B3');
  worksheet.mergeCells('C2:C3');
  worksheet.mergeCells('D2:D3');
  worksheet.mergeCells('L2:M3');
  worksheet.getCell('A2').value = 'N°';
  worksheet.getCell('B2').value = 'NOMBRE Y RUT';
  worksheet.getCell('C2').value = 'HORAS';
  worksheet.getCell('D2').value = 'TR';
  worksheet.getCell('L2').value = 'FIRMA';

  days.forEach((day, index) => {
    const column = 5 + index;
    const dateCell = worksheet.getCell(2, column);
    const dayCell = worksheet.getCell(3, column);
    dateCell.value = dayDateLabel(index);
    dayCell.value = day.toUpperCase();
    dateCell.fill = dateFill;
    dayCell.fill = darkFill;
  });

  for (let row = 2; row <= 3; row += 1) {
    for (let column = 1; column <= 13; column += 1) {
      const cell = worksheet.getCell(row, column);
      if (!cell.fill?.fgColor) cell.fill = darkFill;
      cell.font = { name: 'Arial', size: row === 2 ? 8 : 7, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = thinBorder;
    }
  }
  worksheet.getCell('B2').alignment = { vertical: 'middle', horizontal: 'left' };
  worksheet.getRow(2).height = 20;
  worksheet.getRow(3).height = 20;

  state.employees.forEach((employee, index) => {
    const rowNumber = 4 + index;
    const row = worksheet.getRow(rowNumber);
    row.height = 24;
    row.getCell(1).value = index + 1;
    row.getCell(2).value = {
      richText: [
        { font: { name: 'Arial', size: 9, bold: true }, text: employee.name },
        { font: { name: 'Arial', size: 8 }, text: ` — RUT: ${employee.rut || 'Sin RUT'}` },
      ],
    };
    row.getCell(3).value = Number(employee.hours) || 0;
    row.getCell(4).value = employee.overnight ? 'SÍ' : 'NO';
    row.getCell(3).fill = Number(employee.hours) <= 20 ? redFill : greenFill;
    row.getCell(3).font = { name: 'Arial', size: 9, color: { argb: Number(employee.hours) <= 20 ? 'FFB51224' : 'FF176B2C' } };
    row.getCell(4).fill = redFill;
    row.getCell(4).font = { name: 'Arial', size: 8, color: { argb: 'FFA90F1F' } };

    days.forEach((day, dayIndex) => {
      const shiftCell = row.getCell(5 + dayIndex);
      const shift = state.schedule[employee.id]?.[day] || 'LIBRE';
      if (shift === 'LIBRE') {
        shiftCell.value = '';
        shiftCell.fill = blackFill;
      } else {
        shiftCell.value = shift;
        shiftCell.font = { name: 'Arial', size: 8 };
      }
    });

    for (let column = 1; column <= 13; column += 1) {
      const cell = row.getCell(column);
      cell.border = thinBorder;
      cell.alignment = { vertical: 'middle', horizontal: column === 2 ? 'left' : 'center', shrinkToFit: column === 2 };
      if (!cell.font) cell.font = { name: 'Arial', size: 8 };
    }
    worksheet.mergeCells(`L${rowNumber}:M${rowNumber}`);
  });

  const lastRow = Math.max(4, 3 + state.employees.length);
  worksheet.pageSetup.printArea = `A1:M${lastRow}`;
  return workbook;
}

async function exportExcel() {
  try {
    const workbook = buildExcelWorkbook();
    const content = await workbook.xlsx.writeBuffer();
    const storeName = normalizeStoreName(state.storeName);
    downloadBlob(content, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', `horario-${storeSlug(storeName)}-${state.week}.xlsx`);
    toast('Horario guardado en Excel y listo para imprimir.');
  } catch (error) {
    console.error(error);
    toast('No se pudo generar el archivo de Excel.');
  }
}

function exportLegacyExcel() {
  const storeName = normalizeStoreName(state.storeName);
  const dayGroups = days.map((day, index) => `<th class="date">${dayDateHeaderLabel(index)}</th>`).join('');
  const dayNames = days.map((day) => `<th class="day">${day.toUpperCase()}</th>`).join('');
  const rows = state.employees.map((employee, index) => {
    const shifts = days.map((day) => {
      const shift = state.schedule[employee.id]?.[day] || 'LIBRE';
      if (shift === 'LIBRE') return '<td class="free"></td>';
      const [start, end] = String(shift).split(' - ');
      return `<td class="shift">${escapeHtml(start || '')} - ${escapeHtml(end || '')}</td>`;
    }).join('');
    const hoursClass = Number(employee.hours) <= 20 ? 'hours hours-low' : 'hours';
    return `<tr><td class="number">${index + 1}</td><td class="person">${escapeHtml(employee.name)} <span class="rut-line">— RUT: ${escapeHtml(employee.rut || 'Sin RUT')}</span></td><td class="${hoursClass}">${formatNumber(employee.hours)}</td><td class="closing">${employee.overnight ? 'SÍ' : 'NO'}</td>${shifts}<td colspan="2" class="signature"></td></tr>`;
  }).join('');
  const dayColumns = days.map(() => '<col class="col-time">').join('');
  const roster = `<table class="roster"><colgroup><col class="col-number"><col class="col-person"><col class="col-hours"><col class="col-closing">${dayColumns}<col class="col-signature"><col class="col-signature"></colgroup><thead><tr class="sheet-meta"><td colspan="4" class="store">Tienda: ${escapeHtml(storeName)}</td><td colspan="2" class="meta-spacer"></td><td colspan="3" class="title-cell">Horario crew</td><td colspan="2" class="meta-spacer"></td><td colspan="2" class="week">Semana del ${escapeHtml(weekLabel())}</td></tr><tr><th rowspan="2" class="number">N°</th><th rowspan="2" class="person">NOMBRE Y RUT</th><th rowspan="2" class="hours-heading">HORAS</th><th rowspan="2" class="closing-heading">TR</th>${dayGroups}<th rowspan="2" colspan="2" class="signature">FIRMA</th></tr><tr>${dayNames}</tr></thead><tbody>${rows}</tbody></table>`;
  const html = `<!doctype html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Horario</x:Name><x:WorksheetOptions><x:Selected/><x:PageSetup><x:Layout x:Orientation="Landscape"/><x:PageMargins x:Bottom="0.20" x:Left="0.20" x:Right="0.20" x:Top="0.20"/></x:PageSetup><x:FitToPage/><x:Print><x:ValidPrinterInfo/><x:PaperSizeIndex>1</x:PaperSizeIndex><x:FitWidth>1</x:FitWidth><x:FitHeight>1</x:FitHeight><x:HorizontalResolution>600</x:HorizontalResolution><x:VerticalResolution>600</x:VerticalResolution></x:Print></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><style>@page{size:letter landscape;margin:.20in}body{font-family:Arial,Aptos,"Segoe UI",sans-serif;color:#111;margin:0;padding:0}.roster{width:100%;border-collapse:collapse;font-size:9px;table-layout:fixed}.roster .col-number{width:30px}.roster .col-person{width:190px}.roster .col-hours{width:38px}.roster .col-closing{width:34px}.roster .col-time{width:70px}.roster .col-signature{width:75px}.roster th,.roster td{height:27px;border:1px solid #111;padding:3px;text-align:center;mso-number-format:"\\@"}.roster tbody td{height:34px}.roster .sheet-meta td{height:76px;border:0;background:#fff;color:#111}.roster .sheet-meta .store{padding-left:8px;font-size:15px;font-weight:700;text-align:left}.roster .sheet-meta .title-cell{text-align:center;font-size:19px;font-weight:700;font-style:italic;text-decoration:underline}.roster .sheet-meta .week{padding-right:8px;font-size:11px;font-weight:700;text-align:right}.roster th{background:#632b2e;color:#fff;font-weight:800}.roster .hours-heading,.roster .closing-heading{text-align:left;padding-left:4px}.roster .date{background:#7b3638;font-size:10px}.roster .day{font-size:9px}.roster .number{font-size:9px}.roster .person{overflow:hidden;text-align:left;font-size:9px;font-weight:700;line-height:1.25;white-space:nowrap}.roster .person .rut-line{font-size:8px;font-weight:400}.roster .hours{background:#d9f1d2;color:#176b2c;font-size:10px}.roster .hours-low{background:#ffd6d6;color:#b51224}.roster .closing{background:#ffd6d6;color:#a90f1f}.roster .shift{background:#fff;font-size:10px;text-align:center;white-space:nowrap}.roster .free{background:#000}.roster .signature{background:#fff;color:#111}</style></head><body>${roster}</body></html>`;
  downloadBlob(`\ufeff${html}`, 'application/vnd.ms-excel;charset=utf-8', `horario-${storeSlug(storeName)}-${state.week}.xls`);
  toast('Horario guardado en Excel y listo para imprimir.');
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
      storeName: normalizeStoreName(imported.storeName),
      week: normalizeMonday(imported.week || getMonday()),
      employees: imported.employees.map((employee, index) => ({ ...employee, id: Number(employee.id) || Date.now() + index, role: normalizeEmployeeRole(employee.role), availability: { ...complete(), ...(employee.availability || {}) } })),
      businessHours: normalizeBusinessHours(imported.businessHours),
      history: imported.history && typeof imported.history === 'object' ? imported.history : {},
    };
    delete state.coverageRules;
    delete state.strategy;
    if (!Object.keys(state.schedule || {}).length && state.recommendations) state.schedule = clone(state.recommendations);
    delete state.recommendations;
    Object.values(state.history).forEach((week) => {
      if (!week || typeof week !== 'object') return;
      delete week.strategy;
      if (!Object.keys(week.schedule || {}).length && week.recommendations) week.schedule = clone(week.recommendations);
      delete week.recommendations;
      week.businessHours = normalizeBusinessHours(week.businessHours);
    });
    state.view = ['availability', 'schedule'].includes(state.view) ? state.view : 'availability';
    save();
    render();
    toast('Respaldo importado correctamente.');
  } catch (_) {
    toast('No se pudo importar: el archivo no es un respaldo válido.');
  }
}

function renderIndividualReport() {
  const id = Number($('#individual-employee').value);
  const employee = state.employees.find((item) => item.id === id);
  if (!employee) {
    $('#individual-report-content').innerHTML = '<div class="empty-row">Selecciona un trabajador.</div>';
    return;
  }
  persistCurrentWeek();
  const rows = days.map((day, index) => {
    const shift = state.schedule?.[employee.id]?.[day] || 'LIBRE';
    return `<tr><td><strong>${day}</strong><br><small>${dayDateLabel(index)}</small></td><td>${shift === 'LIBRE' ? 'Libre' : escapeHtml(shiftDescription(shift))}</td><td>${formatNumber(shiftHours(shift))} h</td></tr>`;
  }).join('');
  $('#individual-report-content').innerHTML = `<div class="individual-summary"><div><span>Cargo</span><strong>${escapeHtml(normalizeEmployeeRole(employee.role))}</strong></div><div><span>Contrato</span><strong>${formatNumber(employee.hours)} h</strong></div><div><span>Esta semana</span><strong>${formatNumber(assignedHours(employee.id))} h</strong></div></div><table class="individual-schedule"><thead><tr><th>Día</th><th>Turno</th><th>Trabajo</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function openIndividualReport() {
  if (!state.employees.length) {
    toast('Agrega un trabajador antes de abrir la vista individual.');
    return;
  }
  $('#individual-employee').innerHTML = state.employees.map((employee) => `<option value="${employee.id}">${escapeHtml(employee.name)} | ${escapeHtml(normalizeEmployeeRole(employee.role))}</option>`).join('');
  renderIndividualReport();
  $('#individual-dialog').showModal();
}

function openStoreSettings() {
  $('#store-name').value = normalizeStoreName(state.storeName);
  $('#store-settings-dialog').showModal();
  requestAnimationFrame(() => $('#store-name').select());
}

function saveStoreSettings(event) {
  event.preventDefault();
  state.storeName = normalizeStoreName($('#store-name').value);
  save();
  render();
  $('#store-settings-dialog').close();
  toast('Nombre de la tienda actualizado.');
}

function setSidebarOpen(open) {
  document.body.classList.toggle('sidebar-open', Boolean(open));
  $('#sidebar-reveal')?.setAttribute('aria-expanded', String(Boolean(open)));
}

function printIndividualReport() {
  const employee = state.employees.find((item) => item.id === Number($('#individual-employee').value));
  if (!employee) return;
  const popup = window.open('', '_blank', 'width=850,height=700');
  if (!popup) {
    toast('El navegador bloqueó la ventana de impresión.');
    return;
  }
  popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Horario de ${escapeHtml(employee.name)}</title><style>body{font-family:Aptos,"Segoe UI",sans-serif;padding:28px;color:#172019}h1{margin-bottom:4px}p{color:#68736b}.individual-summary{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid #ddd}.individual-summary div{padding:10px}.individual-summary span{display:block;font-size:9px;text-transform:uppercase;color:#68736b}.individual-summary strong{display:block;margin-top:4px}table{width:100%;border-collapse:collapse;margin-top:16px}th{background:#195c3b;color:white}th,td{border:1px solid #ccc;padding:8px;text-align:left}</style></head><body><h1>${escapeHtml(employee.name)}</h1><p>${escapeHtml(employee.rut)} | ${escapeHtml(normalizeEmployeeRole(employee.role))} | Semana ${escapeHtml(weekLabel())}</p>${$('#individual-report-content').innerHTML}</body></html>`);
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
  if (!mobileExpansionInitialized && typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches && state.employees[0]) {
    mobileExpandedEmployees.add(state.employees[0].id);
    mobileExpansionInitialized = true;
  }
  $('#week').value = state.week;
  $('#week-title').textContent = `Semana del ${weekLabel()}`;
  $('#current-store-name').textContent = normalizeStoreName(state.storeName);
  $('#row-count').textContent = `${state.employees.length} trabajadores`;
  $('#view-hint').innerHTML = state.view === 'availability'
    ? 'Disponibilidad informativa para consultar cuándo puede trabajar cada persona; no modifica el horario.'
    : 'La columna <b>Asignadas</b> suma automáticamente las horas de los turnos. Cada turno descuenta 1 hora de colación.';
  $$('.tab').forEach((tab) => {
    const active = tab.dataset.view === state.view;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  renderTable();
}

$('#previous-week').addEventListener('click', () => changeWeek(addDaysToDate(state.week, -7)));
$('#next-week').addEventListener('click', () => changeWeek(addDaysToDate(state.week, 7)));
$('#current-week').addEventListener('click', () => changeWeek(getMonday()));
$('#week').addEventListener('change', (event) => changeWeek(event.target.value));
$('#open-add').addEventListener('click', openEmployeeDialog);
$('#open-business-hours').addEventListener('click', openBusinessHoursDialog);
$('#open-store-settings').addEventListener('click', openStoreSettings);
$('#current-store-name').addEventListener('click', openStoreSettings);
$('#close-store-settings').addEventListener('click', () => $('#store-settings-dialog').close());
$('#cancel-store-settings').addEventListener('click', () => $('#store-settings-dialog').close());
$('#store-settings-form').addEventListener('submit', saveStoreSettings);
$('#close-business-hours').addEventListener('click', () => $('#business-hours-dialog').close());
$('#cancel-business-hours').addEventListener('click', () => $('#business-hours-dialog').close());
$('#business-hours-form').addEventListener('submit', saveBusinessHours);
$('#close-add').addEventListener('click', () => $('#employee-dialog').close());
$('#cancel-add').addEventListener('click', () => $('#employee-dialog').close());
$('#employee-form').addEventListener('submit', addEmployeeFromForm);
$('#employee-hours').addEventListener('input', updateAvailabilityFormPattern);
$('#export').addEventListener('click', exportExcel);
$('#individual-report').addEventListener('click', openIndividualReport);
$('#individual-employee').addEventListener('change', renderIndividualReport);
$('#close-individual').addEventListener('click', () => $('#individual-dialog').close());
$('#cancel-individual').addEventListener('click', () => $('#individual-dialog').close());
$('#print-individual').addEventListener('click', printIndividualReport);
$('#export-backup').addEventListener('click', exportBackup);
$('#import-backup').addEventListener('click', () => $('#backup-file').click());
$('#backup-file').addEventListener('change', importBackup);
$$('.tab').forEach((tab) => tab.addEventListener('click', () => { state.view = tab.dataset.view; render(); }));

const sidebar = $('.sidebar');
const sidebarReveal = $('#sidebar-reveal');
const desktopSidebar = window.matchMedia('(min-width: 901px) and (hover: hover)');
sidebarReveal.addEventListener('mouseenter', () => { if (desktopSidebar.matches) setSidebarOpen(true); });
sidebarReveal.addEventListener('click', () => setSidebarOpen(!document.body.classList.contains('sidebar-open')));
sidebar.addEventListener('mouseenter', () => { if (desktopSidebar.matches) setSidebarOpen(true); });
sidebar.addEventListener('mouseleave', () => { if (desktopSidebar.matches) setSidebarOpen(false); });
sidebar.addEventListener('click', (event) => {
  if (!desktopSidebar.matches && event.target.closest('button')) setSidebarOpen(false);
});
document.addEventListener('pointerdown', (event) => {
  if (desktopSidebar.matches || !document.body.classList.contains('sidebar-open')) return;
  if (!sidebar.contains(event.target) && !sidebarReveal.contains(event.target)) setSidebarOpen(false);
});
document.addEventListener('pointermove', (event) => {
  if (!desktopSidebar.matches) return;
  if (event.clientX <= 16) setSidebarOpen(true);
  else if (event.clientX > 280 && !sidebar.matches(':hover') && !sidebar.contains(document.activeElement)) setSidebarOpen(false);
}, { passive: true });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setSidebarOpen(false); });
desktopSidebar.addEventListener('change', () => setSidebarOpen(false));

load();
render();

if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
const resetInitialScroll = () => window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }));
window.addEventListener('pageshow', resetInitialScroll);
resetInitialScroll();
