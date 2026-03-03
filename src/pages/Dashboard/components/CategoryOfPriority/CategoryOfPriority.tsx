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
import InfoCircle from "@/assets/icons/info-circle.svg";
import "./CategoryOfPriority.scss";

const SAMPLE_DATA = [
  { label: "High", count: 1, color: "#ef476f", tone: "high" },
  { label: "Medium", count: 6, color: "#1aa6d1", tone: "medium" },
  { label: "Low", count: 77, color: "#1f8682", tone: "low" },
];

const CategoryOfPriority: FC = () => {
  const { t } = useTranslation();

  return (
    <section className='dashboard-card chart-card mini-stat-card category-priority'>
      <div className='card-title-row'>
        <div className='mini-stat-card__title'>
          <h4>{t("Category of Priority")}</h4>
          <InfoCircle />
        </div>
      </div>

      <div className='mini-legend'>
        {SAMPLE_DATA.map((item) => (
          <div key={item.label} className='mini-legend__item'>
            <span className={`dot dot--${item.tone}`} />
            <p>{t(`${item.label} Priority`)}</p>
          </div>
        ))}
      </div>

      <div className='chart-area chart-area--small'>
        <ResponsiveContainer width='100%' height={180}>
          <BarChart data={SAMPLE_DATA} barSize={42} barGap={0}>
            <CartesianGrid strokeDasharray='3 3' vertical={false} />
            <XAxis
              dataKey='label'
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar
              dataKey='count'
              radius={[4, 4, 0, 0]}
              label={{ position: "top", fontSize: 10, fill: "#9ca3af" }}>
              {SAMPLE_DATA.map((item) => (
                <Cell key={item.label} fill={item.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default CategoryOfPriority;
