import { useState } from "react";
import "./Dashboard.scss";
import { useTranslation } from "react-i18next";
import { useGetProgressStatusQuery } from "@/store/dashboard/dashboard.api.ts";
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

const formatDate = (value: Date) => {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDefaultRange = () => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    startDate: formatDate(monthStart),
    endDate: formatDate(now),
  };
};

const Dashboard = () => {
  const [range, setRange] = useState(getDefaultRange());
  const { t } = useTranslation();

  const hasRange = !!range.startDate && !!range.endDate;

  const progressQuery = useGetProgressStatusQuery(range, {
    skip: !hasRange,
  });

  return (
    <div className='Dashboard'>
      <SummaryKpis />

      <PerformanceOverview />
      <ProgressStatus
        data={progressQuery.data}
        isLoading={progressQuery.isLoading}
        isError={progressQuery.isError}
        range={range}
        onRangeChange={setRange}
      />

      <Aging />

      <div className='dashboard-grid dashboard-grid--triple'>
        <RejectingStatus />
        <CategoryOfPriority />
        <TaskPerType />
      </div>

      <DistributionEffort />

      <BreakdownByStages />

      <AverageTime />

      <TaskDetails />

      {/* {progressQuery.isLoading && (
        <p className='dashboard-note'>{t("Loading dashboard data...")}</p>
      )}

      {progressQuery.isError && (
        <p className='dashboard-note error'>
          {t("Some dashboard sections failed to load")}
        </p>
      )} */}
    </div>
  );
};

export default Dashboard;
