const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const appSource = fs.readFileSync('js/app.js', 'utf8');
const source = appSource.slice(0, appSource.indexOf("$('#generate')"));
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
    version: 2,
    week: '2026-08-24',
    view: 'availability',
    strategy: 'coverage',
    history: {},
    coverageRules: [
      { id: 1, day: 'Sábado', start: '09:00', end: '20:00', needed: 1, role: 'General' },
      { id: 2, day: 'Domingo', start: '09:00', end: '20:00', needed: 1, role: 'General' }
    ],
    employees: [{
      id: 10,
      name: 'Prueba',
      rut: '12.345.678-5',
      role: 'General',
      hours: 20,
      overnight: true,
      availability: { Lunes:'X', Martes:'X', Miércoles:'X', Jueves:'X', Viernes:'X', Sábado:'09:00 - 01:00', Domingo:'09:00 - 23:00' }
    }],
    schedule: {},
    recommendations: {}
  };
  generateSchedule();
`, context);

const result = vm.runInContext(`({
  assigned: assignedHours(10),
  saturday: state.schedule[10].Sábado,
  sunday: state.schedule[10].Domingo,
  coverage: overallCoverage(),
  fridayOptions: shiftOptions({ ...state.employees[0], hours: 20, availability: { ...state.employees[0].availability, Viernes: 'COMPLETA' } }, 'Viernes', [10]).filter(option => option.hours === 10).map(option => option.value),
  validRut: isValidRut('12.345.678-5'),
  alerts: (state.view = 'schedule', buildAlerts().length)
})`, context);

assert.strictEqual(result.assigned, 20);
assert.strictEqual(result.coverage, 100);
assert.strictEqual(result.validRut, true);
assert.strictEqual(result.alerts, 0);
assert.strictEqual(result.fridayOptions.length, 11);
assert.strictEqual(result.fridayOptions[0], '09:00 - 20:00');
assert.strictEqual(result.fridayOptions.at(-1), '14:00 - 01:00');
assert.ok(result.saturday !== 'LIBRE' && result.sunday !== 'LIBRE');

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
