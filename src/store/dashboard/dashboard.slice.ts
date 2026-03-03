import { createSlice } from "@reduxjs/toolkit";
import {
  getActivityLogs, getChecklist, getFieldTaskAttendance,
  getFieldTasks,
  getMapData,
  getMyProjects,
  getMyTasks, getProjectInfo,
  getProjects, getSiteProjects, getSitesInfo,
  getUnifiedCodeDetails, getUnifiedCode
} from "./dashboard.actions.ts";
import { IProject, IUSCObject } from "@/interfaces";



interface IItem {
  loading: boolean,
  data: any[],
  error: {message: string} | null,
}

interface IInitialState {
  sitesInfo: {
    loading: boolean,
    data: {
      [key: string]: {
        [key: string]: [number, string, string];
      };
    },
    error: {message: string} | null,
  };
  myProjects: IItem;
  myTasks: IItem;
  fieldTasks: IItem;
  activityLogs: IItem;
  projects: IItem & { total: number };
  mapData: IItem;
  siteProjects: {
    loading: boolean;
    data: {
      [key: string]: [{
        Address: string,
        Id: number,
        Milestone: string,
        'Pending Task': number,
        Progress: number,
        'Site Code': string,
        'Site Id': string,
        'Start Date': string,
        'Status': string,
        'System': string
      }]
    }
    error: {message: string} | null
  },
  checklist: IItem,
  projectInfo:  {
    loading: boolean,
    data: IProject,
    error: {message: string} | null
  },
  fieldTasksAttendance: IItem,
  unifiedCode: IItem & { total: number };
  unifiedCodeDetails: {
    loading: boolean,
    data: IUSCObject,
    error: {message: string} | null
  },
}
const initalItemState = {
  loading: true,
  data: [],
  error: null,
};
const initialState: IInitialState = {
  sitesInfo: {
    loading: true,
    data: {},
    error: null,
  },
  myProjects: initalItemState,
  myTasks: initalItemState,
  fieldTasks: initalItemState,
  activityLogs: initalItemState,
  projects: {
    ...initalItemState,
    total: 0
  },
  mapData: initalItemState,
  siteProjects: {
    loading: false,
    data: {},
    error: null
  },
  checklist: initalItemState,
  projectInfo: {
    loading: true,
    data: {
      General: [],
      MyTasks: [],
      History: {
        Progress: 0,
        Items: []
      },
      UnifiedSystemCodes: []
    },
    error: null,
  },
  fieldTasksAttendance: initalItemState,
  unifiedCode: {
    ...initalItemState,
    total: 0
  },
  unifiedCodeDetails: {
    loading: false,
    data: {
      "USC Information": {
        Name: null,
        "System Type": null,
        "System Category": null,
        "Site Code": null,
        Site: null,
        "Site Activity ID": null,
        "Technology Code": null,
        Direction: null,
        "Street Code": null,
        "Install Lane": null,
        "Additional Lanes": null,
        "Device No": null,
        "Service Codes": null,
        Manufacturer: null,
        "Install Location Code": null,
        "Fixed System Site": null,
        "Scope year": null,
        Generation: null,
        "Firmware Version": null,
        "System Trigger": null,
        Status: null,
        "Code Generation Status": null,
      },
      "Service Status": [],
      Components: [],
      History: [],
      State: ''
    },
    error: null
  },
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearSideModalData(state){
      state.checklist = initalItemState;
      state.fieldTasksAttendance = initalItemState;
      state.projectInfo = {
        loading: true,
        data: {
          General: [],
          MyTasks: [],
          History: {
            Progress: 0,
            Items: []
          },
          UnifiedSystemCodes: []
        },
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSitesInfo.pending, (state) => {
        state.sitesInfo.loading = true;
      })
      .addCase(getSitesInfo.fulfilled, (state, action) => {
        state.sitesInfo.loading = false;
        state.sitesInfo.data = action.payload;
        state.sitesInfo.error = null;
      })
      .addCase(getSitesInfo.rejected, (state, action) => {
        state.sitesInfo.loading = false;
        state.sitesInfo.error = action.error as {message: string};
      })
      .addCase(getMyProjects.pending, (state) => {
        state.myProjects.loading = true;
      })
      .addCase(getMyProjects.fulfilled, (state, action) => {
        state.myProjects.loading = false;
        state.myProjects.data = action.payload;
        state.myProjects.error = null;
      })
      .addCase(getMyProjects.rejected, (state, action) => {
        state.myProjects.loading = false;
        state.myProjects.error = action.error as {message: string};
      })
      .addCase(getMyTasks.pending, (state) => {
        state.myTasks.loading = true;
      })
      .addCase(getMyTasks.fulfilled, (state, action) => {
        state.myTasks.loading = false;
        state.myTasks.data = action.payload;
        state.myTasks.error = null;
      })
      .addCase(getMyTasks.rejected, (state, action) => {
        state.myTasks.loading = false;
        state.myTasks.error = action.error as {message: string};
      })
      .addCase(getFieldTasks.pending, (state) => {
        state.fieldTasks.loading = true;
      })
      .addCase(getFieldTasks.fulfilled, (state, action) => {
        state.fieldTasks.loading = false;
        state.fieldTasks.data = action.payload;
        state.fieldTasks.error = null;
      })
      .addCase(getFieldTasks.rejected, (state, action) => {
        state.fieldTasks.loading = false;
        state.fieldTasks.error = action.error as {message: string};
      })
      .addCase(getActivityLogs.pending, (state) => {
        state.activityLogs.loading = true;
      })
      .addCase(getActivityLogs.fulfilled, (state, action) => {
        state.activityLogs.loading = false;
        state.activityLogs.data = action.payload;
        state.activityLogs.error = null;
      })
      .addCase(getActivityLogs.rejected, (state, action) => {
        state.activityLogs.loading = false;
        state.activityLogs.error = action.error as {message: string};
      })
      .addCase(getProjects.pending, (state) => {
        state.projects.loading = true;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.projects.loading = false;
        state.projects.data = action.payload.data;
        state.projects.total = action.payload.total;
        state.projects.error = null;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.projects.loading = false;
        state.projects.error = action.error as {message: string};
      })
      .addCase(getMapData.pending, (state) => {
        state.mapData.loading = true;
      })
      .addCase(getMapData.fulfilled, (state, action) => {
        state.mapData.loading = false;
        state.mapData.data = action.payload;
        state.mapData.error = null;
      })
      .addCase(getMapData.rejected, (state, action) => {
        state.mapData.loading = false;
        state.mapData.error = action.error as {message: string};
      })
      .addCase(getSiteProjects.pending, (state) => {
        state.siteProjects.loading = true;
      })
      .addCase(getSiteProjects.fulfilled, (state, action) => {
        state.siteProjects.loading = false;
        state.siteProjects.data[action.meta.arg.Id] = action.payload;
        state.siteProjects.error = null;
      })
      .addCase(getSiteProjects.rejected, (state, action) => {
        state.siteProjects.loading = false;
        state.siteProjects.error = action.error as {message: string};
      })
      .addCase(getChecklist.pending, (state) => {
        state.checklist.loading = true;
      })
      .addCase(getChecklist.fulfilled, (state, action) => {
        state.checklist.loading = false;
        state.checklist.data = action.payload;
        state.checklist.error = null;
      })
      .addCase(getChecklist.rejected, (state) => {
        state.checklist.loading = false;
      })
      .addCase(getProjectInfo.pending, (state) => {
        state.projectInfo.loading = true;
      })
      .addCase(getProjectInfo.fulfilled, (state, action) => {
        state.projectInfo.loading = false;
        state.projectInfo.data = action.payload;
        state.projectInfo.error = null;
      })
      .addCase(getProjectInfo.rejected, (state) => {
        state.projectInfo.loading = false;
      })
      .addCase(getFieldTaskAttendance.pending, (state) => {
        state.fieldTasksAttendance.loading = true;
      })
      .addCase(getFieldTaskAttendance.fulfilled, (state, action) => {
        state.fieldTasksAttendance.loading = false;
        state.fieldTasksAttendance.data = action.payload;
        state.fieldTasksAttendance.error = null;
      })
      .addCase(getFieldTaskAttendance.rejected, (state) => {
        state.fieldTasksAttendance.loading = false;
      })
      .addCase(getUnifiedCode.pending, (state) => {
        state.unifiedCode.loading = true;
      })
      .addCase(getUnifiedCode.fulfilled, (state, action) => {
        state.unifiedCode.loading = false;
        state.unifiedCode.data = action.payload.data;
        state.unifiedCode.total = action.payload.total;
        state.unifiedCode.error = null;
      })
      .addCase(getUnifiedCode.rejected, (state, action) => {
        state.unifiedCode.loading = false;
        state.unifiedCode.error = action.error as {message: string};
      })
      .addCase(getUnifiedCodeDetails.pending, (state) => {
        state.unifiedCodeDetails.loading = true;
      })
      .addCase(getUnifiedCodeDetails.fulfilled, (state, action) => {
        state.unifiedCodeDetails.loading = false;
        state.unifiedCodeDetails.data = action.payload;
        state.unifiedCodeDetails.error = null;
      })
      .addCase(getUnifiedCodeDetails.rejected, (state) => {
        state.unifiedCodeDetails.loading = false;
      })
  },
});


export const dashboardReducer = dashboardSlice.reducer;
export const {clearSideModalData} = dashboardSlice.actions