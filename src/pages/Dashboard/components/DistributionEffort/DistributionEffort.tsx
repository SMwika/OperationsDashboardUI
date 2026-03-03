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
import InfoCircle from "@/assets/icons/info-circle.svg";
import "./DistributionEffort.scss";

type TimeView = "monthly" | "weekly" | "hours";

const SAMPLE_DATA = [
  { month: "Jan", roadmap: 5, operation: 32, adhoc: 12 },
  { month: "Feb", roadmap: 8, operation: 21, adhoc: 39 },
  { month: "Mar", roadmap: 11, operation: 30, adhoc: 48 },
  { month: "Apr", roadmap: 14, operation: 70, adhoc: 56 },
  { month: "May", roadmap: 16, operation: 33, adhoc: 66 },
  { month: "Jun", roadmap: 38, operation: 56, adhoc: 75 },
  { month: "Jul", roadmap: 36, operation: 50, adhoc: 67 },
  { month: "Aug", roadmap: 43, operation: 26, adhoc: 66 },
  { month: "Sep", roadmap: 50, operation: 14, adhoc: 80 },
  { month: "Oct", roadmap: null, operation: null, adhoc: null },
  { month: "Nov", roadmap: null, operation: null, adhoc: null },
  { month: "Dec", roadmap: null, operation: null, adhoc: null },
];

const DistributionEffort: FC = () => {
  const { t } = useTranslation();
  const [timeView, setTimeView] = useState<TimeView>("monthly");
  const [activeTab, setActiveTab] = useState<"distribution" | "balance">(
    "distribution",
  );

  const data = useMemo(() => SAMPLE_DATA, []);

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
            defaultValue='Abdullah Faisal'
            aria-label={t("Employee select")}>
            <option>Abdullah Faisal</option>
          </select>

          <div className='distribution-effort__time'>
            {(["monthly", "weekly", "hours"] as const).map((item) => (
              <button
                key={item}
                type='button'
                className={timeView === item ? "active" : ""}
                onClick={() => setTimeView(item)}>
                {t(item.charAt(0).toUpperCase() + item.slice(1))}
              </button>
            ))}
          </div>

          <div className='distribution-effort__tabs'>
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
          </div>
        </div>
      </div>

      <div className='chart-area'>
        <ResponsiveContainer width='100%' height={220}>
          <LineChart
            data={data}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray='4 4' vertical={false} />
            <XAxis
              dataKey='month'
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(value, name) => [`${value}%`, t(String(name))]}
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
            />
            <Line
              type='monotone'
              dataKey='roadmap'
              name={t("Roadmap")}
              stroke='#7f3b76'
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#7f3b76", stroke: "#7f3b76" }}
              connectNulls={false}
            />
            <Line
              type='monotone'
              dataKey='operation'
              name={t("Operation")}
              stroke='#1f4fb0'
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#1f4fb0", stroke: "#1f4fb0" }}
              connectNulls={false}
            />
            <Line
              type='monotone'
              dataKey='adhoc'
              name={t("Ad hoc")}
              stroke='#20a278'
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#20a278", stroke: "#20a278" }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default DistributionEffort;
