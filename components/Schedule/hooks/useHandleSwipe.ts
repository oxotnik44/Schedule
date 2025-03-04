import { useState } from "react";
import { getWeekNumber } from "../utils/timeUtils";
import { useAppSelector, useAppDispatch } from "../../../redux/store";
import {
  setNumberOfSwipes,
  setWeekNumber,
} from "../../../redux/slices/SwipesSlice";

interface UseHandleSwipeProps {
  dataSchedule: any;
  selectId: number;
  dispatch: Function;
  name: string;
  getScheduleByWeek: any;
  currentTypeWeek: any;
  typeWeekToSwitch: any;
}

export const useHandleSwipe = ({
  dataSchedule,
  selectId,
  dispatch,
  name,
  getScheduleByWeek,
  currentTypeWeek,
  typeWeekToSwitch,
}: UseHandleSwipeProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const numberOfSwipes = useAppSelector(
    (state) => state.SwipesSlice.numberOfSwipes
  );
  const appDispatch = useAppDispatch();
  const weekNumber = useAppSelector((state) => state.SwipesSlice.weekNumber);

  const handleSwipe = (direction: "вправо" | "влево") => {
    setIsLoading(true);
    let newWeekNumber = Number(dataSchedule.currentWeekNumber);
    if (direction === "вправо") {
      newWeekNumber -= 1;
      appDispatch(setNumberOfSwipes(numberOfSwipes - 1));
      appDispatch(setWeekNumber(weekNumber - 1));
    } else if (direction === "влево") {
      newWeekNumber += 1;
      appDispatch(setWeekNumber(weekNumber + 1));
      appDispatch(setNumberOfSwipes(numberOfSwipes + 1));
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
