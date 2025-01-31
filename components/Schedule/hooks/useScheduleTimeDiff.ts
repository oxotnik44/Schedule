import { useEffect } from "react";
import { formatTime } from "../utils/timeUtils";

const useScheduleTimeDiff = (
  currentTime,
  arrayStartsPairs,
  setTimeDifference,
  setTimeArray
) => {
  useEffect(() => {
    const currentTimeInSeconds = currentTime
      .split(":")
      .reduce((acc, time, i) => acc + Number(time) * [3600, 60, 1][i], 0);

    const nextSchedule = arrayStartsPairs.find((schedule) => {
      const [hours, minutes] = schedule.split("-")[0].split(":").map(Number);
      return currentTimeInSeconds < hours * 3600 + minutes * 60;
    });

    if (nextSchedule) {
      const [hours, minutes] = nextSchedule
        .split("-")[0]
        .split(":")
        .map(Number);
      const timeDiff = hours * 3600 + minutes * 60 - currentTimeInSeconds;
      setTimeDifference(formatTime(timeDiff));
      setTimeArray(`${hours}:${minutes}`);
    }
  }, [currentTime, arrayStartsPairs]);
};

export default useScheduleTimeDiff;
