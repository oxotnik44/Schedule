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
