import thunk from "redux-thunk";
import { ThunkMiddleware, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { DepartmentInfoSlice } from "./slices/DepartmentsInfoSlice";
import { EducatorInfoSlice } from "./slices/EducatorSlice";
import GroupsInfoSlice from "./slices/GroupsInfoSlice";
import { NewsInfoSlice } from "./slices/NewsSlice";
import favoriteGroupsReducer from "./slices/FavoritesSlice/FavoriteGroupsSlice";
import favoriteEducatorsReducer from "./slices/FavoritesSlice/FavoriteEducatorsSlice";
import SettingsSlice from "./slices/SettingsSlice";
import { ScheduleInfoStudentSlice } from "./slices/ScheduleStudentInfoSlice";
import { ScheduleInfoEducatorSlice } from "./slices/ScheduleEducatorInfoSlice";
import AuthTokenSlice from "./slices/AccountSlices/AuthTokenSlice";
import ProfileInfoSlice from "./slices/AccountSlices/ProfileInfoSlice";
import SemesterGradesInfoSlice from "./slices/AccountSlices/SemesterGradesInfoSlice";
import LibraryInfoSlice from "./slices/AccountSlices/LibraryInfoSlice";
import SwipesSlice from "./slices/SwipesSlice";
export const store = configureStore({
  reducer: {
    DepartmentInfoSlice: DepartmentInfoSlice.reducer,
    GroupsInfoSlice: GroupsInfoSlice,
    EducatorInfoSlice: EducatorInfoSlice.reducer,
    NewsSlice: NewsInfoSlice.reducer,
    FavoriteGroupsSlice: favoriteGroupsReducer,
    FavoriteEducatorsSlice: favoriteEducatorsReducer,
    SettingsSlice: SettingsSlice,
    ScheduleInfoStudentSlice: ScheduleInfoStudentSlice.reducer,
    ScheduleInfoEducatorSlice: ScheduleInfoEducatorSlice.reducer,
    AuthTokenSlice: AuthTokenSlice,
    SemesterGradesInfoSlice: SemesterGradesInfoSlice,
    ProfileInfoSlice: ProfileInfoSlice,
    LibraryInfoSlice: LibraryInfoSlice,
    SwipesSlice: SwipesSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Отключаем проверку на сериализуемость для thunk
    }).concat(thunk as ThunkMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
