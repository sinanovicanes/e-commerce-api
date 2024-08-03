export function seconds(seconds: number, ms = false) {
  return ms ? seconds * 1000 : seconds;
}

export function minutes(minutes: number, ms = false) {
  return seconds(60, ms) * minutes;
}

export function hours(hours: number, ms = false) {
  return minutes(60, ms) * hours;
}

export function days(days: number, ms = false) {
  return hours(24, ms) * days;
}

export function weeks(weeks: number, ms = false) {
  return days(7, ms) * weeks;
}

export function months(months: number, ms = false) {
  return days(30, ms) * months;
}

export function years(years: number, ms = false) {
  return days(365, ms) * years;
}
