import { FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetAvgTimeByEmployeeQuery } from "@/store/dashboard/dashboard.api.ts";
import InfoCircle from "@/assets/icons/info-circle.svg";
import "./AverageTime.scss";

interface IAverageTimeProps {
  startDate?: string;
  endDate?: string;
}

const formatRequestorLabel = (value: string) => {
  if (value === "Unknown") {
    return value;
  }

  const match = value.match(/^by:([^,]+)/i);
  return match?.[1]?.trim() || value;
};

const AverageTime: FC<IAverageTimeProps> = ({ startDate, endDate }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"close" | "open">("close");
  const avgTimeQuery = useGetAvgTimeByEmployeeQuery(
    {
      startDate: startDate || "",
      endDate: endDate || "",
    },
    {
      skip: !startDate || !endDate,
    },
  );

  const data = useMemo(() => {
    if (activeTab === "close") {
      return (avgTimeQuery.data?.rows?.assignees || []).map((item) => ({
        label: item.assignee,
        value: item.avgHours,
        durationLabel: `${item.avgHours.toFixed(2)}h`,
      }));
    }

    return (avgTimeQuery.data?.rows?.requestors || []).map((item) => ({
      label: formatRequestorLabel(item.requestor),
      value: item.openedCount,
      durationLabel: `${item.openedCount}`,
    }));
  }, [activeTab, avgTimeQuery.data]);

  const hasData = data.length > 0;
  const maxValue = data.reduce((max, item) => Math.max(max, item.value), 0);
  const xDomainMax = maxValue > 0 ? Math.ceil(maxValue * 1.1) : 10;

  return (
    <section className='dashboard-card chart-card average-time'>
      <div className='card-title-row average-time__header'>
        <div className='average-time__title'>
          <h4>{t("Avg. Time")}</h4>
          <InfoCircle />
        </div>

        <div className='average-time__tabs'>
          <button
            type='button'
            className={activeTab === "close" ? "active" : ""}
            onClick={() => setActiveTab("close")}>
            {t("Avg. Time to Close Ticket")}
          </button>
          <button
            type='button'
            className={activeTab === "open" ? "active" : ""}
            onClick={() => setActiveTab("open")}>
            {t("Top Ticket Open")}
          </button>
        </div>
      </div>

      <div className='chart-area'>
        {hasData ? (
          <ResponsiveContainer width='100%' height={430}>
            <BarChart
              data={data}
              layout='vertical'
              margin={{ top: 6, right: 20, left: 2, bottom: 8 }}
              barCategoryGap='40%'>
              <CartesianGrid strokeDasharray='4 4' />
              <XAxis
                type='number'
                domain={[0, xDomainMax]}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type='category'
                dataKey='label'
                width={180}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(value, _name, props) => [
                  activeTab === "close" ? `${value}h` : value,
                  props?.payload?.durationLabel || "",
                ]}
              />
              <Bar dataKey='value' fill='#1f8682' radius={[0, 0, 0, 0]}>
                <LabelList
                  dataKey='durationLabel'
                  position='right'
                  style={{ fill: "#6b7280", fontSize: 12 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className='dashboard-note'>
            {avgTimeQuery.isLoading
              ? t("Loading dashboard data...")
              : t("No data available")}
          </p>
        )}
      </div>
    </section>
  );
};

export default AverageTime;
