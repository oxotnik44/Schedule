import { IScheduleInfo } from "../types/sheduleStudentTypes";

// scheduleUtils.ts
export const hasWeekdayInSchedule = (dataSchedule: any) => {
  return ["numerator", "denominator"].some((type) =>
    dataSchedule.scheduleResident[type].some(
      ({ weekday, date }: IScheduleInfo) =>
        (weekday && weekday !== "") || (date && date !== "")
    )
  );
};
export const numberWeekFunction = (
  type: string,
  dataSchedule: any,
  currentTypeWeek: any,
  currentWeekNumber: number,
  numberOfSwipes: number,
  typeWeekToSwitch: any
) => {
  // Если тип "session" или не совпадает с требуемым для отображения, возвращаем пустую строку
  if (type === "session" || type !== typeWeekToSwitch) return "";

  const week = dataSchedule.currentWeekNumber;

  // Если это текущая неделя (или неделя, следующая за текущей) и тип совпадает с текущим типом недели
  if (
    (week === currentWeekNumber || week === currentWeekNumber + 1) &&
    type === currentTypeWeek
  ) {
    return `Текущая № ${currentWeekNumber}`;
  }

  const prefix =
    week > currentWeekNumber
      ? "Будущая"
      : week < currentWeekNumber
      ? "Прошлая"
      : "Текущая";

  return `${prefix} № ${week}`;
};
