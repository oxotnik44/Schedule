import moment from "moment";

export const weekdays = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

export const formatTime = (timeDiff: number): string =>
  [3600, 60, 1]
    .map((unit, i) =>
      String(Math.floor(timeDiff / unit) % (i === 0 ? 24 : 60)).padStart(2, "0")
    )
    .join(":");

export function getWeekNumber() {
  const currentDate = moment();
  const startOfYear = moment().startOf("year");
  const weekNumber = currentDate.diff(startOfYear, "weeks") + 1;
  return weekNumber;
}
