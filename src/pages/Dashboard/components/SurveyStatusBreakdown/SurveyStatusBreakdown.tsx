import { FC, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import "./SurveyStatusBreakdown.scss";
import { SYS_TYPES } from "@/constants";
import InfoCircle from "@/assets/icons/info-circle.svg";
import { useTranslation } from "react-i18next";

const surveyStatusData = [
  { status: "Total/Scope", count: 3471 },
  { status: "Un-Assigned", count: -36 },
  { status: "Assigned", count: 3435 },
  { status: "Surveys Not Started", count: -52 },
  { status: "Surveys Did Not", count: 3382 },
  { status: "Survey Pending", count: 1233 },
  { status: "Surveys Completed", count: 2150 },
  { status: "Pending Approval", count: 450 },
  { status: "Surveys Approved", count: 1700 },
  { status: "Not Completed", count: 1682 },
  { status: "Rejected", count: 18 },
  { status: "Finalized", count: 1682 },
];

const differenceStatuses = new Set([
  "Un-Assigned",
  "Surveys Not Started",
  "Survey Pending",
  "Pending Approval",
  "Not Completed",
  "Rejected",
]);

const getBarColor = (isDifference: boolean) =>
  isDifference ? "#E2B6D5" : "#612551";

const SurveyStatusBreakdown: FC = () => {
  const chartData = useMemo(() => {
    let runningTotal = 0;
    return surveyStatusData.map((item, index) => {
      const isDifference = differenceStatuses.has(item.status);
      let start = 0;
      let end = item.count;

      if (index === 0 || !isDifference) {
        // Totals start from zero and reset running total
        start = 0;
        end = item.count;
        runningTotal = item.count;
      } else {
        // Differences float from the previous total
        start = runningTotal;
        end = runningTotal + item.count;
        runningTotal = end;
      }

      const base = Math.min(start, end);
      const value = Math.abs(end - start);

      return {
        ...item,
        isDifference,
        base,
        value,
      };
    });
  }, []);
  const { t } = useTranslation();
  const MiscIcon = SYS_TYPES["Misc" as keyof typeof SYS_TYPES]?.icon;
  return (
    <div className="survey-status-breakdown">
      <div className="card__header">
        <div className="card__title">
          {MiscIcon && (
            <div className="rounded-md border-gray-200 border p-1 mr-2 flex items-center justify-center w-icon-xl h-icon-xl">
              <MiscIcon />
            </div>
          )}
          <span>{t("Survey Status Breakdown")}</span>

          <InfoCircle />
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 0, left: 0, bottom: 60 }}
            barSize={84}
            barCategoryGap="8%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7ed"
              vertical={false}
            />
            <XAxis
              dataKey="status"
              angle={0}
              textAnchor="middle"
              height={40}
              tickMargin={8}
              tick={{ fontSize: 10, fill: "var(--color-neutral-600)" }}
              // axisLine={{ stroke: "transparent" }}
              tickLine={{ stroke: "transparent" }}
            />
            <YAxis
              domain={[0, 5000]}
              ticks={[0, 500, 1000, 2000, 4000, 5000]}
              tick={{ fontSize: 11, fill: "var(--color-neutral-600)" }}
              interval={0}
              axisLine={{ stroke: "transparent" }}
              tickLine={{ stroke: "transparent" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-white)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                borderRadius: "4px",
                color: "var(--color-neutral-700)",
              }}
              formatter={(_value, _name, props) => [
                `${props?.payload?.count ?? _value}`,
                "Count",
              ]}
            />
            <Bar dataKey="base" stackId="waterfall" fill="transparent" />
            <Bar dataKey="value" stackId="waterfall" radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey="count"
                position="top"
                offset={8}
                style={{
                  fill: "var(--color-neutral-600)",
                  fontSize: 11,
                  fontWeight: 600,
                }}
                formatter={(value) => (value == null ? "" : `${value}`)}
              />
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.isDifference)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SurveyStatusBreakdown;
