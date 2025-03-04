import { useEffect } from "react";
import moment from "moment";

const useWeekTypeSwitcher = (
  dataSchedule,
  setCurrentTypeWeek,
  setTypeWeekToSwitch,
  numberOfSwipes,
  randomNumber,
  currentWeekNumber
) => {
  useEffect(() => {
    const typeToSwitch =
      (moment().isoWeek() +
        dataSchedule.scheduleResident.weekCorrection +
        numberOfSwipes) %
      2
        ? "numerator"
        : "denominator";
    setTypeWeekToSwitch(typeToSwitch);
  }, [randomNumber]);
};

export default useWeekTypeSwitcher;
