import { useMemo, useState } from "react";
import "./Dashboard.scss";
import {
  useGetProgressStatusQuery,
  useGetSummaryQuery,
} from "@/store/dashboard/dashboard.api.ts";
import PerformanceOverview from "./components/PerformanceOverview/PerformanceOverview";
import SummaryKpis from "./components/SummaryKpis/SummaryKpis";
import ProgressStatus from "./components/ProgressStatus/ProgressStatus";
import Aging from "./components/Aging/Aging";
import RejectingStatus from "./components/RejectingStatus/RejectingStatus";
import CategoryOfPriority from "./components/CategoryOfPriority/CategoryOfPriority";
import TaskPerType from "./components/TaskPerType/TaskPerType";
import DistributionEffort from "./components/DistributionEffort/DistributionEffort";
import BreakdownByStages from "./components/BreakdownByStages/BreakdownByStages";
import AverageTime from "./components/AverageTime/AverageTime";
import TaskDetails from "./components/TaskDetails/TaskDetails";
import { getDefaultDateRange, toDashboardApiDate } from "./utils/dateRange";
import DateRangeFilter from "./components/DateRangeFilter/DateRangeFilter";

const Dashboard = () => {
  const [range, setRange] = useState(getDefaultDateRange());

  const hasRange = !!range.startDate && !!range.endDate;

  const apiRange = useMemo(
    () => ({
      startDate: toDashboardApiDate(range.startDate),
      endDate: toDashboardApiDate(range.endDate),
    }),
    [range],
  );

  const progressQuery = useGetProgressStatusQuery(apiRange, {
    skip: !hasRange,
  });

  const summaryQuery = useGetSummaryQuery(apiRange, {
    skip: !hasRange,
  });

  return (
    <div className='Dashboard'>
      <div className='dashboard-toolbar'>
        <DateRangeFilter range={range} onChange={setRange} />
      </div>

      <SummaryKpis
        data={summaryQuery.data?.kpis}
        isLoading={summaryQuery.isLoading}
      />

      <PerformanceOverview
        range={range}
        overviewProgress={summaryQuery.data?.overviewProgress}
        isOverviewLoading={summaryQuery.isLoading}
      />
      <ProgressStatus
        data={progressQuery.data}
        isLoading={progressQuery.isLoading}
        isError={progressQuery.isError}
      />

      <Aging asOf={apiRange.startDate} />

      <div className='dashboard-grid dashboard-grid--triple'>
        <RejectingStatus
          startDate={apiRange.startDate}
          endDate={apiRange.endDate}
        />
        <CategoryOfPriority
          startDate={apiRange.startDate}
          endDate={apiRange.endDate}
        />
        <TaskPerType
          startDate={apiRange.startDate}
          endDate={apiRange.endDate}
        />
      </div>

      <DistributionEffort
        startDate={apiRange.startDate}
        endDate={apiRange.endDate}
      />

      <BreakdownByStages
        startDate={apiRange.startDate}
        endDate={apiRange.endDate}
      />

      <AverageTime startDate={apiRange.startDate} endDate={apiRange.endDate} />

      <TaskDetails startDate={apiRange.startDate} endDate={apiRange.endDate} />
    </div>
  );
};

export default Dashboard;
