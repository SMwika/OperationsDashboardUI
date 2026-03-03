import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
  totals: Record<string, number> & { total: number };
}

export interface IRejectedResponse {
  states: Array<{ state: string; count: number }>;
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
  series: Array<{
    period: string;
    roadmap: number;
    operation: number;
    adhoc: number;
  }>;
  asPercent: boolean;
}

export interface IStagesResponse {
  stages: Array<{ stage: string; count: number }>;
}

export interface IAvgTimeByEmployeeResponse {
  metric: string;
  rows: Array<{
    assignee: string;
    avgHours: number;
    closedCount: number;
  }>;
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
}

export const dashboardApi = createApi({
  reducerPath: "dashboard/api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/dashboard/",
  }),
  endpoints: (build) => ({
    getProgressStatus: build.query<IProgressStatusResponse, IRangeParams>({
      query: (params) => ({
        url: "progress-status",
        method: "GET",
        params,
      }),
    }),
    getAging: build.query<IAgingResponse, IAgingParams>({
      query: (params) => ({
        url: "aging",
        method: "GET",
        params,
      }),
    }),
    getRejected: build.query<IRejectedResponse, IRangeParams>({
      query: (params) => ({
        url: "rejected",
        method: "GET",
        params,
      }),
    }),
    getPriority: build.query<IPriorityResponse, IRangeParams>({
      query: (params) => ({
        url: "priority",
        method: "GET",
        params,
      }),
    }),
    getTypeDistribution: build.query<ITypeDistributionResponse, IRangeParams>({
      query: (params) => ({
        url: "type-distribution",
        method: "GET",
        params,
      }),
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
    }),
    getStages: build.query<IStagesResponse, IRangeParams>({
      query: (params) => ({
        url: "stages",
        method: "GET",
        params,
      }),
    }),
    getAvgTimeByEmployee: build.query<IAvgTimeByEmployeeResponse, IRangeParams>(
      {
        query: (params) => ({
          url: "avg-time-by-employee",
          method: "GET",
          params,
        }),
      },
    ),
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
} = dashboardApi;
