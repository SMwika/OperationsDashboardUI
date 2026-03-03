import { FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { IProgressStatusResponse } from "@/store/dashboard/dashboard.api.ts";
import InfoCircle from "@/assets/icons/info-circle.svg";
import "./ProgressStatus.scss";

const STATUS_COLORS: Record<string, string> = {
  closed: "#1f8682",
  assigned: "#caa2c3",
  ongoing: "#4e7297",
  rejected: "#ea4f67",
};

const PROGRESS_STATUS_SAMPLE_DATA: IProgressStatusResponse = {
  categories: [
    {
      category: "Milestone",
      counts: { closed: 500, assigned: 159, ongoing: 400, rejected: 41 },
      total: 1100,
    },
    {
      category: "Other",
      counts: { closed: 260, assigned: 200, ongoing: 60, rejected: 25 },
      total: 545,
    },
    {
      category: "Site Activity",
      counts: { closed: 590, assigned: 180, ongoing: 35, rejected: 22 },
      total: 827,
    },
    {
      category: "Work Order",
      counts: { closed: 400, assigned: 125, ongoing: 20, rejected: 12 },
      total: 557,
    },
    {
      category: "Invoicing",
      counts: { closed: 500, assigned: 240, ongoing: 12, rejected: 18 },
      total: 770,
    },
    {
      category: "Material",
      counts: { closed: 420, assigned: 160, ongoing: 15, rejected: 9 },
      total: 604,
    },
    {
      category: "Purchase",
      counts: { closed: 405, assigned: 58, ongoing: 12, rejected: 9 },
      total: 484,
    },
    {
      category: "Task Management Portal",
      counts: { closed: 740, assigned: 560, ongoing: 20, rejected: 8 },
      total: 1328,
    },
  ],
  legend: ["closed", "assigned", "ongoing", "rejected"],
};

interface IProgressStatusProps {
  data?: IProgressStatusResponse;
  isLoading?: boolean;
  isError?: boolean;
  range?: {
    startDate: string;
    endDate: string;
  };
  onRangeChange?: (nextRange: { startDate: string; endDate: string }) => void;
}

const ProgressStatus: FC<IProgressStatusProps> = ({
  data,
  isLoading,
  isError,
  range,
  onRangeChange,
}) => {
  const { t } = useTranslation();
  const [viewBy, setViewBy] = useState<"module" | "employee">("module");
  const [localRange, setLocalRange] = useState({
    startDate: "2025-06-04",
    endDate: "2025-09-01",
  });

  const activeRange = range || localRange;

  const resolvedData = data?.categories?.length
    ? data
    : PROGRESS_STATUS_SAMPLE_DATA;

  const handleDateChange = (key: "startDate" | "endDate", value: string) => {
    const next = {
      ...activeRange,
      [key]: value,
    };

    if (onRangeChange) {
      onRangeChange(next);
      return;
    }

    setLocalRange(next);
  };

  const chartData = useMemo(
    () =>
      resolvedData.categories.map((item) => ({
        category: item.category,
        closed: item.counts.closed,
        assigned: item.counts.assigned,
        ongoing: item.counts.ongoing,
        rejected: item.counts.rejected,
        inFlow:
          item.counts.assigned + item.counts.ongoing + item.counts.rejected,
      })),
    [resolvedData],
  );

  return (
    <section className='dashboard-card chart-card progress-status'>
      <div className='card-title-row progress-status__header'>
        <div className='title'>
          <span>{t("Progress Status")}</span>

          <InfoCircle />
        </div>
        <div className='progress-status__controls'>
          <div className='progress-status__dates'>
            <input
              type='date'
              value={activeRange.startDate}
              aria-label={t("Progress status start date")}
              title={t("Progress status start date")}
              onChange={(event) =>
                handleDateChange("startDate", event.target.value)
              }
            />
            <input
              type='date'
              value={activeRange.endDate}
              aria-label={t("Progress status end date")}
              title={t("Progress status end date")}
              onChange={(event) =>
                handleDateChange("endDate", event.target.value)
              }
            />
          </div>

          <div className='progress-status__range-rail' aria-hidden>
            <span className='dot dot--left' />
            <span className='dot dot--right' />
          </div>

          <div className='progress-status__switch'>
            <button
              type='button'
              className={viewBy === "module" ? "active" : ""}
              onClick={() => setViewBy("module")}>
              {t("Module")}
            </button>
            <button
              type='button'
              className={viewBy === "employee" ? "active" : ""}
              onClick={() => setViewBy("employee")}>
              {t("Employee")}
            </button>
          </div>
        </div>
      </div>
      <div className='chart-area'>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart
            data={chartData}
            barSize={70}
            barGap={0}
            barCategoryGap='12%'>
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='#e5e7ed'
              vertical={false}
            />
            <XAxis
              dataKey='category'
              angle={0}
              textAnchor='middle'
              height={40}
              tickMargin={8}
              tick={{ fontSize: 10, fill: "var(--color-neutral-600)" }}
              // axisLine={{ stroke: "transparent" }}
              tickLine={{ stroke: "transparent" }}
            />
            <YAxis
              domain={[0, 1000]}
              ticks={[0, 200, 400, 600, 800, 1000]}
              tick={{ fontSize: 11, fill: "var(--color-neutral-600)" }}
              interval={0}
              axisLine={{ stroke: "transparent" }}
              tickLine={{ stroke: "transparent" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "none",
                borderRadius: 6,
                color: "#fff",
              }}
              cursor={{ fill: "rgba(17, 24, 39, 0.04)" }}
            />
            <Legend
              iconType='circle'
              iconSize={8}
              align='right'
              verticalAlign='top'
              formatter={(value) => (
                <span style={{ color: "#000000", fontSize: 12 }}>
                  {t(value.charAt(0).toUpperCase() + value.slice(1))}
                </span>
              )}
            />
            <Bar
              dataKey='closed'
              fill={STATUS_COLORS.closed}
              radius={[2, 2, 0, 0]}
              name={t("Closed")}
            />
            <Bar
              dataKey='assigned'
              stackId='inFlow'
              fill={STATUS_COLORS.assigned}
              radius={[2, 2, 0, 0]}
              name={t("Assigned")}
            />
            <Bar
              dataKey='ongoing'
              stackId='inFlow'
              fill={STATUS_COLORS.ongoing}
              name={t("Ongoing")}
            />
            <Bar
              dataKey='rejected'
              stackId='inFlow'
              fill={STATUS_COLORS.rejected}
              name={t("Rejected")}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {(isLoading || isError) && (
        <p className='dashboard-note'>
          {isLoading ? t("Loading dashboard data...") : null}
        </p>
      )}
    </section>
  );
};

export default ProgressStatus;
