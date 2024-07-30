interface AdjustDateOptions {
  seconds?: number;
  minutes?: number;
  hours?: number;
  days?: number;
  weeks?: number;
  months?: number;
  years?: number;
}

export function adjustDate(options: AdjustDateOptions, date = new Date()) {
  if (options.seconds) {
    date.setSeconds(date.getSeconds() + options.seconds);
  }

  if (options.minutes) {
    date.setMinutes(date.getMinutes() + options.minutes);
  }

  if (options.hours) {
    date.setHours(date.getHours() + options.hours);
  }

  if (options.days) {
    date.setDate(date.getDate() + options.days);
  }

  if (options.weeks) {
    date.setDate(date.getDate() + options.weeks * 7);
  }

  if (options.months) {
    date.setMonth(date.getMonth() + options.months);
  }

  if (options.years) {
    date.setFullYear(date.getFullYear() + options.years);
  }

  return date;
}
