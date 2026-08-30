const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const complete = () => Object.fromEntries(days.map((day) => [day, 'COMPLETA']));
const seed = [
  { id: 1, name: 'Trabajador 1', rut: '', hours: 30, overnight: false, availability: complete() },
  { id: 2, name: 'Trabajador 2', rut: '', hours: 20, overnight: false, availability: complete() },
];

let state = { employees: seed, week: getMonday(), view: 'availability', schedule: {} };
let saveTimer;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function getMonday() {
  const date = new Date();
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  return date.toISOString().slice(0, 10);
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem('turnofacil-html-v1'));
    if (saved?.employees) state = { ...state, ...saved };
  } catch (_) { /* Mantener datos iniciales si el almacenamiento está dañado. */ }
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

function parseWindow(value) {
  const match = String(value).match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
  if (!match) return null;
  const start = parseTime(match[1]);
  let end = parseTime(match[2]);
  if (end <= start) end += 1440;
  return { start, end, capacity: (end - start) / 60 };
}

function shiftHours(value) {
  if (!value || value === 'LIBRE') return 0;
  return parseWindow(value)?.capacity ?? 0;
}

function makeShift(start, duration) {
  return `${formatTime(start)} - ${formatTime(start + duration * 60)}`;
}

function shiftOptions(employee, day) {
  const availability = String(employee.availability[day] || '').trim().toUpperCase();
  const options = [{ value: 'LIBRE', hours: 0, label: 'Libre' }];
  if (!availability || availability === 'X') return options;

  const collected = new Map();
  const add = (value, label = value) => {
    if (value !== 'LIBRE' && !collected.has(value)) collected.set(value, { value, hours: shiftHours(value), label });
  };

  const window = parseWindow(availability);
  if (window) {
    const durations = [4, 6, 8].filter((duration) => duration <= window.capacity);
    if (!durations.length) add(`${formatTime(window.start)} - ${formatTime(window.end)}`, `Todo el rango · ${window.capacity.toFixed(1)} h`);
    durations.forEach((duration) => {
      add(makeShift(window.start, duration), `${duration} h · desde apertura`);
      const closingStart = window.end - duration * 60;
      add(makeShift(closingStart, duration), `${duration} h · hasta cierre`);
    });
    if (window.capacity <= 10 && !durations.some((duration) => Math.abs(duration - window.capacity) < 0.01)) {
      add(`${formatTime(window.start)} - ${formatTime(window.end)}`, `Rango completo · ${window.capacity.toFixed(1)} h`);
    }
  } else {
    const starts = day === 'Sábado' || day === 'Domingo' ? [10, 12, 14] : [9, 10, 12, 14];
    [4, 6, 8].forEach((duration) => starts.forEach((start) => add(makeShift(start * 60, duration), `${duration} h · inicia ${formatTime(start * 60)}`)));
    if (employee.overnight) add('17:00 - 01:00', '8 h · trasnoche');
  }
  return [...options, ...collected.values()];
}

function bestShift(employee, day, remaining) {
  const options = shiftOptions(employee, day).filter((option) => option.hours > 0);
  if (!options.length) return null;
  const target = Math.min(8, remaining);
  const notOver = options.filter((option) => option.hours <= remaining + 0.001);
  const pool = notOver.length ? notOver : options;
  return pool.sort((a, b) => Math.abs(a.hours - target) - Math.abs(b.hours - target))[0];
}

function generateSchedule() {
  const schedule = {};
  for (const employee of state.employees) {
    let remaining = Number(employee.hours || 0);
    schedule[employee.id] = Object.fromEntries(days.map((day) => [day, 'LIBRE']));
    const availableDays = days.filter((day) => shiftOptions(employee, day).length > 1).slice(0, 5);
    for (const day of availableDays) {
      if (remaining <= 0.01) break;
      const option = bestShift(employee, day, remaining);
      if (!option) continue;
      schedule[employee.id][day] = option.value;
      remaining = Math.max(0, remaining - option.hours);
    }
  }
  state.schedule = schedule;
  state.view = 'schedule';
  save();
  render();
  toast('Propuesta generada. Puedes cambiar cada turno desde sus opciones.');
}

