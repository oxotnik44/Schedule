import { useState, useEffect } from "react";
import moment from "moment";

const useLatestEndTime = (filteredSchedules: any[]) => {
  const [latestEndTime, setLatestEndTime] = useState(moment("00:00", "HH:mm"));

  useEffect(() => {
    let tempLatestEndTime = moment("00:00", "HH:mm"); // Начальное время для сравнения

    filteredSchedules.forEach((schedule) => {
      schedule.forEach((item: { numberPair: string }) => {
        const [, end] = item.numberPair.split("-"); // Берем время окончания
        const endTime = moment(end, "HH:mm"); // Преобразуем время в moment

        if (endTime.isAfter(tempLatestEndTime)) {
          tempLatestEndTime = endTime;
        }
      });
    });
    setLatestEndTime(tempLatestEndTime);
  }, [filteredSchedules]);

  return latestEndTime;
};

export default useLatestEndTime;
