import { createSlice } from "@reduxjs/toolkit";

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
export const GroupsInfoSlice = createSlice({
  name: "Groups",
  initialState: initialGroupsResidentsState,
  reducers: {
    setDataGroupsResidents: (state, action) => {
      state.dataGroupsResidents = action.payload;
    },
    setDataGroupsExtramuralists: (state, action) => {
      state.dataGroupsExtramuralists = action.payload;
    },
    resetGroupsResidents: (state, action) => {
      state.dataGroupsResidents = [];
    },
    resetGroupsExtramuralists: (state, action) => {
      state.dataGroupsExtramuralists = [];
    },
    setDataGroups: (state, action) => {
      state.dataGroups = action.payload;
    },
    resetDataGroups: (state, action) => {
      state.dataGroups = [];
    },
    setLoadedResidents: (state, action) => {
      state.loadedResidents = action.payload;
    },
    setLoadedExtramuralists: (state, action) => {
      state.loadedExtramuralists = action.payload;
    },
    setNameGroup: (state, action) => {
      state.selectedGroupName = action.payload;
    },
    setResidentGroupOpen: (state, action) => {
      state.isResidentGroupOpen = action.payload;
    },
    setExtramuralGroupOpen: (state, action) => {
      state.isExtramuralGroupOpen = action.payload;
    },
    setIdDepartments: (state, action) => {
      state.idDepartments = action.payload;
    },
  },
});

export const {
  setDataGroupsResidents,
  setDataGroupsExtramuralists,
  resetGroupsResidents,
  resetGroupsExtramuralists,
  setDataGroups,
  resetDataGroups,
  setLoadedResidents,
  setLoadedExtramuralists,
  setNameGroup,
  setResidentGroupOpen,
  setExtramuralGroupOpen,
  setIdDepartments,
} = GroupsInfoSlice.actions;

export default GroupsInfoSlice.reducer;
