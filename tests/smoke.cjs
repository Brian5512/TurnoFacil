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
  const fourDays = { Lunes:'09:00 - 15:00', Martes:'09:00 - 15:00', Miércoles:'09:00 - 15:00', Jueves:'09:00 - 15:00', Viernes:'X', Sábado:'X', Domingo:'X' };
  state = {
    version: 4,
    week: '2026-08-24',
    view: 'schedule',
    history: {},
    employees: [{
      id: 10,
      name: 'Prueba 4x3',
      rut: '12.345.678-5',
      role: 'Crew',
      hours: 20,
      overnight: false,
      availability: fourDays
    }],
    schedule: {}
  };
  state.schedule[10] = emptyDays();
  ['Lunes','Martes','Miércoles','Jueves'].forEach(day => { state.schedule[10][day] = '09:00 - 15:00'; });
`, context);

const result = vm.runInContext(`({
  assigned: assignedHours(10),
  exactPattern: followsWorkPattern(state.employees[0]),
  validAvailability: contractAvailabilityMessage(state.employees[0]),
  validRut: isValidRut('12.345.678-5'),
  alerts: buildAlerts().length,
  incompleteLastDayMessage: assignmentValidationMessage(state.employees[0], 'Jueves', '09:00 - 14:00'),
  migratedRoles: [normalizeEmployeeRole('General'), normalizeEmployeeRole('Crew-Master')]
})`, context);

assert.strictEqual(result.assigned, 20);
assert.strictEqual(result.exactPattern, true);
assert.strictEqual(result.validAvailability, '');
assert.strictEqual(result.validRut, true);
assert.strictEqual(result.alerts, 0);
assert.ok(result.incompleteLastDayMessage.includes('completar exactamente 20 horas'));
assert.deepStrictEqual(Array.from(result.migratedRoles), ['Crew', 'Crew-Master']);

const availabilityRules = vm.runInContext(`(() => {
  const weekendOnly20 = { ...state.employees[0], id: 11, availability: { Lunes:'X', Martes:'X', Miércoles:'X', Jueves:'X', Viernes:'X', Sábado:'09:00 - 01:00', Domingo:'09:00 - 23:00' } };
  const lowFirstShift = { ...state.employees[0], id: 12 };
  state.schedule[12] = emptyDays();
  return {
    weekendError: contractAvailabilityMessage(weekendOnly20),
    lowFirstShiftError: assignmentValidationMessage(lowFirstShift, 'Lunes', '09:00 - 11:00'),
    validFirstShift: assignmentValidationMessage(lowFirstShift, 'Lunes', '09:00 - 15:00')
  };
})()`, context);
assert.ok(availabilityRules.weekendError.includes('requiere disponibilidad en 4 días'));
assert.ok(availabilityRules.lowFirstShiftError.includes('días restantes permiten 15'));
assert.strictEqual(availabilityRules.validFirstShift, '');

const exactPatterns = vm.runInContext(`(() => {
  const employee30 = { ...state.employees[0], id: 20, hours: 30, availability: complete() };
  state.employees.push(employee30);
  state.schedule[20] = emptyDays();
  ['Lunes','Martes','Miércoles','Jueves','Viernes'].forEach(day => { state.schedule[20][day] = '09:00 - 16:00'; });
  const exact30 = followsWorkPattern(employee30);
  ['Lunes','Martes','Miércoles','Jueves','Viernes'].forEach(day => { state.schedule[20][day] = '09:00 - 11:00'; });
  const sixthDayError = assignmentValidationMessage(employee30, 'Sábado', '09:00 - 11:00');

  const employee16 = { ...state.employees[0], id: 21, hours: 16, availability: complete() };
  state.employees.push(employee16);
  state.schedule[21] = emptyDays();
  state.schedule[21].Sábado = '09:00 - 18:00';
  state.schedule[21].Domingo = '09:00 - 18:00';
  return {
    exact30,
    sixthDayError,
    exact16: followsWorkPattern(employee16),
    mondayOptions16: shiftOptions(employee16, 'Lunes').length,
    availability16: contractAvailabilityMessage(employee16)
  };
})()`, context);
assert.strictEqual(exactPatterns.exact30, true);
assert.ok(exactPatterns.sixthDayError.includes('exactamente 5 días'));
assert.strictEqual(exactPatterns.exact16, true);
assert.strictEqual(exactPatterns.mondayOptions16, 1);
assert.strictEqual(exactPatterns.availability16, '');

const wrongDayCountAlert = vm.runInContext(`(() => {
  const employee = { ...state.employees[0], id: 30, availability: { ...complete() } };
  state.employees = [employee];
  state.schedule = { 30: emptyDays() };
  state.schedule[30].Sábado = '09:00 - 20:00';
  state.schedule[30].Domingo = '09:00 - 20:00';
  return buildAlerts()[0].text;
})()`, context);
assert.ok(wrongDayCountAlert.includes('20/20 h en 2/4 días (4x3)'));

const saturdayOptions = vm.runInContext(`
  shiftOptions({ ...state.employees[0], overnight: true, availability: complete() }, 'Sábado').filter(option => option.hours === 10).map(option => option.value);
`, context);
assert.strictEqual(saturdayOptions.length, 11);
assert.strictEqual(saturdayOptions[0], '09:00 - 20:00');
assert.strictEqual(saturdayOptions.at(-1), '14:00 - 01:00');

const historyHours = vm.runInContext(`
  state.employees = [{ ...state.employees[0], id: 10 }];
  state.schedule = { 10: emptyDays() };
  ['Lunes','Martes','Miércoles','Jueves'].forEach(day => { state.schedule[10][day] = '09:00 - 15:00'; });
  persistCurrentWeek();
  const storedWeek = state.week;
  state.week = '2026-08-31';
  state.schedule = {};
  restoreWeek(storedWeek);
  assignedHours(10);
`, context);
assert.strictEqual(historyHours, 20);

console.log(JSON.stringify({ result, availabilityRules, exactPatterns, wrongDayCountAlert }, null, 2));
