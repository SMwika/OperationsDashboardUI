# Dashboard API Contracts (Backend Handoff)

This document lists all APIs required by the dashboard widgets/components, including sample responses.

## Base URL

- `/api/dashboard`

## Common Query Parameters

- `startDate` (string, `YYYY-MM-DD`)
- `endDate` (string, `YYYY-MM-DD`)
- `asOf` (string, `YYYY-MM-DD`) for aging snapshot
- `granularity` (`month | week | day`) for effort distribution

---

## 1) Summary KPIs + Overview

**Widget(s):** `SummaryKpis`, `PerformanceOverview`  
**Endpoint:** `GET /api/dashboard/summary?startDate=...&endDate=...`

### Summary Sample Response

```json
{
  "kpis": {
    "totalTickets": 140,
    "assignedTickets": 100,
    "unassignedTickets": 40,
    "solvedTickets": 70,
    "avgAssignmentHours": 4.0,
    "avgResolutionHours": 4.0
  },
  "overviewProgress": {
    "donut": { "total": 750, "value": 585, "percent": 78.0 },
    "weekly": { "percent": 90.0 },
    "monthly": { "percent": 78.0 },
    "yearly": { "percent": 61.0 }
  }
}
```

---

## 1.1) Actual vs Plan Trends

**Widget:** `PerformanceOverview` (Actual vs Plan trend)  
**Endpoint:** `GET /api/dashboard/trends?startDate=...&endDate=...&interval=month&cumulative=false`

### Query Params

- `startDate`: `YYYY-MM-DD`
- `endDate`: `YYYY-MM-DD`
- `interval`: `month | week`
- `cumulative`: `true | false`

### Trends Sample Response

```json
{
  "interval": "month",
  "cumulative": false,
  "legend": ["actual", "forecast", "plan"],
  "points": [
    {
      "period": "Jan",
      "dateLabel": "Jan 26, 2023",
      "actual": 0,
      "forecast": null,
      "plan": 0
    },
    {
      "period": "Feb",
      "dateLabel": "Feb 26, 2023",
      "actual": 120,
      "forecast": null,
      "plan": 520
    },
    {
      "period": "Mar",
      "dateLabel": "Mar 26, 2023",
      "actual": 460,
      "forecast": null,
      "plan": 640
    },
    {
      "period": "Apr",
      "dateLabel": "Apr 26, 2023",
      "actual": 560,
      "forecast": 640,
      "plan": 730
    },
    {
      "period": "May",
      "dateLabel": "May 26, 2023",
      "actual": 781,
      "forecast": 820,
      "plan": 810
    },
    {
      "period": "Jun",
      "dateLabel": "Jun 26, 2023",
      "actual": null,
      "forecast": null,
      "plan": 900
    },
    {
      "period": "Jul",
      "dateLabel": "Jul 26, 2023",
      "actual": null,
      "forecast": null,
      "plan": 1200
    }
  ]
}
```

---

## 2) Progress Status (grouped bars)

**Widget:** `ProgressStatus`  
**Endpoint:** `GET /api/dashboard/progress-status?startDate=...&endDate=...`

### Progress Status Sample Response

```json
{
  "categories": [
    {
      "category": "Milestone",
      "counts": { "closed": 18, "assigned": 159, "ongoing": 40, "rejected": 2 },
      "total": 219
    },
    {
      "category": "Operations",
      "counts": { "closed": 10, "assigned": 90, "ongoing": 22, "rejected": 1 },
      "total": 123
    }
  ],
  "legend": ["closed", "assigned", "ongoing", "rejected"]
}
```

---

## 3) Aging

**Widget:** `Aging`  
**Endpoint:** `GET /api/dashboard/aging?asOf=...`

### Aging Sample Response

```json
{
  "asOf": "2026-02-17",
  "buckets": ["1-7", "8-14", "15-21", "21-30", "31-60", "60+"],
  "rows": [
    {
      "status": "On Schedule",
      "counts": {
        "1-7": 1,
        "8-14": 2,
        "15-21": 0,
        "21-30": 1,
        "31-60": 3,
        "60+": 2
      },
      "total": 14
    },
    {
      "status": "Late",
      "counts": {
        "1-7": 0,
        "8-14": 1,
        "15-21": 0,
        "21-30": 0,
        "31-60": 0,
        "60+": 0
      },
      "total": 2
    }
  ],
  "totals": {
    "1-7": 8,
    "8-14": 41,
    "15-21": 7,
    "21-30": 23,
    "31-60": 17,
    "60+": 22,
    "total": 163
  },
  "tree": {
    "Late": {
      "Operations": ["Bug", "Data Change", "General Enquiry"],
      "Enhancement": []
    }
  }
}
```

---

## 4) Rejecting Status

**Widget:** `RejectingStatus`  
**Endpoint:** `GET /api/dashboard/rejected?startDate=...&endDate=...`

### Rejecting Status Sample Response

```json
{
  "states": [
    { "state": "Part. Solved", "count": 1 },
    { "state": "Unsolved", "count": 6 },
    { "state": "Incom. Info", "count": 41 },
    { "state": "Other", "count": 38 }
  ]
}
```

