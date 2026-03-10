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
import { useGetStagesQuery } from "@/store/dashboard/dashboard.api.ts";
import InfoCircle from "@/assets/icons/info-circle.svg";
import "./BreakdownByStages.scss";

interface IBreakdownByStagesProps {
  startDate?: string;
  endDate?: string;
}

const BreakdownByStages: FC<IBreakdownByStagesProps> = ({
  startDate,
  endDate,
}) => {
  const { t } = useTranslation();
  const stagesQuery = useGetStagesQuery(
    {
      startDate: startDate || "",
      endDate: endDate || "",
    },
    {
      skip: !startDate || !endDate,
    },
  );

  const data = stagesQuery.data?.stages || [];
  const hasData = data.length > 0;

  const maxCount = data.reduce((max, item) => Math.max(max, item.count), 0);
  const xDomainMax = maxCount > 0 ? Math.ceil(maxCount * 1.1) : 100;

  return (
    <section className='dashboard-card chart-card breakdown-by-stages'>
      <div className='card-title-row breakdown-by-stages__header'>
        <div className='breakdown-by-stages__title'>
          <h4>{t("Breakdown by Stages")}</h4>
          <InfoCircle />
        </div>
      </div>

      <div className='chart-area'>
        {hasData ? (
          <ResponsiveContainer width='100%' height={350}>
            <BarChart
              data={data}
              layout='vertical'
              margin={{ top: 6, right: 18, left: 8, bottom: 6 }}
              barCategoryGap='25%'>
              <CartesianGrid strokeDasharray='4 4' vertical />
              <XAxis
                type='number'
                domain={[0, xDomainMax]}
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
                {data.map((item) => (
                  <Cell
                    key={item.stage}
                    fill={item.stage === "Total" ? "#7f89b8" : "#4a8589"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className='dashboard-note'>
            {stagesQuery.isLoading
              ? t("Loading dashboard data...")
              : t("No data available")}
          </p>
        )}
      </div>
    </section>
  );
};

export default BreakdownByStages;
