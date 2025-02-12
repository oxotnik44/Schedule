import { useState, Dispatch } from "react";
import { getWeekNumber } from "../utils/timeUtils";

interface UseHandleSwipeProps {
  dataSchedule: any;
  selectId: number;
  dispatch: Function;
  name: string;
  getScheduleByWeek: any;
}

export const useHandleSwipe = ({
  dataSchedule,
  selectId,
  dispatch,
  name,
  getScheduleByWeek,
}: UseHandleSwipeProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [numberOfSwipes, setNumberOfSwipes] = useState(0);

  const handleSwipe = (direction: "вправо" | "влево") => {
    setIsLoading(true);

    let newWeekNumber = Number(dataSchedule.currentWeekNumber);
    let weekNumber = getWeekNumber();

    if (direction === "вправо") {
      newWeekNumber -= 1;
      weekNumber -= 1;
      setNumberOfSwipes((prev) => prev - 1);
    } else if (direction === "влево") {
      newWeekNumber += 1;
      weekNumber += 1;
      setNumberOfSwipes((prev) => prev + 1);
    }

    getScheduleByWeek(
      selectId,
      dispatch,
      name,
      false,
      weekNumber,
      newWeekNumber
    );

    setIsLoading(false);
  };

  return { handleSwipe, isLoading, numberOfSwipes };
};