---

## 5) Category of Priority

**Widget:** `CategoryOfPriority`  
**Endpoint:** `GET /api/dashboard/priority?startDate=...&endDate=...`

### Category of Priority Sample Response

```json
{
  "priority": [
    { "label": "High", "count": 1 },
    { "label": "Medium", "count": 6 },
    { "label": "Low", "count": 77 }
  ],
  "mapping": { "1": "High", "2": "Medium", "3": "Low", "4": "Low" }
}
```

---

## 6) Task per Type (Pareto style)

**Widget:** `TaskPerType`  
**Endpoint:** `GET /api/dashboard/type-distribution?startDate=...&endDate=...`

### Task per Type Sample Response

```json
{
  "types": [
    { "type": "Bug", "count": 700 },
    { "type": "Enhancement", "count": 150 },
    { "type": "New Development", "count": 110 },
    { "type": "Project Support", "count": 90 }
  ],
  "cumulativePercent": [
    { "type": "Bug", "percent": 70.0 },
    { "type": "Enhancement", "percent": 86.0 },
    { "type": "New Development", "percent": 96.0 },
    { "type": "Project Support", "percent": 97.0 }
  ]
}
```

---

## 7) Distribution Effort

**Widget:** `DistributionEffort`  
**Endpoint:** `GET /api/dashboard/effort-distribution?startDate=...&endDate=...&granularity=month`

### Distribution Effort Sample Response

```json
{
  "granularity": "month",
  "series": [
    { "period": "Jan", "roadmap": 5, "operation": 32, "adhoc": 12 },
    { "period": "Feb", "roadmap": 8, "operation": 21, "adhoc": 39 },
    { "period": "Mar", "roadmap": 11, "operation": 30, "adhoc": 48 },
    { "period": "Apr", "roadmap": 14, "operation": 70, "adhoc": 56 },
    { "period": "May", "roadmap": 16, "operation": 33, "adhoc": 66 },
    { "period": "Jun", "roadmap": 38, "operation": 56, "adhoc": 75 },
    { "period": "Jul", "roadmap": 36, "operation": 50, "adhoc": 67 },
    { "period": "Aug", "roadmap": 43, "operation": 26, "adhoc": 66 },
    { "period": "Sep", "roadmap": 50, "operation": 14, "adhoc": 80 }
  ],
  "asPercent": true
}
```

---

## 8) Breakdown by Stages

**Widget:** `BreakdownByStages`  
**Endpoint:** `GET /api/dashboard/stages?startDate=...&endDate=...`

### Breakdown by Stages Sample Response

```json
{
  "stages": [
    { "stage": "Created", "count": 2 },
    { "stage": "Assigned", "count": 172 },
    { "stage": "In Progress", "count": 6 },
    { "stage": "On Hold", "count": 27 },
    { "stage": "Rejected", "count": 1224 },
    { "stage": "Done", "count": 16002 },
    { "stage": "Closed", "count": 808 },
    { "stage": "Un Hold", "count": 4105 },
    { "stage": "Total", "count": 2110 }
  ]
}
```

---

## 9) Avg. Time

**Widget:** `AverageTime`  
**Endpoint:** `GET /api/dashboard/avg-time-by-employee?startDate=...&endDate=...`

### Avg. Time Sample Response

```json
{
  "metric": "avgTimeToCloseHours",
  "rows": [
    {
      "assignee": "Mohamed Mahmoud Abd El",
      "avgHours": 3310.08,
      "closedCount": 12
    },
    { "assignee": "Zaman Yousaf Goraya", "avgHours": 360.0, "closedCount": 9 },
    { "assignee": "Jayaraju Vedala", "avgHours": 116.0, "closedCount": 7 },
    { "assignee": "Revanth Kumar", "avgHours": 115.0, "closedCount": 6 }
  ]
}
```

---

## 10) Task Details

**Widget:** `TaskDetails`  
**Endpoint:** `GET /api/dashboard/task-details?startDate=...&endDate=...`

### Task Details Sample Response

```json
{
  "rows": [
    {
      "sno": "001",
      "systemName": "Authentication System",
      "ticketId": "TCK-001",
      "description": "Login timeout issue",
      "requestType": "Operations Support",
      "businessPriority": "High",
      "requestedByTeam": "Engineering"
    },
    {
      "sno": "002",
      "systemName": "Payment System",
      "ticketId": "TCK-002",
      "description": "Add export to CSV",
      "requestType": "Enhancement",
      "businessPriority": "Medium",
      "requestedByTeam": "Operations"
    }
  ]
}
```

---

## Suggested Delivery Order for Backend

1. `progress-status` (already wired)
2. `summary`
3. `aging`
4. `rejected`, `priority`, `type-distribution`
5. `effort-distribution`
6. `stages`
7. `avg-time-by-employee`
8. `task-details`

---

## Notes

- Current frontend has several widgets temporarily using sample data only.
- Once API is ready, components can be switched from sample data to API data with minimal changes.
- Keep response keys stable to avoid UI mapper changes.
