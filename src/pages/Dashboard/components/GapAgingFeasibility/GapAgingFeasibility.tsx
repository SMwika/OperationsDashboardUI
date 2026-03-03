import { FC, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslation } from "react-i18next";
import { SYS_TYPES } from "@/constants";
import InfoCircle from "@/assets/icons/info-circle.svg";
import "./GapAgingFeasibility.scss";

const gapAgingRows = [
  { label: "Un-assigned", lt3Days: 16, gt1Month: 20 },
  { label: "Survey not started", lt3Days: 20, gt1Month: 32 },
  { label: "Survey pending", lt3Days: null, gt1Month: 2 },
  { label: "Pending approval", lt3Days: 50, gt1Month: 28 },
  { label: "Total", lt3Days: 574, gt1Month: 1185, total: 1759 },
];

const feasibilityData = [
  {
    system: "CCTV",
    GDOT: 2800,
    SFRS: 1200,
    Tahakom: 600,
  },
  {
    system: "CCTV Violation",
    GDOT: 0,
    SFRS: 0,
    Tahakom: 6,
  },
  {
    system: "Fixed Speed",
    GDOT: 1200,
    SFRS: 900,
    Tahakom: 77,
  },
  {
    system: "Illegal Turn",
    GDOT: 0,
    SFRS: 0,
    Tahakom: 33,
  },
];

const GapAgingFeasibility: FC = () => {
  const { t } = useTranslation();
  const MiscIcon = SYS_TYPES["Misc" as keyof typeof SYS_TYPES]?.icon;

  const rowsWithTotal = useMemo(
    () =>
      gapAgingRows.map((row) => ({
        ...row,
        total:
          row.total ??
          [row.lt3Days, row.gt1Month]
            .filter((v) => typeof v === "number")
            .reduce((acc, v) => acc + (v as number), 0),
      })),
    [],
  );

  return (
    <div className="gap-aging-feasibility">
      <div className="card gap-aging">
        <div className="card__header">
          <div className="card__title">
            {MiscIcon && (
              <div className="rounded-md border-gray-200 border p-1 mr-2 flex items-center justify-center w-icon-xl h-icon-xl">
                <MiscIcon />
              </div>
            )}
            <span>{t("Gap Aging")}</span>
            <InfoCircle />
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>{t("Gap Status")}</th>
                <th>{t("< 3 Days")}</th>
                <th>{t("> 1 Month")}</th>
                <th>{t("TOTAL")}</th>
              </tr>
            </thead>
            <tbody>
              {rowsWithTotal.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td>{row.lt3Days ?? "-"}</td>
                  <td>{row.gt1Month ?? "-"}</td>
                  <td className="total">{row.total ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card feasibility">
        <div className="card__header">
          <div className="card__title">
            {MiscIcon && (
              <div className="rounded-md border-gray-200 border p-1 mr-2 flex items-center justify-center w-icon-xl h-icon-xl">
                <MiscIcon />
              </div>
            )}
            <span>{t("System/Source Feasibility Matrix")}</span>
            <InfoCircle />
          </div>
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={feasibilityData}
              barSize={152}
              barCategoryGap="10%"
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="system"
                tick={{ fontSize: 11, fill: "var(--color-neutral-600)" }}
                axisLine={{ stroke: "transparent" }}
                tickLine={{ stroke: "transparent" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--color-neutral-600)" }}
                axisLine={{ stroke: "transparent" }}
                tickLine={{ stroke: "transparent" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-white)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                  borderRadius: "6px",
                  color: "var(--color-neutral-700)",
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                height={32}
                wrapperStyle={{
                  paddingBottom: 28,
                }}
                iconSize={8}
                formatter={(value) => (
                  <span style={{ color: "#000000", fontSize: 12 }}>
                    {value}
                  </span>
                )}
              />
              <Bar
                dataKey="GDOT"
                name="GDOT"
                stackId="a"
                fill="var(--color-secondary-200)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="SFRS"
                name="SFRS"
                stackId="a"
                fill="var(--color-secondary-500)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="Tahakom"
                name="Tahakom"
                stackId="a"
                fill="var(--color-primary-500)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GapAgingFeasibility;
