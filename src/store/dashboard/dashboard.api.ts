import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getPersistedAccessToken } from "@/auth/msal";

export interface IProgressStatusResponse {
  categories: Array<{
    category: string;
    counts: {
      closed: number;
      assigned: number;
      ongoing: number;
      rejected: number;
    };
    total: number;
  }>;
  legend: string[];
}

export interface IAgingResponse {
  asOf: string;
  buckets: string[];
  rows: Array<{
    status: string;
    counts: Record<string, number>;
    total: number;
  }>;
  totals: {
    bucketTotals: Record<string, number>;
    total: number;
  };
  tree?: Record<string, Record<string, string[]>>;
}

export interface IRejectedResponse {
  states: Array<{ module: string; count: number }>;
}

export interface IPriorityResponse {
  priority: Array<{ label: string; count: number }>;
  mapping: Record<string, string>;
}

export interface ITypeDistributionResponse {
  types: Array<{ type: string; count: number }>;
  cumulativePercent: Array<{ type: string; percent: number }>;
}

export interface IEffortDistributionResponse {
  granularity: "month" | "week" | "day";
  asPercent: boolean;
  assignedTo: string | null;
  categories: string[];
  series: Array<{
    period: string;
    values: Record<string, number>;
    total: number;
  }>;
}

export interface IStagesResponse {
  stages: Array<{ stage: string; count: number }>;
  totalCount?: number;
}

export interface IAvgTimeByEmployeeResponse {
  metric: string;
  rows: {
    assignees: Array<{
      assignee: string;
      avgHours: number;
      closedCount: number;
    }>;
    requestors: Array<{
      requestor: string;
      openedCount: number;
    }>;
  };
}

export interface ISummaryKpis {
  totalTickets: number;
  assignedTickets: number;
  unassignedTickets: number;
  solvedTickets: number;
  avgAssignmentHours: number;
  avgResolutionHours: number;
}

export interface IOverviewProgress {
  donut: { total: number; value: number; percent: number };
  weekly: { total: number; closed: number; percent: number };
  monthly: { total: number; closed: number; percent: number };
  yearly: { total: number; closed: number; percent: number };
}

export interface ISummaryResponse {
  kpis: ISummaryKpis;
  overviewProgress: IOverviewProgress;
}

export interface ITrendPoint {
  period: string;
  dateLabel: string;
  actual: number | null;
  forecast: number | null;
  plan: number | null;
}

export interface ITrendsResponse {
  interval: "month" | "week";
  cumulative: boolean;
  legend: Array<"actual" | "forecast" | "plan">;
  points: ITrendPoint[];
}

export interface ITaskDetailRow {
  sno: string;
  id: number;
  systemName: string | null;
  ticketId: string | null;
  description: string | null;
  requestType: string | null;
  businessPriority: string | null;
  requestedBy: string | null;
  assignedTo: string | null;
  state: string | null;
  workItemType: string | null;
  targetDate: string | null;
  createdDate: string | null;
  closedDate: string | null;
  areaPath: string | null;
  iterationPath: string | null;
  storyPoints: number | null;
  priority: number | null;
}

export interface ITaskDetailsResponse {
  rows: ITaskDetailRow[];
}

interface IApiEnvelope<T> {
  success: boolean;
  data: T;
  error: string | null;
}

interface IRangeParams {
  startDate: string;
  endDate: string;
}

interface IAgingParams {
  asOf: string;
}

interface IEffortParams extends IRangeParams {
  granularity: "month" | "week" | "day";
  asPercent: boolean;
  assignedTo?: string | null;
}

interface ITrendsParams extends IRangeParams {
  interval: "month" | "week";
  cumulative: boolean;
}

