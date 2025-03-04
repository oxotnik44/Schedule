import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SwipesState {
  numberOfSwipes: number;
  weekNumber: number;
}

const initialState: SwipesState = {
  numberOfSwipes: 0,
  weekNumber: 0,
};

export const SwipesSlice = createSlice({
  name: "swipes",
  initialState,
  reducers: {
    setNumberOfSwipes: (state, action: PayloadAction<number>) => {
      state.numberOfSwipes = action.payload;
    },
    setWeekNumber: (state, action: PayloadAction<number>) => {
      state.weekNumber = action.payload;
    },
    incrementSwipes: (state) => {
      state.numberOfSwipes += 1;
    },
    decrementSwipes: (state) => {
      state.numberOfSwipes -= 1;
    },
  },
});

export const {
  setNumberOfSwipes,
  setWeekNumber,
  incrementSwipes,
  decrementSwipes,
} = SwipesSlice.actions;

export default SwipesSlice.reducer;
