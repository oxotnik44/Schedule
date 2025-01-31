import { useEffect } from "react";
import moment from "moment";

const useCurrentDateTime = (
  setCurrentDayForExtramuralist,
  setCurrentDayForResident,
  setCurrentTime,
  weekdays
) => {
  useEffect(() => {
    const interval = setInterval(() => {
      const date = moment().tz("Asia/Novosibirsk").locale("ru");
      setCurrentDayForExtramuralist(date.format("D MMMM YYYY"));
      setCurrentDayForResident(weekdays[date.day() ? date.day() - 1 : 6]);
      setCurrentTime(date.format("HH:mm:ss"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);
};

export default useCurrentDateTime;