function weekLabel() {
  const start = new Date(`${state.week}T12:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const formatter = new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'short' });
  return `${formatter.format(start)} — ${formatter.format(end)}`;
}

function availabilityCapacity(employee) {
  return days.filter((day) => shiftOptions(employee, day).length > 1).slice(0, 5).reduce((total, day) => {
    const max = Math.max(...shiftOptions(employee, day).map((option) => option.hours));
    return total + max;
  }, 0);
}

function assignedHours(employeeId) {
  return days.reduce((sum, day) => sum + shiftHours(state.schedule[employeeId]?.[day]), 0);
}

function renderMetrics() {
  const totalContracted = state.employees.reduce((sum, employee) => sum + Number(employee.hours || 0), 0);
  const totalAssigned = state.employees.reduce((sum, employee) => sum + assignedHours(employee.id), 0);
  const alerts = state.employees.filter((employee) => {
    if (state.view === 'schedule' && state.schedule[employee.id]) return Math.abs(assignedHours(employee.id) - Number(employee.hours || 0)) > 0.01;
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
  table.innerHTML = `<thead><tr><th>Trabajador</th><th class="hours">${state.view === 'schedule' ? 'Asignadas' : 'Horas'}</th>${days.map((day) => `<th class="day">${day}</th>`).join('')}<th class="overnight">Trasnoche</th><th class="remove"></th></tr></thead><tbody>${body}</tbody>`;
  table.querySelectorAll('[data-field]').forEach((input) => input.addEventListener('change', onCellChange));
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
      const value = employee.availability[day] || '';
      const unavailable = !value || value === 'X';
      return `<td><input class="cell-input ${unavailable ? 'unavailable' : ''}" data-id="${employee.id}" data-day="${day}" data-field="availability" value="${escapeHtml(value)}" aria-label="${escapeHtml(employee.name)}, ${day}" /></td>`;
    }
    const current = state.schedule[employee.id]?.[day] || 'LIBRE';
    const options = shiftOptions(employee, day);
    if (current !== 'LIBRE' && !options.some((option) => option.value === current)) {
      options.splice(1, 0, { value: current, hours: shiftHours(current), label: `${current} · guardado` });
    }
    return `<td><select class="shift-select ${current === 'LIBRE' ? 'off' : ''}" data-id="${employee.id}" data-day="${day}" data-action="shift" aria-label="Turno de ${escapeHtml(employee.name)} para ${day}">${options.map((option) => `<option value="${escapeHtml(option.value)}" ${option.value === current ? 'selected' : ''}>${escapeHtml(option.label)}</option>`).join('')}</select></td>`;
  }).join('');
  const hoursCell = state.view === 'schedule'
    ? `<div class="hours-summary ${hoursClass}"><strong>${formatNumber(assigned)}</strong><span>/ ${formatNumber(employee.hours)} h</span></div>`
    : `<input class="hours-input" type="number" min="1" max="60" data-id="${employee.id}" data-field="hours" value="${employee.hours}" />`;
  return `<tr><td class="person"><input class="person-input" data-id="${employee.id}" data-field="name" value="${escapeHtml(employee.name)}" /><input class="person-input rut" data-id="${employee.id}" data-field="rut" value="${escapeHtml(employee.rut)}" placeholder="RUT" /></td><td>${hoursCell}</td>${dayCells}<td><button class="toggle ${employee.overnight ? 'on' : ''}" data-id="${employee.id}" data-action="overnight">${employee.overnight ? 'SÍ' : 'NO'}</button></td><td class="remove-cell"><button class="delete" title="Eliminar trabajador" data-id="${employee.id}" data-action="delete">×</button></td></tr>`;
}

function renderAvailabilityForm() {
  $('#availability-form').innerHTML = days.map((day) => `<div class="availability-row" data-form-day="${day}"><strong>${day}</strong><select class="availability-mode" aria-label="Disponibilidad de ${day}"><option value="complete">Completa</option><option value="range">Rango horario</option><option value="unavailable">No disponible</option></select><div class="time-fields" hidden><label>Desde <input class="start-time" type="time" value="09:00" /></label><label>Hasta <input class="end-time" type="time" value="18:00" /></label></div></div>`).join('');
  $$('.availability-mode').forEach((select) => select.addEventListener('change', () => {
    const row = select.closest('.availability-row');
    row.querySelector('.time-fields').hidden = select.value !== 'range';
  }));
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
  state.employees.push({
    id: Date.now(),
    name: $('#employee-name').value.trim(),
    rut: formatRut($('#employee-rut').value),
    hours: Number($('#employee-hours').value),
    overnight: $('#employee-overnight').checked,
    availability,
  });
  state.schedule = {};
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
  if (field === 'availability') employee.availability[event.target.dataset.day] = event.target.value.trim().toUpperCase();
  else if (field === 'hours') employee.hours = Number(event.target.value);
  else if (field === 'rut') employee.rut = formatRut(event.target.value);
  else employee[field] = event.target.value;
  state.schedule = {};
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
  save();
  render();
}

function deleteEmployee(event) {
  const id = Number(event.currentTarget.dataset.id);
  state.employees = state.employees.filter((item) => item.id !== id);
  delete state.schedule[id];
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

$('#week').addEventListener('change', (event) => { state.week = event.target.value; save(); render(); });
$('#generate').addEventListener('click', generateSchedule);
$('#open-add').addEventListener('click', openEmployeeDialog);
$('#close-add').addEventListener('click', () => $('#employee-dialog').close());
$('#cancel-add').addEventListener('click', () => $('#employee-dialog').close());
$('#employee-form').addEventListener('submit', addEmployeeFromForm);
$('#export').addEventListener('click', exportCsv);
$('#print').addEventListener('click', () => window.print());
$$('.tab').forEach((tab) => tab.addEventListener('click', () => { state.view = tab.dataset.view; render(); }));

load();
render();
