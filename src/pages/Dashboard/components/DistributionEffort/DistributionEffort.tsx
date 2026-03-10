import { FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetEffortDistributionQuery } from "@/store/dashboard/dashboard.api.ts";
import InfoCircle from "@/assets/icons/info-circle.svg";
import "./DistributionEffort.scss";

type TimeView = "monthly" | "weekly";

const LINE_COLORS = [
  "#7f3b76",
  "#1f4fb0",
  "#20a278",
  "#ef476f",
  "#1aa6d1",
  "#a855f7",
];

interface IDistributionEffortProps {
  startDate?: string;
  endDate?: string;
}

const formatLabel = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const DistributionEffort: FC<IDistributionEffortProps> = ({
  startDate,
  endDate,
}) => {
  const { t } = useTranslation();
  const [timeView, setTimeView] = useState<TimeView>("monthly");
  const [isPercent, setIsPercent] = useState(false);
  const [activeTab, setActiveTab] = useState<"distribution" | "balance">(
    "distribution",
  );
  const [assignedTo, setAssignedTo] = useState<string>("");

  const granularity =
    timeView === "monthly" ? "month" : timeView === "weekly" ? "week" : "day";
  const asPercent = isPercent;

  const effortQuery = useGetEffortDistributionQuery(
    {
      startDate: startDate || "",
      endDate: endDate || "",
      granularity,
      asPercent,
      assignedTo,
    },
    {
      skip: !startDate || !endDate,
    },
  );

  const categories = effortQuery.data?.categories || [];

  const data = useMemo(
    () =>
      (effortQuery.data?.series || []).map((item) => ({
        period: item.period,
        ...item.values,
      })),
    [effortQuery.data],
  );

  const hasData = data.length > 0 && categories.length > 0;

  return (
    <section className='dashboard-card chart-card distribution-effort'>
      <div className='card-title-row distribution-effort__header'>
        <div className='distribution-effort__title'>
          <h4>{t("Distribution Effort")}</h4>
          <InfoCircle />
        </div>

        <div className='distribution-effort__controls'>
          <label>{t("Employee")}</label>
          <select
            value={assignedTo}
            onChange={(event) => setAssignedTo(event.target.value)}
            aria-label={t("Employee select")}>
            <option value=''>{t("All")}</option>
          </select>

          <div className='distribution-effort__time'>
            {(["monthly", "weekly"] as const).map((item) => (
              <button
                key={item}
                type='button'
                className={timeView === item ? "active" : ""}
                onClick={() => setTimeView(item)}>
                {t(item.charAt(0).toUpperCase() + item.slice(1))}
              </button>
            ))}
          </div>

          <div className='distribution-effort__percent'>
            <span className='distribution-effort__percent-label'>
              {t("Percent")}
            </span>
            <label className='distribution-effort__switch'>
              <input
                type='checkbox'
                checked={isPercent}
                onChange={() => setIsPercent((prev) => !prev)}
                aria-label={t("Toggle percent")}
              />
              <span className='distribution-effort__slider' />
            </label>
          </div>

          {/* <div className='distribution-effort__tabs'>
            <button
              type='button'
              className={activeTab === "distribution" ? "active" : ""}
              onClick={() => setActiveTab("distribution")}>
              {t("Distribution Effort")}
            </button>
            <button
              type='button'
              className={activeTab === "balance" ? "active" : ""}
              onClick={() => setActiveTab("balance")}>
              {t("Weekly Balance")}
            </button>
          </div> */}
        </div>
      </div>

      <div className='chart-area'>
        {hasData ? (
          <ResponsiveContainer width='100%' height={220}>
            <LineChart
              data={data}
              margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray='4 4' vertical={false} />
              <XAxis
                dataKey='period'
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickFormatter={(value) =>
                  asPercent ? `${Number(value).toFixed(0)}%` : `${value}`
                }
                domain={asPercent ? [0, 100] : ["auto", "auto"]}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(value, name) => [
                  asPercent ? `${value}%` : value,
                  t(formatLabel(String(name))),
                ]}
                contentStyle={{
                  background: "#111827",
                  border: "none",
                  borderRadius: 6,
                  color: "#fff",
                }}
              />
              <Legend
                iconType='circle'
                iconSize={7}
                verticalAlign='top'
                align='right'
                formatter={(value) => t(formatLabel(String(value)))}
              />
              {categories.map((category, index) => (
                <Line
                  key={category}
                  type='monotone'
                  dataKey={category}
                  name={category}
                  stroke={LINE_COLORS[index % LINE_COLORS.length]}
                  strokeWidth={2.5}
                  dot={{
                    r: 3,
                    fill: LINE_COLORS[index % LINE_COLORS.length],
                    stroke: LINE_COLORS[index % LINE_COLORS.length],
                  }}
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className='dashboard-note'>
            {effortQuery.isLoading
              ? t("Loading dashboard data...")
              : t("No data available")}
          </p>
        )}
      </div>
    </section>
  );
};

export default DistributionEffort;