export const dashboardApi = createApi({
  reducerPath: "dashboard/api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/Dashboard",
    prepareHeaders: (headers) => {
      const token = getPersistedAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (build) => ({
    getProgressStatus: build.query<IProgressStatusResponse, IRangeParams>({
      query: (params) => ({
        url: "progress-status",
        method: "GET",
        params,
      }),
      transformResponse: (
        response:
          | IApiEnvelope<IProgressStatusResponse>
          | IProgressStatusResponse,
      ) => {
        if ("data" in response) {
          return response.data;
        }

        return response;
      },
    }),
    getAging: build.query<IAgingResponse, IAgingParams>({
      query: (params) => ({
        url: "aging",
        method: "GET",
        params,
      }),
      transformResponse: (
        response: IApiEnvelope<IAgingResponse> | IAgingResponse,
      ) => {
        if ("data" in response) {
          return response.data;
        }

        return response;
      },
    }),
    getRejected: build.query<IRejectedResponse, IRangeParams>({
      query: (params) => ({
        url: "rejected",
        method: "GET",
        params,
      }),
      transformResponse: (
        response: IApiEnvelope<IRejectedResponse> | IRejectedResponse,
      ) => {
        if ("data" in response) {
          return response.data;
        }

        return response;
      },
    }),
    getPriority: build.query<IPriorityResponse, IRangeParams>({
      query: (params) => ({
        url: "priority",
        method: "GET",
        params,
      }),
      transformResponse: (
        response: IApiEnvelope<IPriorityResponse> | IPriorityResponse,
      ) => {
        if ("data" in response) {
          return response.data;
        }

        return response;
      },
    }),
    getTypeDistribution: build.query<ITypeDistributionResponse, IRangeParams>({
      query: (params) => ({
        url: "type-distribution",
        method: "GET",
        params,
      }),
      transformResponse: (
        response:
          | IApiEnvelope<ITypeDistributionResponse>
          | ITypeDistributionResponse,
      ) => {
        if ("data" in response) {
          return response.data;
        }

        return response;
      },
    }),
    getEffortDistribution: build.query<
      IEffortDistributionResponse,
      IEffortParams
    >({
      query: (params) => ({
        url: "effort-distribution",
        method: "GET",
        params,
      }),
      transformResponse: (
        response:
          | IApiEnvelope<IEffortDistributionResponse>
          | IEffortDistributionResponse,
      ) => {
        if ("data" in response) {
          return response.data;
        }

        return response;
      },
    }),
    getStages: build.query<IStagesResponse, IRangeParams>({
      query: (params) => ({
        url: "stages",
        method: "GET",
        params,
      }),
      transformResponse: (
        response: IApiEnvelope<IStagesResponse> | IStagesResponse,
      ) => {
        if ("data" in response) {
          return response.data;
        }

        return response;
      },
    }),
    getAvgTimeByEmployee: build.query<IAvgTimeByEmployeeResponse, IRangeParams>(
      {
        query: (params) => ({
          url: "avg-time-by-employee",
          method: "GET",
          params,
        }),
        transformResponse: (
          response:
            | IApiEnvelope<IAvgTimeByEmployeeResponse>
            | IAvgTimeByEmployeeResponse,
        ) => {
          if ("data" in response) {
            return response.data;
          }

          return response;
        },
      },
    ),
    getSummary: build.query<ISummaryResponse, IRangeParams>({
      query: (params) => ({
        url: "summary",
        method: "GET",
        params,
      }),
      transformResponse: (
        response: IApiEnvelope<ISummaryResponse> | ISummaryResponse,
      ) => {
        if ("data" in response) {
          return response.data;
        }

        return response;
      },
    }),
    getTrends: build.query<ITrendsResponse, ITrendsParams>({
      query: (params) => ({
        url: "trends",
        method: "GET",
        params,
      }),
      transformResponse: (
        response: IApiEnvelope<ITrendsResponse> | ITrendsResponse,
      ) => {
        if ("data" in response) {
          return response.data;
        }

        return response;
      },
    }),
    getTaskDetails: build.query<ITaskDetailsResponse, IRangeParams>({
      query: (params) => ({
        url: "task-details",
        method: "GET",
        params,
      }),
      transformResponse: (
        response: IApiEnvelope<ITaskDetailsResponse> | ITaskDetailsResponse,
      ) => {
        if ("data" in response) {
          return response.data;
        }

        return response;
      },
    }),
  }),
});

export const {
  useGetProgressStatusQuery,
  useGetAgingQuery,
  useGetRejectedQuery,
  useGetPriorityQuery,
  useGetTypeDistributionQuery,
  useGetEffortDistributionQuery,
  useGetStagesQuery,
  useGetAvgTimeByEmployeeQuery,
  useGetSummaryQuery,
  useGetTrendsQuery,
  useGetTaskDetailsQuery,
} = dashboardApi;
