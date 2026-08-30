const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const complete = () => Object.fromEntries(days.map((day) => [day, 'COMPLETA']));
const seed = [
  { id:1, name:'Trabajador 1', rut:'', hours:30, overnight:false, availability:complete() },
  { id:2, name:'Trabajador 2', rut:'', hours:20, overnight:false, availability:complete() },
];

let state = { employees:seed, week:getMonday(), view:'availability', schedule:{} };
let saveTimer;

function getMonday() {
  const date = new Date();
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  return date.toISOString().slice(0,10);
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem('turnofacil-html-v1'));
    if (saved?.employees) state = { ...state, ...saved };
  } catch (_) {}
}

function save() {
  localStorage.setItem('turnofacil-html-v1', JSON.stringify(state));
  const indicator = document.querySelector('#save-state');
  indicator.textContent = '✓ Guardado en este computador';
  indicator.classList.add('saved');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { indicator.textContent = 'Guardado automático'; indicator.classList.remove('saved'); }, 1300);
}

function parseTime(value) {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTime(minutes) {
  const normalized = ((Math.round(minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(normalized / 60)).padStart(2,'0')}:${String(normalized % 60).padStart(2,'0')}`;
}

function parseWindow(value) {
  const match = String(value).match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
  if (!match) return null;
  const start = parseTime(match[1]);
  let end = parseTime(match[2]);
  if (end <= start) end += 1440;
  return { start, end, capacity:(end - start) / 60 };
}

function generateSchedule() {
  const schedule = {};
  for (const employee of state.employees) {
    const available = days.filter((day) => {
      const value = String(employee.availability[day] || '').trim().toUpperCase();
      return value && value !== 'X';
    });
    const requiredDays = Math.min(5, Math.max(1, Math.ceil(Number(employee.hours || 0) / 8)));
    const selected = available.slice(0, requiredDays);
    let remaining = Number(employee.hours || 0);
    schedule[employee.id] = {};
    selected.forEach((day, index) => {
      const value = String(employee.availability[day]).trim().toUpperCase();
      const daysLeft = selected.length - index;
      const target = Math.min(8, remaining / daysLeft);
      let start = day === 'Sábado' || day === 'Domingo' ? 12 * 60 : 10 * 60;
      let duration = target;
      const window = parseWindow(value);
      if (window) { start = window.start; duration = Math.min(target, window.capacity); }
      schedule[employee.id][day] = `${formatTime(start)} - ${formatTime(start + duration * 60)}`;
      remaining = Math.max(0, remaining - duration);
    });
    days.forEach((day) => { if (!schedule[employee.id][day]) schedule[employee.id][day] = 'LIBRE'; });
    schedule[employee.id]._pending = remaining;
  }
  state.schedule = schedule;
  state.view = 'schedule';
  save();
  render();
  toast('Horario generado según las disponibilidades');
}

function weekLabel() {
  const start = new Date(`${state.week}T12:00:00`);
  const end = new Date(start); end.setDate(end.getDate() + 6);
  const formatter = new Intl.DateTimeFormat('es-CL',{day:'2-digit',month:'short'});
  return `${formatter.format(start)} — ${formatter.format(end)}`;
}

function availabilityCapacity(employee) {
  return days.reduce((total, day) => {
    const value = String(employee.availability[day] || '').trim().toUpperCase();
    if (!value || value === 'X') return total;
    const window = parseWindow(value);
    return total + Math.min(8, window?.capacity ?? 8);
  }, 0);
}

function renderMetrics() {
  const totalHours = state.employees.reduce((sum, employee) => sum + Number(employee.hours || 0), 0);
  const alerts = state.employees.filter((employee) => availabilityCapacity(employee) < Number(employee.hours || 0)).length;
  const metrics = [
    ['Equipo',state.employees.length,'trabajadores activos','●'],
    ['Horas contratadas',totalHours,'horas semanales','◷'],
    ['Alertas',alerts,'disponibilidad insuficiente',alerts ? '!' : '✓'],
  ];
  document.querySelector('#metrics').innerHTML = metrics.map(([label,value,note,icon]) => `<div class="metric"><div class="metric-label"><span>${label}</span><span class="metric-icon">${icon}</span></div><div class="metric-value">${value}</div><div class="metric-note">${note}</div></div>`).join('');
}

function renderTable() {
  const table = document.querySelector('#schedule-table');
  table.innerHTML = `<thead><tr><th>Trabajador</th><th class="hours">Horas</th>${days.map((day) => `<th class="day">${day}</th>`).join('')}<th class="overnight">Trasnoche</th><th class="remove"></th></tr></thead><tbody>${state.employees.map(rowHtml).join('')}</tbody>`;
  table.querySelectorAll('[data-field]').forEach((input) => input.addEventListener('change', onCellChange));
  table.querySelectorAll('[data-action="overnight"]').forEach((button) => button.addEventListener('click', toggleOvernight));
  table.querySelectorAll('[data-action="delete"]').forEach((button) => button.addEventListener('click', deleteEmployee));
}

function rowHtml(employee, index) {
  const dayCells = days.map((day) => {
    const value = state.view === 'schedule' ? (state.schedule[employee.id]?.[day] || '—') : employee.availability[day];
    const off = value === 'X' || value === 'LIBRE';
    return `<td>${state.view === 'availability' ? `<input class="cell-input ${off ? 'unavailable' : ''}" data-id="${employee.id}" data-day="${day}" data-field="availability" value="${escapeHtml(value)}" aria-label="${escapeHtml(employee.name)}, ${day}" />` : `<span class="shift ${off ? 'off' : ''}">${escapeHtml(value)}</span>`}</td>`;
  }).join('');
  return `<tr><td class="person"><input class="person-input" data-id="${employee.id}" data-field="name" value="${escapeHtml(employee.name)}" /><input class="person-input rut" data-id="${employee.id}" data-field="rut" value="${escapeHtml(employee.rut)}" placeholder="RUT" /></td><td><input class="hours-input" type="number" min="0" max="60" data-id="${employee.id}" data-field="hours" value="${employee.hours}" /></td>${dayCells}<td><button class="toggle ${employee.overnight ? 'on' : ''}" data-id="${employee.id}" data-action="overnight">${employee.overnight ? 'SÍ' : 'NO'}</button></td><td class="remove-cell"><button class="delete" title="Eliminar trabajador" data-id="${employee.id}" data-action="delete">×</button></td></tr>`;
}

function escapeHtml(value='') { return String(value).replace(/[&<>"']/g, (character) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[character])); }

function onCellChange(event) {
  const employee = state.employees.find((item) => item.id === Number(event.target.dataset.id));
  if (!employee) return;
  const field = event.target.dataset.field;
  if (field === 'availability') employee.availability[event.target.dataset.day] = event.target.value.trim().toUpperCase();
  else if (field === 'hours') employee.hours = Number(event.target.value);
  else employee[field] = event.target.value;
  state.schedule = {};
  save();
  render();
}

function toggleOvernight(event) {
  const employee = state.employees.find((item) => item.id === Number(event.currentTarget.dataset.id));
  if (!employee) return;
  employee.overnight = !employee.overnight;
  save(); render();
}

function deleteEmployee(event) {
  state.employees = state.employees.filter((item) => item.id !== Number(event.currentTarget.dataset.id));
  save(); render();
}

function addEmployee() {
  state.employees.push({ id:Date.now(), name:'Nuevo trabajador', rut:'', hours:20, overnight:false, availability:complete() });
  save(); render();
  setTimeout(() => document.querySelector('tbody tr:last-child .person-input')?.select(), 0);
}

function exportCsv() {
  const rows = [['Trabajador','RUT','Horas',...days], ...state.employees.map((employee) => [employee.name,employee.rut,String(employee.hours),...days.map((day) => state.schedule[employee.id]?.[day] || employee.availability[day])])];
  const content = '\ufeff' + rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"','""')}"`).join(';')).join('\r\n');
  const blob = new Blob([content], { type:'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `horario-${state.week}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
  toast('Horario exportado correctamente');
}

function toast(message) {
  const element = document.querySelector('#toast');
  element.textContent = message; element.classList.add('show');
  setTimeout(() => element.classList.remove('show'), 2200);
}

function render() {
  document.querySelector('#week').value = state.week;
  document.querySelector('#week-title').textContent = `Horario del ${weekLabel()}`;
  document.querySelector('#row-count').textContent = `${state.employees.length} filas`;
  document.querySelectorAll('.tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.view === state.view));
  renderMetrics();
  renderTable();
}

document.querySelector('#week').addEventListener('change', (event) => { state.week = event.target.value; save(); render(); });
document.querySelector('#generate').addEventListener('click', generateSchedule);
document.querySelector('#add').addEventListener('click', addEmployee);
document.querySelector('#export').addEventListener('click', exportCsv);
document.querySelector('#print').addEventListener('click', () => window.print());
document.querySelectorAll('.tab').forEach((tab) => tab.addEventListener('click', () => { state.view = tab.dataset.view; render(); }));

load();
render();
