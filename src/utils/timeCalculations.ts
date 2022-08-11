import { getTimezoneOffset } from "date-fns-tz";
import { DATABASE_TIME_ZONE } from "../consts/config";

export const DAYS_SEQUENCE = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

export enum DAYS_TEXT {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

export const MINUTES_IN_HOUR = 60;
export const MINUTES_IN_DAY = MINUTES_IN_HOUR * 24;
export const MINUTES_IN_WEEK = MINUTES_IN_DAY * 7;

export function isInDay(minuteInWeek: number, day: keyof typeof DAYS_SEQUENCE) {
  return minuteInWeek >= DAYS_SEQUENCE[day] * MINUTES_IN_DAY && minuteInWeek < (DAYS_SEQUENCE[day] + 1) * MINUTES_IN_DAY;
}

export function convertToTimeInDayString(minuteInWeek: number) {
  const minuteInTheDay = minuteInWeek % MINUTES_IN_DAY;
  const hour = (Math.floor(minuteInTheDay / MINUTES_IN_HOUR) % 12).toString();
  const minute = (minuteInTheDay % MINUTES_IN_HOUR).toString();
  const AMPMText = minuteInTheDay < 720 ? "AM" : "PM";
  return `${hour.length < 2 ? "0" + hour : hour}:${minute.length < 2 ? "0" + minute : minute} ${AMPMText}`;
}

export function convertToTimeInWeekString(minuteInWeek: number) {
  return `${DAYS_TEXT[Math.floor(minuteInWeek / MINUTES_IN_DAY)]} ${convertToTimeInDayString(minuteInWeek)}`;
}
export function getArrayOfIntegerBetween(num1: number, num2: number, order: "asc" | "desc", interval: number = 1) {
  const high = Math.max(num1, num2);
  const low = Math.min(num1, num2);
  return order === "asc"
    ? new Array(Math.floor((high - low) / interval)).fill(null).map((_, index) => {
        const number = (low + index * interval).toString();
        return number.length < 2 ? "0" + number : number;
      })
    : new Array(Math.floor((high - low) / interval)).fill(null).map((_, index) => {
        const number = (high - index * interval).toString();
        return number.length < 2 ? "0" + number : number;
      });
}

export function convertToMinuteOfDay(hour: number | string, minute: number | string, ampm: string) {
  const minuteInDay = Number(hour) * MINUTES_IN_HOUR + Number(minute) + (ampm && ampm === "PM" ? 12 * MINUTES_IN_HOUR : 0);
  return minuteInDay;
}

export function convertToMinuteOfWeek(dayIndex: number, hour: number | string, minute: number | string, ampm: string) {
  const minuteInDay = convertToMinuteOfDay(hour, minute, ampm);
  return minuteInDay >= 0 ? minuteInDay + dayIndex * MINUTES_IN_DAY : -1;
}

export function convertToUserTimeZone(minuteInWeek: number, timeZone: string) {
  const offsetFromInitialTimeZoneInMillisecond = getTimezoneOffset(timeZone) - getTimezoneOffset(DATABASE_TIME_ZONE);
  return normalizeMinuteInWeek(minuteInWeek + offsetFromInitialTimeZoneInMillisecond / (1000 * 60));
}

export function convertToInitialTimeZone(minuteInWeek: number, timeZone: string) {
  const offsetFromInitialTimeZoneInMillisecond = getTimezoneOffset(timeZone) - getTimezoneOffset(DATABASE_TIME_ZONE);
  return normalizeMinuteInWeek(minuteInWeek - offsetFromInitialTimeZoneInMillisecond / (1000 * 60));
}

export function normalizeMinuteInWeek(minuteInWeek: number) {
  return (minuteInWeek + MINUTES_IN_WEEK) % MINUTES_IN_WEEK;
}
