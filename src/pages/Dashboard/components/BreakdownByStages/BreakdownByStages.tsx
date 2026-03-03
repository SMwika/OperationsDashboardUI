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
import "./BreakdownByStages.scss";

const SAMPLE_DATA = [
  { stage: "Created", count: 2 },
  { stage: "Assigned", count: 172 },
  { stage: "In Progress", count: 6 },
  { stage: "On Hold", count: 27 },
  { stage: "Rejected", count: 1224 },
  { stage: "Done", count: 16002 },
  { stage: "Closed", count: 808 },
  { stage: "Un Hold", count: 4105 },
  { stage: "Total", count: 2110 },
];

const BreakdownByStages: FC = () => {
  const { t } = useTranslation();

  return (
    <section className='dashboard-card chart-card breakdown-by-stages'>
      <div className='card-title-row breakdown-by-stages__header'>
        <div className='breakdown-by-stages__title'>
          <h4>{t("Breakdown by Stages")}</h4>
          <InfoCircle />
        </div>
      </div>

      <div className='chart-area'>
        <ResponsiveContainer width='100%' height={350}>
          <BarChart
            data={SAMPLE_DATA}
            layout='vertical'
            margin={{ top: 6, right: 18, left: 8, bottom: 6 }}
            barCategoryGap='25%'>
            <CartesianGrid strokeDasharray='4 4' vertical />
            <XAxis
              type='number'
              domain={[0, 2200]}
              ticks={[300, 600, 900, 1200, 1400, 1600, 1800, 2100]}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type='category'
              dataKey='stage'
              width={90}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip />
            <Bar dataKey='count' radius={[0, 0, 0, 0]}>
              {SAMPLE_DATA.map((item) => (
                <Cell
                  key={item.stage}
                  fill={item.stage === "Total" ? "#7f89b8" : "#4a8589"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default BreakdownByStages;
