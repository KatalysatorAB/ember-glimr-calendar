import moment from "moment";

const DAYS_OF_THE_WEEK = 7;

export default function calendar(momentDate) {
    var numberOfDays = momentDate.daysInMonth();

    momentDate.date(1);

    var daysInMonth = [];
    for (let i = 0; i < numberOfDays; i++) {
      daysInMonth.push(momentDate.clone().date(i + 1));
    }

    var firstDayOfWeek = adjustDayNumberToLocaleSpecificFirstDayNumber(momentDate.day());

    var monthPrefix = generateArray(firstDayOfWeek);
    daysInMonth = monthPrefix.concat(daysInMonth);

    while (daysInMonth.length % DAYS_OF_THE_WEEK !== 0) {
      daysInMonth.push(null);
    }

    var result = [];
    for (let i = 0; i < daysInMonth.length; i += DAYS_OF_THE_WEEK) {
      result.push(daysInMonth.slice(i, i + DAYS_OF_THE_WEEK));
    }

    return result;
}

function generateArray(size) {
  var array = [];
  for (var i = 0; i < size; i++) {
    array.push(null);
  }
  return array;
}

function adjustDayNumberToLocaleSpecificFirstDayNumber(day) {
  const firstDayInWeek = moment().startOf("week").day();
  day -= firstDayInWeek;
  if (day < 0) {
    day = day + 7;
  }
  return day;
}

function weekdaysShort() {
  let firstDay = moment().startOf("week");
  let days = [];

  for (let i = 0; i < DAYS_OF_THE_WEEK; i++) {
    days.push(moment.weekdaysShort(firstDay.day()));
    firstDay.add(1, "day");
  }

  return days;
}

export { weekdaysShort };
