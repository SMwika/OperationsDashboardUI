import { FC } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetRejectedQuery } from "@/store/dashboard/dashboard.api.ts";
import InfoCircle from "@/assets/icons/info-circle.svg";
import "./RejectingStatus.scss";

interface IRejectingStatusProps {
  startDate?: string;
  endDate?: string;
}

const formatModuleLabel = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const RejectingStatus: FC<IRejectingStatusProps> = ({ startDate, endDate }) => {
  const { t } = useTranslation();
  const rejectedQuery = useGetRejectedQuery(
    {
      startDate: startDate || "",
      endDate: endDate || "",
    },
    {
      skip: !startDate || !endDate,
    },
  );

  const data = (rejectedQuery.data?.states || []).map((item) => ({
    state: formatModuleLabel(item.module),
    count: item.count,
  }));

  const hasData = data.length > 0;
  const total = data.reduce((acc, item) => acc + item.count, 0);
  const topCount = data.reduce((max, item) => Math.max(max, item.count), 0);
  const priorityPct = total ? Math.round((topCount / total) * 100) : 0;

  return (
    <section className='dashboard-card chart-card mini-stat-card rejecting-status'>
      <div className='card-title-row'>
        <div className='mini-stat-card__title'>
          <h4>{t("Rejecting Status")}</h4>
          <InfoCircle />
        </div>
      </div>

      {hasData ? (
        <>
          <p className='mini-stat-card__meta'>
            {t("Total")}: {total} <span>|</span> {t("% of Priority")}:{" "}
            {priorityPct}%
          </p>

          <div className='chart-area chart-area--small'>
            <ResponsiveContainer width='100%' height={180}>
              <BarChart data={data} barSize={32} barGap={0}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis
                  dataKey='state'
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Bar
                  dataKey='count'
                  fill='var(--color-secondary-200)'
                  radius={[4, 4, 0, 0]}
                  label={{ position: "top", fontSize: 10, fill: "#9ca3af" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <p className='dashboard-note'>
          {rejectedQuery.isLoading
            ? t("Loading dashboard data...")
            : t("No data available")}
        </p>
      )}
    </section>
  );
};

export default RejectingStatus;
