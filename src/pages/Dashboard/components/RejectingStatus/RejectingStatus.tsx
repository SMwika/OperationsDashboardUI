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
import InfoCircle from "@/assets/icons/info-circle.svg";
import "./RejectingStatus.scss";

const SAMPLE_DATA = [
  { state: "Part. Solved", count: 1 },
  { state: "Unsolved", count: 6 },
  { state: "Incom. Info", count: 41 },
  { state: "Other", count: 38 },
];

const RejectingStatus: FC = () => {
  const { t } = useTranslation();
  const total = SAMPLE_DATA.reduce((acc, item) => acc + item.count, 0);
  const priorityPct = Math.round((SAMPLE_DATA[2].count / total) * 100);

  return (
    <section className='dashboard-card chart-card mini-stat-card rejecting-status'>
      <div className='card-title-row'>
        <div className='mini-stat-card__title'>
          <h4>{t("Rejecting Status")}</h4>
          <InfoCircle />
        </div>
      </div>

      <p className='mini-stat-card__meta'>
        {t("Total")}: {total} <span>|</span> {t("% of Priority")}: {priorityPct}
        %
      </p>

      <div className='chart-area chart-area--small'>
        <ResponsiveContainer width='100%' height={180}>
          <BarChart data={SAMPLE_DATA} barSize={32} barGap={0}>
            <CartesianGrid strokeDasharray='3 3' vertical={false} />
            <XAxis
              dataKey='state'
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
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
    </section>
  );
};

export default RejectingStatus;
