import { useEffect } from "react";
import moment from "moment";

const useWeekTypeSwitcher = (
  dataSchedule,
  setCurrentTypeWeek,
  setTypeWeekToSwitch
) => {
  useEffect(() => {
    const typeToSwitch =
      (moment().isoWeek() + dataSchedule.scheduleResident.weekCorrection) % 2
        ? "numerator"
        : "denominator";
    setCurrentTypeWeek(typeToSwitch);
    setTypeWeekToSwitch(typeToSwitch);
    console.log(typeToSwitch);
  }, [dataSchedule]);
};

export default useWeekTypeSwitcher;
