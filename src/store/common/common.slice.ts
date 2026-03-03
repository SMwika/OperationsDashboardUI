import {createSlice} from "@reduxjs/toolkit";
import {IFilterState} from "@/interfaces";
import {redirection} from "./common.actions.ts";
import {decryptData} from "@/helpers";

const currentYear = String(new Date().getFullYear());

export const filters: Array<{ title: string; key: string; defaultValues?: {} }> = [
  {title: 'Scope year', key: 'scope_years', defaultValues: {[currentYear]: currentYear}},
  {title: 'Projects', key: 'system_types'},
  {title: 'Regions', key: 'regions'},
  {title: 'Violations', key: 'violations'},
  { title: 'Contractor', key: 'contractors' },
  {title: 'Priority', key: 'priority'},
];

interface initialStateInterface {
  notification: {
    snackbarMessage: string;
    snackbarSeverity: 'error' | 'warning' | 'info' | 'success';
    openSnackbar: boolean;
  },
  filters: {
    filtersState: IFilterState;
    systemTypes: number[];
  },
  user: {
    username: string | null,
    stakeholder: string | null
  }

}


const initialState: initialStateInterface = {
  notification: {
    snackbarMessage: '',
    openSnackbar: false,
    snackbarSeverity: 'info',
  },
  filters: {
    filtersState: filters.reduce((acc, item) => {
      acc[item.key] = item.defaultValues ?? {};
      return acc;
    }, {} as IFilterState),
    systemTypes: []
  },
  user: localStorage.getItem('encryptData') ? decryptData(localStorage.getItem('encryptData') || '') : {username: null, role: null},
};

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setNotificationMessage(state, action){
      state.notification = action.payload;
    },
    setFiltersState(state, action) {
      state.filters.filtersState = action.payload;
    },
    clearFiltersState(state) {
      state.filters.filtersState = filters.reduce((acc, item) => {
        acc[item.key] = {};
        return acc;
      }, {} as IFilterState);
    },
    setSystemTypes(state, action) {
      state.filters.systemTypes = action.payload;
    },
    setUserData(state, action) {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(redirection.fulfilled, (_, action) => {
         if(action.payload){
           window.location.href = `/${action.payload}`
         }
      })
  }
})

export const commonReducer = commonSlice.reducer;
export const {setNotificationMessage, setFiltersState, clearFiltersState, setSystemTypes, setUserData} = commonSlice.actions