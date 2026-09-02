const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const appSource = fs.readFileSync('js/app.js', 'utf8');
const source = appSource.slice(0, appSource.indexOf("$('#previous-week')"));
const context = vm.createContext({
  console,
  Date,
  Intl,
  JSON,
  Math,
  Number,
  String,
  Object,
  Array,
  Map,
  Set,
  localStorage: { getItem: () => null, setItem: () => {} },
  document: { querySelector: () => null, querySelectorAll: () => [] },
  window: {},
  setTimeout: () => 0,
  clearTimeout: () => {},
});

vm.runInContext(source, context);
vm.runInContext(`
  save = () => {};
  render = () => {};
  toast = () => {};
  state = {
    version: 4,
    week: '2026-08-24',
    view: 'schedule',
    history: {},
    employees: [{
      id: 10,
      name: 'Prueba',
      rut: '12.345.678-5',
      role: 'Crew',
      hours: 20,
      overnight: true,
      availability: { Lunes:'X', Martes:'X', Miércoles:'X', Jueves:'X', Viernes:'X', Sábado:'09:00 - 01:00', Domingo:'09:00 - 23:00' }
    }],
    schedule: {}
  };
  state.schedule[10] = emptyDays();
  state.schedule[10].Sábado = '09:00 - 20:00';
  state.schedule[10].Domingo = '09:00 - 20:00';
`, context);

const result = vm.runInContext(`({
  assigned: assignedHours(10),
  saturdayOptions: shiftOptions(state.employees[0], 'Sábado').filter(option => option.hours === 10).map(option => option.value),
  hasHalfHourDuration: shiftOptions(state.employees[0], 'Domingo').some(option => option.hours === 1.5),
  validRut: isValidRut('12.345.678-5'),
  alerts: buildAlerts().length,
  overContractMessage: assignmentValidationMessage(state.employees[0], 'Sábado', '09:00 - 21:00'),
  migratedRoles: [normalizeEmployeeRole('General'), normalizeEmployeeRole('Crew-Master')]
})`, context);

assert.strictEqual(result.assigned, 20);
assert.strictEqual(result.validRut, true);
assert.strictEqual(result.alerts, 0);
assert.strictEqual(result.hasHalfHourDuration, true);
assert.deepStrictEqual(Array.from(result.migratedRoles), ['Crew', 'Crew-Master']);
assert.strictEqual(result.saturdayOptions.length, 11);
assert.strictEqual(result.saturdayOptions[0], '09:00 - 20:00');
assert.strictEqual(result.saturdayOptions.at(-1), '14:00 - 01:00');
assert.ok(result.overContractMessage.includes('20 horas contratadas'));

const weekendRestriction = vm.runInContext(`
  shiftOptions({ ...state.employees[0], hours: 16, availability: { ...complete() } }, 'Lunes').length;
`, context);
assert.strictEqual(weekendRestriction, 1);

const maxDaysMessage = vm.runInContext(`
  const employee = { ...state.employees[0], id: 11, hours: 30, availability: complete() };
  state.employees.push(employee);
  state.schedule[11] = emptyDays();
  ['Lunes','Martes','Miércoles','Jueves','Viernes'].forEach(day => { state.schedule[11][day] = '09:00 - 11:00'; });
  assignmentValidationMessage(employee, 'Sábado', '09:00 - 11:00');
`, context);
assert.ok(maxDaysMessage.includes('máximo de 5 días'));

const historyHours = vm.runInContext(`
  persistCurrentWeek();
  const storedWeek = state.week;
  state.week = '2026-08-31';
  state.schedule = {};
  restoreWeek(storedWeek);
  assignedHours(10);
`, context);
assert.strictEqual(historyHours, 20);

console.log(JSON.stringify(result, null, 2));
