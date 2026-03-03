import { FC } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import InfoCircle from "@/assets/icons/info-circle.svg";
import "./TaskPerType.scss";

const SAMPLE_DATA = [
  { type: "Bug", count: 700, cumulative: 70 },
  { type: "Enhancement", count: 150, cumulative: 86 },
  { type: "New Development", count: 110, cumulative: 96 },
  { type: "Project Support", count: 90, cumulative: 97 },
];

const BAR_COLORS = ["#7f3b76", "#d2b2d0", "#a8b9ce", "#9caec3"];

const TaskPerType: FC = () => {
  const { t } = useTranslation();

  return (
    <section className='dashboard-card chart-card mini-stat-card task-per-type'>
      <div className='card-title-row'>
        <div className='mini-stat-card__title'>
          <h4>{t("# of Task per Type")}</h4>
          <InfoCircle />
        </div>
      </div>

      <div className='chart-area chart-area--small'>
        <ResponsiveContainer width='100%' height={195}>
          <ComposedChart data={SAMPLE_DATA} barGap={0} barSize={42}>
            <CartesianGrid strokeDasharray='3 3' vertical={false} />
            <XAxis
              dataKey='type'
              tick={{ fontSize: 9 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId='left'
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId='right'
              orientation='right'
              domain={[0, 100]}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip />
            <Bar yAxisId='left' dataKey='count' radius={[4, 4, 0, 0]}>
              {SAMPLE_DATA.map((item, index) => (
                <Cell key={item.type} fill={BAR_COLORS[index]} />
              ))}
            </Bar>
            <Line
              yAxisId='right'
              type='monotone'
              dataKey='cumulative'
              stroke='#67c5a2'
              strokeWidth={2}
              dot={{ r: 3, fill: "#67c5a2", stroke: "#67c5a2" }}
              strokeDasharray='4 4'
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default TaskPerType;
