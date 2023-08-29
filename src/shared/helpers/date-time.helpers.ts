import moment from "moment";

import { SHORT_DATE } from "shared/constants/global.constants";

export const newDateKeepLocalTime = (date?: Date | string): Date => {
  if (!date) return null;
  return moment(date).utc(true).toDate();
};

export function isBeforeDay(date: string | Date, value: string | Date): boolean {
  return moment(date).isBefore(moment(value), "day");
}

export function isAfterDay(date: string | Date, value: string | Date): boolean {
  return moment(date).isAfter(moment(value), "day");
}

export function isSameDay(date: string | Date, value: string | Date): boolean {
  return moment(date).isSame(moment(value), "day");
}

export function isSameOrBeforeDay(date: string | Date, value: string | Date): boolean {
  return moment(date).isSameOrBefore(moment(value), "day");
}

export function isSameOrAfterDay(date: string | Date, value: string | Date): boolean {
  return moment(date).isSameOrAfter(moment(value), "day");
}

export function isSameTime(date, value): boolean {
  const dateUTC = moment(date).millisecond(0);
  const valueUTC = moment(value).year(dateUTC.year()).month(dateUTC.month()).date(dateUTC.date()).millisecond(0);
  return dateUTC.isSame(valueUTC);
}

export function isBeforeTime(date, value): boolean {
  const dateUTC = moment(date).millisecond(0);
  const valueUTC = moment(value).year(dateUTC.year()).month(dateUTC.month()).date(dateUTC.date()).millisecond(0);
  return dateUTC.isBefore(valueUTC);
}

export function isBeforeOrSameTime(date, value): boolean {
  return isBeforeTime(date, value) || isSameTime(date, value);
}

export function isAfterTime(date, value): boolean {
  const dateUTC = moment(date).millisecond(0);
  const valueUTC = moment(value).year(dateUTC.year()).month(dateUTC.month()).date(dateUTC.date()).millisecond(0);
  return dateUTC.isAfter(valueUTC);
}

export function isAfterOrSameTime(date, value): boolean {
  return isAfterTime(date, value) || isSameTime(date, value);
}

/**
 * Creates an array of consecutive dates starting from `startDate` and ending at `endDate`.
 *
 * @param startDate The start date of the consecutive dates array.
 * @param endDate The end date of the consecutive dates array.
 * @returns An array of consecutive dates starting from `startDate` and ending at `endDate`.
 *
 * * @example
 * const startDate = "2023-07-01";
 * const endDate = "2023-07-03";
 * const results = ["2023-07-01", "2023-07-02", "2023-07-03"];
 */
export const createDates = (startDate: string | Date, endDate: string | Date) => {
  const between = moment(endDate).diff(startDate, "days");

  return Array(between)
    .fill(null)
    .reduce(
      (acc) => {
        const nextDate = moment(acc[acc.length - 1])
          .add(1, "d")
          .toISOString();
        return [...acc, nextDate];
      },
      [startDate]
    );
};

export const formatShortDate = (date: string | Date) => {
  return moment(date).format(SHORT_DATE);
};
