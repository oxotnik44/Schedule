import { useEffect } from "react";
import moment from "moment";
import { setCurrentWeekNumberEducator } from "../../../redux/slices/ScheduleEducatorInfoSlice";

const useWeekTypeSwitcher = (
  dataSchedule,
  setCurrentTypeWeek,
  setTypeWeekToSwitch,
  numberOfSwipes
) => {
  useEffect(() => {
    const typeToSwitch =
      (moment().isoWeek() +
        dataSchedule.scheduleResident.weekCorrection +
        numberOfSwipes) %
      2
        ? "numerator"
        : "denominator";
    setCurrentTypeWeek(typeToSwitch);
    setTypeWeekToSwitch(typeToSwitch);
  }, [dataSchedule]);
};

export default useWeekTypeSwitcher;
