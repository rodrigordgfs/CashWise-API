import { addDays, addMonths, addWeeks, addYears, endOfMonth, getDate, isLastDayOfMonth, setDate } from "date-fns";
import { toZonedISOString } from "./toZonedISOString.js";

const timeZone = "America/Sao_Paulo";

export const buildRecurringDates = (baseDate, count, interval) => {
  const dates = [];

  const base = new Date(baseDate);
  const baseDay = getDate(base);
  const isEom = isLastDayOfMonth(base);

  for (let i = 1; i <= count; i++) {
    let next;

    switch (interval) {
      case 1:
        next = addDays(base, i);
        break;
      case 7:
        next = addWeeks(base, i);
        break;
      case 30:
        if (isEom) {
          next = endOfMonth(addMonths(base, i));
        } else {
          const tmp = addMonths(base, i);
          const last = getDate(endOfMonth(tmp));
          next = baseDay > last ? endOfMonth(tmp) : setDate(tmp, baseDay);
        }
        break;
      case 365:
        next = addYears(base, i);
        break;
      default:
        next = base;
    }

    dates.push(toZonedISOString(next, timeZone));
  }

  return dates;
};