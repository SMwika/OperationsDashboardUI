import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL} from "@/constants";
import axios from "axios";
import {handleApiResponse} from "@/helpers";

export const getSitesInfo = createAsyncThunk(
  'dashboard/sitesInfo',
  async (params: {}, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}landingpage/info`, {params}, {});
      return handleApiResponse(res.data);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getMyProjects = createAsyncThunk(
  'dashboard/myProjects',
  async (params: {}, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}my_project`, {params}, {});
      return handleApiResponse(res.data);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getMyTasks = createAsyncThunk(
  'dashboard/myTasks',
  async (params: {}, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}my_task`, {params}, {});
      return handleApiResponse(res.data);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getFieldTasks = createAsyncThunk(
  'dashboard/fieldTasks',
  async (params: {}, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}fieldtasks`, {params}, {});
      return handleApiResponse(res.data);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getActivityLogs = createAsyncThunk(
  'dashboard/activityLogs',
  async (params: {}, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}act_logs`, {params}, {});
      return handleApiResponse(res.data);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getProjects = createAsyncThunk(
  'dashboard/projects',
  async (params: {}, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}get_project`, {params}, {});
      return handleApiResponse(res.data, true);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getMapData = createAsyncThunk(
  'dashboard/mapData',
  async (params: {}, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}map`, {params}, {});
      return handleApiResponse(res.data);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getSiteProjects = createAsyncThunk(
  'dashboard/siteProjects',
  async (params: {Id: number}, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}site_projects`, {params}, {});
      return handleApiResponse(res.data);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getProjectInfo = createAsyncThunk(
  'dashboard/projectInfo',
  async (params: {[key: string]: number | null}, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/gis/data`, {params}, {});
      return handleApiResponse(res.data);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getChecklist = createAsyncThunk(
  'dashboard/checklist',
  async (params: {[key: string]: number | null}, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/gis/survey/get/inspection/checklist`, {params}, {});
      return handleApiResponse(res.data);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getFieldTaskAttendance = createAsyncThunk(
  'dashboard/fieldTaskAttendance',
  async (params: {[key: string]: number | null}, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/ntww_odp/project_fieldtask_attendance`, {params}, {});
      return handleApiResponse(res.data);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getUnifiedCode = createAsyncThunk(
  'dashboard/unifiedCode',
  async (params: {}, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}unified_code_list`, {params}, {});
      return handleApiResponse(res.data, true);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getUnifiedCodeDetails = createAsyncThunk(
  'dashboard/unifiedCodeDetails',
  async (params: { [key: string]: number | null }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/ntww_odp/unified_code_details`, {params}, {});
      return handleApiResponse(res.data);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const unifiedCodeServiceUpdateAction = createAsyncThunk(
  'dashboard/unifiedCodeServiceUpdateAction',
  async (params: { body: any, callback?: () => void }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.post(`/ntww_odp/unified_code/service_update_action`, { params: params.body }, {});
      await dispatch(getUnifiedCodeDetails(params.body));
      if (params.callback) params.callback();
      return handleApiResponse(res.data);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);