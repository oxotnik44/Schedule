import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import thunk from "redux-thunk";
import departmentInfoReducer from "./reducers/departmentsInfoReducer";
import groupsInfoReducer from "./reducers/groupsInfoReducer";
import educatorInfoReducer from "./reducers/educatorReducer";
import newsReducer from "./reducers/newsReducer";
import favoriteGroupsReducer from "./reducers/favoritesReducer/favoriteGroupsReducer";
import favoriteEducatorsReducer from "./reducers/favoritesReducer/favoriteEducatorsReducer";
import settingsReducer from "./reducers/settingsReducer";
import scheduleInfoStudentReducer from "./reducers/scheduleStudentInfo";
import scheduleInfoEducatorReducer from "./reducers/scheduleEducatorInfo";

let rootReducer = combineReducers({
  departmentInfoReducer: departmentInfoReducer,
  groupsInfoReducer: groupsInfoReducer,
  favoriteEducatorReducer: favoriteEducatorsReducer,
  favoriteGroupReducer: favoriteGroupsReducer,
  educatorInfoReducer: educatorInfoReducer,
  newsReducer: newsReducer,
  settingsReducer: settingsReducer,
  scheduleInfoStudentReducer: scheduleInfoStudentReducer,
  scheduleInfoEducatorReducer: scheduleInfoEducatorReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
let store = legacy_createStore(rootReducer, applyMiddleware(thunk));

export default store;
