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
  exactHours: matchesContractHours(state.employees[0]),
  validRut: isValidRut('12.345.678-5'),
  alerts: buildAlerts().length,
  firstScheduleTime: scheduleTimeValues[0],
  lastScheduleTime: scheduleTimeValues.at(-1),
  scheduleFieldCount: (rowHtml(state.employees[0]).match(/data-action="shift-start"/g) || []).length,
  freeButtonCount: (rowHtml(state.employees[0]).match(/data-action="free-day"/g) || []).length,
  noCellHoursSummary: !rowHtml(state.employees[0]).includes('shift-duration'),
  noFreeOptionInTimeList: !scheduleTimeOptionsHtml('').includes('Libre'),
  closingWithoutNextDay: closingDisplay('Viernes'),
  endOptionsWithoutNextDay: !endTimeOptionsHtml('Viernes', '23:00', '01:00').includes('+1 día'),
  incompleteLastDayMessage: assignmentValidationMessage(state.employees[0], 'Jueves', '09:00 - 14:00'),
  overContractMessage: assignmentValidationMessage(state.employees[0], 'Jueves', '09:00 - 18:00'),
  migratedRoles: [normalizeEmployeeRole('General'), normalizeEmployeeRole('Crew-Master')]
})`, context);

assert.strictEqual(result.assigned, 20);
assert.strictEqual(result.exactHours, true);
assert.strictEqual(result.validRut, true);
assert.strictEqual(result.alerts, 0);
assert.strictEqual(result.firstScheduleTime, '00:00');
assert.strictEqual(result.lastScheduleTime, '23:00');
assert.strictEqual(result.scheduleFieldCount, 7);
assert.strictEqual(result.freeButtonCount, 7);
assert.strictEqual(result.noCellHoursSummary, true);
assert.strictEqual(result.noFreeOptionInTimeList, true);
assert.strictEqual(result.closingWithoutNextDay, '01:00');
assert.strictEqual(result.endOptionsWithoutNextDay, true);
assert.strictEqual(result.incompleteLastDayMessage, '');
assert.strictEqual(result.overContractMessage, '');
assert.deepStrictEqual(Array.from(result.migratedRoles), ['Crew', 'Crew-Master']);

const informationalAvailability = vm.runInContext(`(() => {
  const employee = { ...state.employees[0], id: 11, availability: Object.fromEntries(days.map(day => [day, 'X'])) };
  state.employees.push(employee);
  state.schedule[11] = emptyDays();
  const independentShift = assignmentValidationMessage(employee, 'Lunes', '00:00 - 06:00');
  state.schedule[11].Lunes = '00:00 - 06:00';
  enforceClosingLimits();
  return {
    independentShift,
    preservedWithNoAvailability: state.schedule[11].Lunes,
    earlyStartOption: shiftOptions(employee, 'Lunes').some(option => option.value === '00:00 - 06:00')
  };
})()`, context);
assert.strictEqual(informationalAvailability.independentShift, '');
assert.strictEqual(informationalAvailability.preservedWithNoAvailability, '00:00 - 06:00');
assert.strictEqual(informationalAvailability.earlyStartOption, true);

const overContract = vm.runInContext(`(() => {
  const employee = state.employees[0];
  state.schedule[employee.id].Jueves = '09:00 - 18:00';
  const html = rowHtml(employee);
  return {
    assigned: assignedHours(employee.id),
    highlighted: html.includes('hours-summary hours-over')
  };
})()`, context);
assert.strictEqual(overContract.assigned, 23);
assert.strictEqual(overContract.highlighted, true);
assert.strictEqual(appSource.includes('El turno supera las'), false);

const flexibleDays = vm.runInContext(`(() => {
  const employee30 = { ...state.employees[0], id: 20, hours: 30, availability: complete() };
  state.employees.push(employee30);
  state.schedule[20] = emptyDays();
  ['Lunes','Martes','Miércoles','Jueves','Viernes'].forEach(day => { state.schedule[20][day] = '09:00 - 16:00'; });
  const exact30 = matchesContractHours(employee30);
  ['Lunes','Martes','Miércoles','Jueves','Viernes'].forEach(day => { state.schedule[20][day] = '09:00 - 11:00'; });
  const sixthDayMessage = assignmentValidationMessage(employee30, 'Sábado', '09:00 - 11:00');

  const employee16 = { ...state.employees[0], id: 21, hours: 16, availability: complete() };
  state.employees.push(employee16);
  state.schedule[21] = emptyDays();
  state.schedule[21].Sábado = '09:00 - 18:00';
  state.schedule[21].Domingo = '09:00 - 18:00';
  const previousView = state.view;
  state.view = 'availability';
  const availabilityFields16 = (rowHtml(employee16).match(/data-action="availability-start"/g) || []).length;
  state.view = previousView;
  return {
    exact30,
    sixthDayMessage,
    exact16: matchesContractHours(employee16),
    mondayShiftMessage16: assignmentValidationMessage(employee16, 'Lunes', '09:00 - 18:00'),
    mondayOptions16: shiftOptions(employee16, 'Lunes').length,
    availabilityFields16
  };
})()`, context);
assert.strictEqual(flexibleDays.exact30, true);
assert.strictEqual(flexibleDays.sixthDayMessage, '');
assert.strictEqual(flexibleDays.exact16, true);
assert.strictEqual(flexibleDays.mondayShiftMessage16, '');
assert.ok(flexibleDays.mondayOptions16 > 1);
assert.strictEqual(flexibleDays.availabilityFields16, 7);

const flexibleDayDistributionAlerts = vm.runInContext(`(() => {
  const employee = { ...state.employees[0], id: 30, availability: { ...complete() } };
  state.employees = [employee];
  state.schedule = { 30: emptyDays() };
  state.schedule[30].Sábado = '09:00 - 20:00';
  state.schedule[30].Domingo = '09:00 - 20:00';
  return buildAlerts().length;
})()`, context);
assert.strictEqual(flexibleDayDistributionAlerts, 0);

const saturdayOptions = vm.runInContext(`
  shiftOptions({ ...state.employees[0], overnight: true, availability: complete() }, 'Sábado').filter(option => option.hours === 10).map(option => option.value);
`, context);
assert.strictEqual(saturdayOptions.length, 29);
assert.strictEqual(saturdayOptions[0], '00:00 - 11:00');
assert.strictEqual(saturdayOptions.at(-1), '14:00 - 01:00');

const freeDayResult = vm.runInContext(`
  state.employees = [{ ...state.employees[0], id: 10 }];
  state.schedule = { 10: emptyDays() };
  ['Lunes','Martes','Miércoles','Jueves'].forEach(day => { state.schedule[10][day] = '09:00 - 15:00'; });
  setFreeDay({ currentTarget: { dataset: { id: '10', day: 'Lunes' } } });
  ({ value: state.schedule[10].Lunes, assigned: assignedHours(10) });
`, context);
assert.strictEqual(freeDayResult.value, 'LIBRE');
assert.strictEqual(freeDayResult.assigned, 15);

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

console.log(JSON.stringify({ result, informationalAvailability, flexibleDays, flexibleDayDistributionAlerts, freeDayResult }, null, 2));
