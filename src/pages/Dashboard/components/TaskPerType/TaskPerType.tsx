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
import { useGetTypeDistributionQuery } from "@/store/dashboard/dashboard.api.ts";
import InfoCircle from "@/assets/icons/info-circle.svg";
import "./TaskPerType.scss";

const BAR_COLORS = ["#7f3b76", "#d2b2d0", "#a8b9ce", "#9caec3"];

interface ITaskPerTypeProps {
  startDate?: string;
  endDate?: string;
}

const TaskPerType: FC<ITaskPerTypeProps> = ({ startDate, endDate }) => {
  const { t } = useTranslation();
  const typeDistributionQuery = useGetTypeDistributionQuery(
    {
      startDate: startDate || "",
      endDate: endDate || "",
    },
    {
      skip: !startDate || !endDate,
    },
  );

  const cumulativeMap = new Map(
    (typeDistributionQuery.data?.cumulativePercent || []).map((item) => [
      item.type,
      item.percent,
    ]),
  );

  const data = (typeDistributionQuery.data?.types || []).map((item) => ({
    type: item.type,
    count: item.count,
    cumulative: cumulativeMap.get(item.type) ?? null,
  }));

  const hasData = data.length > 0;

  return (
    <section className='dashboard-card chart-card mini-stat-card task-per-type'>
      <div className='card-title-row'>
        <div className='mini-stat-card__title'>
          <h4>{t("# of Task per Type")}</h4>
          <InfoCircle />
        </div>
      </div>

      {hasData ? (
        <div className='chart-area chart-area--small'>
          <ResponsiveContainer width='100%' height={195}>
            <ComposedChart data={data} barGap={0} barSize={42}>
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
                {data.map((item, index) => (
                  <Cell
                    key={item.type}
                    fill={BAR_COLORS[index % BAR_COLORS.length]}
                  />
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
      ) : (
        <p className='dashboard-note'>
          {typeDistributionQuery.isLoading
            ? t("Loading dashboard data...")
            : t("No data available")}
        </p>
      )}
    </section>
  );
};

export default TaskPerType;
