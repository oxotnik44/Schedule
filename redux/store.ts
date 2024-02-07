import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import thunk from "redux-thunk";
import { DepartmentInfoSlice } from "./reducers/DepartmentsInfoSlice";
import favoriteGroupsReducer from "./reducers/favoritesReducer/favoriteGroupsReducer";
import favoriteEducatorsReducer from "./reducers/favoritesReducer/favoriteEducatorsReducer";
import { ThunkMiddleware, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { GroupsInfoSlice } from "./reducers/GroupsInfoSlice";
import { EducatorInfoSlice } from "./reducers/EducatorSlice";
import { NewsInfoSlice } from "./reducers/NewsSlice";
import { SettingsSlice } from "./reducers/SettingsSlice";
import { ScheduleInfoStudentSlice } from "./reducers/ScheduleStudentInfoSlice";
import { ScheduleInfoEducatorSlice } from "./reducers/ScheduleEducatorInfoSlice";

export const store = configureStore({
  reducer: {
    DepartmentInfoSlice: DepartmentInfoSlice.reducer,
    GroupsInfoSlice: GroupsInfoSlice.reducer,
    EducatorInfoSlice: EducatorInfoSlice.reducer,
    NewsSlice: NewsInfoSlice.reducer,
    favoriteGroupsSlice: favoriteGroupsReducer,
    favoriteEducatorsSlice: favoriteEducatorsReducer,
    SettingsSlice: SettingsSlice.reducer,
    ScheduleInfoStudentSlice: ScheduleInfoStudentSlice.reducer,
    ScheduleInfoEducatorSlice: ScheduleInfoEducatorSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Отключаем проверку на сериализуемость для thunk
    }).concat(thunk as ThunkMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
