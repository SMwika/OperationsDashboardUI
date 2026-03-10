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

const formatCategoryLabel = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

interface IProgressStatusProps {
  data?: IProgressStatusResponse;
  isLoading?: boolean;
  isError?: boolean;
}

const ProgressStatus: FC<IProgressStatusProps> = ({ data, isLoading }) => {
  const { t } = useTranslation();
  const [viewBy, setViewBy] = useState<"module" | "employee">("module");

  const hasData = !!data?.categories?.length;

  const chartData = useMemo(
    () =>
      (data?.categories || []).map((item) => ({
        category: formatCategoryLabel(item.category),
        closed: item.counts.closed,
        assigned: item.counts.assigned,
        ongoing: item.counts.ongoing,
        rejected: item.counts.rejected,
        inFlow:
          item.counts.assigned + item.counts.ongoing + item.counts.rejected,
      })),
    [data],
  );

  return (
    <section className='dashboard-card chart-card progress-status'>
      <div className='card-title-row progress-status__header'>
        <div className='title'>
          <span>{t("Progress Status")}</span>

          <InfoCircle />
        </div>
        <div className='progress-status__controls'>
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
      {hasData ? (
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
                  <span className='progress-status__legend-label'>
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
      ) : (
        <p className='dashboard-note'>
          {isLoading ? t("Loading dashboard data...") : t("No data available")}
        </p>
      )}
    </section>
  );
};

export default ProgressStatus;
