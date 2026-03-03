import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_URL} from "@/constants";
import axios from "axios";
import {handleApiResponse} from "@/helpers";

export const redirection = createAsyncThunk(
  'common/redirection',
  async (params: {}, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}redirection`, {params}, {});
      return handleApiResponse(res.data);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateLang = createAsyncThunk(
  'common/update-lang',
  async (params: {}, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/ntww/lang/update`, {params}, {});
      return handleApiResponse(res.data);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const getMediaContent = createAsyncThunk(
  'common/getMediaContent',
  async (params: {}, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/survey/api/get_media_content`, {params}, {});
      return handleApiResponse(res.data, true);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);