import { FC } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetPriorityQuery } from "@/store/dashboard/dashboard.api.ts";
import InfoCircle from "@/assets/icons/info-circle.svg";
import "./CategoryOfPriority.scss";

interface ICategoryOfPriorityProps {
  startDate?: string;
  endDate?: string;
}

const getPriorityTone = (label: string) => {
  const normalized = label.toLowerCase();

  if (normalized.includes("high")) {
    return { tone: "high", color: "#ef476f" };
  }

  if (normalized.includes("medium")) {
    return { tone: "medium", color: "#1aa6d1" };
  }

  return { tone: "low", color: "#1f8682" };
};

const CategoryOfPriority: FC<ICategoryOfPriorityProps> = ({
  startDate,
  endDate,
}) => {
  const { t } = useTranslation();
  const priorityQuery = useGetPriorityQuery(
    {
      startDate: startDate || "",
      endDate: endDate || "",
    },
    {
      skip: !startDate || !endDate,
    },
  );

  const data = (priorityQuery.data?.priority || []).map((item) => {
    const tone = getPriorityTone(item.label);

    return {
      label: item.label,
      count: item.count,
      tone: tone.tone,
      color: tone.color,
    };
  });

  const hasData = data.length > 0;

  return (
    <section className='dashboard-card chart-card mini-stat-card category-priority'>
      <div className='card-title-row'>
        <div className='mini-stat-card__title'>
          <h4>{t("Category of Priority")}</h4>
          <InfoCircle />
        </div>
      </div>

      {hasData ? (
        <>
          <div className='mini-legend'>
            {data.map((item) => (
              <div key={item.label} className='mini-legend__item'>
                <span className={`dot dot--${item.tone}`} />
                <p>{t(`${item.label} Priority`)}</p>
              </div>
            ))}
          </div>

          <div className='chart-area chart-area--small'>
            <ResponsiveContainer width='100%' height={180}>
              <BarChart data={data} barSize={42} barGap={0}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis
                  dataKey='label'
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
                  radius={[4, 4, 0, 0]}
                  label={{ position: "top", fontSize: 10, fill: "#9ca3af" }}>
                  {data.map((item) => (
                    <Cell key={item.label} fill={item.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <p className='dashboard-note'>
          {priorityQuery.isLoading
            ? t("Loading dashboard data...")
            : t("No data available")}
        </p>
      )}
    </section>
  );
};

export default CategoryOfPriority;
