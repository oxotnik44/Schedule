import { Reducer } from "redux";

const SET_DATA_GROUPS_RESIDENTS = "SET_DATA_GROUPS_RESIDENTS";
const RESET_GROUPS_RESIDENTS = "RESET_GROUPS_RESIDENTS";
const SET_DATA_GROUPS_EXTRAMURALISTS = "SET_DATA_GROUPS_EXTRAMURALISTS";
const RESET_GROUPS_EXTRAMURALISTS = "RESET_GROUPS_EXTRAMURALISTS";
const SET_LOADED_RESIDENT = "SET_LOADED_RESIDENT";
const SET_LOADED_EXTRAMURALISTS = "SET_LOADED_EXTRAMURALISTS";
const SET_DATA_GROUPS = "SET_DATA_GROUPS";
const RESET_DATA_GROUPS = "RESET_DATA_GROUPS";
const SET_SELECTED_GROUP_INFO = "SET_SELECTED_GROUP_NUMBER";
const SET_RESIDENT_GROUP_OPEN = "SET_RESIDENT_GROUP_OPEN";
const SET_EXTRAMURAL_GROUP_OPEN = "SET_EXTRAMURAL_GROUP_OPEN";
const SET_ID_DEPARTMENTS = "SET_ID_DEPARTMENTS";
interface iGroupsInfo {
  idGroup: number;
  nameGroup: string;
  isResidentAspirant: number;
}

interface IState {
  dataGroupsResidents: iGroupsInfo[];
  dataGroupsExtramuralists: iGroupsInfo[];
  dataGroups: iGroupsInfo[];
  loadedResidents: boolean;
  loadedExtramuralists: boolean;
  selectedGroupName: string;
  isResidentGroupOpen: boolean;
  isExtramuralGroupOpen: boolean;
  idDepartments: number;
}

export const initialGroupsResidentsState: IState = {
  dataGroupsResidents: [],
  dataGroupsExtramuralists: [],
  dataGroups: [],
  loadedResidents: false,
  loadedExtramuralists: false,
  selectedGroupName: "",
  isResidentGroupOpen: false,
  isExtramuralGroupOpen: false,
  idDepartments: 0,
};

const groupsInfoReducer: Reducer<IState> = (
  state = initialGroupsResidentsState,
  action
) => {
  switch (action.type) {
    case SET_DATA_GROUPS_RESIDENTS:
      return {
        ...state,
        dataGroupsResidents: [
          ...state.dataGroupsResidents,
          ...action.dataGroupsResidents,
        ],
      };

    case SET_DATA_GROUPS_EXTRAMURALISTS:
      return {
        ...state,
        dataGroupsExtramuralists: [
          ...state.dataGroupsExtramuralists,
          ...action.dataGroupsExtramuralists,
        ],
      };

    case RESET_GROUPS_RESIDENTS:
      return {
        ...state,
        dataGroupsResidents: [],
      };

    case RESET_GROUPS_EXTRAMURALISTS:
      return {
        ...state,
        dataGroupsExtramuralists: [],
      };

    case SET_DATA_GROUPS:
      return {
        ...state,
        dataGroups: [...state.dataGroups, ...action.dataGroups],
      };

    case RESET_DATA_GROUPS:
      return {
        ...state,
        dataGroups: [],
      };

    case SET_LOADED_RESIDENT:
      return {
        ...state,
        loadedResidents: action.loadedResidents,
      };

    case SET_LOADED_EXTRAMURALISTS:
      return {
        ...state,
        loadedExtramuralists: action.loadedExtramuralists,
      };

    case SET_SELECTED_GROUP_INFO:
      return {
        ...state,
        selectedGroupName: action.selectedGroupName,
      };

    case SET_RESIDENT_GROUP_OPEN:
      return {
        ...state,
        isResidentGroupOpen: action.isResidentGroupOpen,
      };

    case SET_EXTRAMURAL_GROUP_OPEN:
      return {
        ...state,
        isExtramuralGroupOpen: action.isExtramuralGroupOpen,
      };
    case SET_ID_DEPARTMENTS:
      return {
        ...state,
        idDepartments: action.idDepartments,
      };
    default:
      return state;
  }
};

export const setDataGroupsResidents = (data: iGroupsInfo[]) => ({
  type: SET_DATA_GROUPS_RESIDENTS,
  dataGroupsResidents: data,
});

export const setDataGroupsExtramuralists = (data: iGroupsInfo[]) => ({
  type: SET_DATA_GROUPS_EXTRAMURALISTS,
  dataGroupsExtramuralists: data,
});

export const resetGroupsResidents = () => ({
  type: RESET_GROUPS_RESIDENTS,
});

export const resetGroupsExtramuralists = () => ({
  type: RESET_GROUPS_EXTRAMURALISTS,
});

export const setDataGroups = (data: iGroupsInfo[]) => ({
  type: SET_DATA_GROUPS,
  dataGroups: data,
});

export const resetDataGroups = () => ({
  type: RESET_DATA_GROUPS,
});

export const setLoadedResidents = (load: boolean) => ({
  type: SET_LOADED_RESIDENT,
  loadedResidents: load,
});

export const setLoadedExtramuralists = (load: boolean) => ({
  type: SET_LOADED_EXTRAMURALISTS,
  loadedExtramuralists: load,
});

export const setNameGroup = (nameNumber: string) => ({
  type: SET_SELECTED_GROUP_INFO,
  selectedGroupName: nameNumber,
});

export const setResidentGroupOpen = (isOpen: boolean) => ({
  type: SET_RESIDENT_GROUP_OPEN,
  isResidentGroupOpen: isOpen,
});

export const setExtramuralGroupOpen = (isOpen: boolean) => ({
  type: SET_EXTRAMURAL_GROUP_OPEN,
  isExtramuralGroupOpen: isOpen,
});
export const setIdDepartments = (idDepartments: number) => ({
  type: SET_ID_DEPARTMENTS,
  idDepartments,
});
export default groupsInfoReducer;
