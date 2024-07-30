interface AdjustDateOptions {
  seconds?: string;
  minutes?: string;
  hours?: string;
  days?: string;
  weeks?: string;
  months?: string;
  years?: string;
}

export function adjustDate(options: AdjustDateOptions, date = new Date()) {
  if (options.seconds) {
    date.setSeconds(date.getSeconds() + parseInt(options.seconds));
  }

  if (options.minutes) {
    date.setMinutes(date.getMinutes() + parseInt(options.minutes));
  }

  if (options.hours) {
    date.setHours(date.getHours() + parseInt(options.hours));
  }

  if (options.days) {
    date.setDate(date.getDate() + parseInt(options.days));
  }

  if (options.weeks) {
    date.setDate(date.getDate() + parseInt(options.weeks) * 7);
  }

  if (options.months) {
    date.setMonth(date.getMonth() + parseInt(options.months));
  }

  if (options.years) {
    date.setFullYear(date.getFullYear() + parseInt(options.years));
  }

  return date;
}
