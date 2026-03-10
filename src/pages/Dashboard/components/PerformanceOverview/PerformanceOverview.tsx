import { FC, useMemo, useState } from "react";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import "./PerformanceOverview.scss";
import { SYS_TYPES } from "@/constants";
import InfoCircle from "@/assets/icons/info-circle.svg";
import { useTranslation } from "react-i18next";
import {
  IOverviewProgress,
  useGetTrendsQuery,
} from "@/store/dashboard/dashboard.api.ts";
import { IDateRange, toDashboardApiDate } from "../../utils/dateRange";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
);

const gaugeRanges = [
  { label: "0-69%", tone: "red" },
  { label: "70-89%", tone: "orange" },
  { label: "90-100%", tone: "green" },
];

interface IPerformanceOverviewProps {
  range?: IDateRange;
  overviewProgress?: IOverviewProgress;
  isOverviewLoading?: boolean;
}

const PerformanceOverview: FC<IPerformanceOverviewProps> = ({
  range,
  overviewProgress,
  isOverviewLoading,
}) => {
  const [isWeekly, setIsWeekly] = useState(false);
  const [isCumulative, setIsCumulative] = useState(false);
  const { t } = useTranslation();
  const hasOverviewData = !!overviewProgress;
  const overallProgress = overviewProgress?.donut?.percent || 0;
  const remainder = Math.max(0, 100 - overallProgress);

  const progressSummary = useMemo(
    () =>
      hasOverviewData
        ? [
            {
              label: t("Weekly progress"),
              value: overviewProgress.weekly.percent,
              tone: "green",
            },
            {
              label: t("Monthly progress"),
              value: overviewProgress.monthly.percent,
              tone: "orange",
            },
            {
              label: t("Yearly progress"),
              value: overviewProgress.yearly.percent,
              tone: "amber",
            },
          ]
        : [],
    [hasOverviewData, overviewProgress, t],
  );

  const gaugeData = useMemo(
    () => ({
      labels: ["Progress", "Remaining"],
      datasets: [
        {
          data: [overallProgress, remainder],
          backgroundColor: ["#FF8800", "#FFCF99"],
          hoverBackgroundColor: ["#FF8800", "#FFCF99"],
          borderWidth: 0,
          cutout: "70%",
          weight: 1,
        },
      ],
    }),
    [overallProgress, remainder],
  );

  const gaugeOptions: ChartOptions<"doughnut"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      circumference: 180,
      rotation: -90,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label(context) {
              const value = context.parsed as number;
              return `${context.label}: ${value}%`;
            },
          },
          padding: 12,
          displayColors: false,
          backgroundColor: "#0f172a",
          titleColor: "#fff",
          bodyColor: "#fff",
          borderColor: "#0ea5e9",
          borderWidth: 1,
        },
      },
    }),
    [],
  );

  const centerTextPlugin = useMemo(
    () => ({
      id: "centerText",
      afterDraw(chart: ChartJS) {
        const { ctx, chartArea } = chart;
        const meta = chart.getDatasetMeta(0);
        if (!meta?.data?.length) return;
        const { x, y } = meta.data[0];

        // Center text
        ctx.save();
        ctx.font = "600 26px 'IBMPlexSans', 'SomarBold', sans-serif";
        ctx.fillStyle = "#1f2937";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(overviewProgress?.donut?.value) || "0", x, y - 6);
        ctx.font = "400 12px 'IBMPlexSans', 'SomarRegular', sans-serif";
        ctx.fillStyle = "#6b7280";
        // ctx.fillText("Overall progress", x, y + 18);
        ctx.restore();

        // Left end label (0.0%)
        ctx.save();
        ctx.font = "500 11px 'IBMPlexSans', 'SomarRegular', sans-serif";
        ctx.fillStyle = "#6b7280";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        const bottomY = y + 10;
        ctx.fillText("0", chartArea.left + 15, bottomY);
        ctx.restore();

        // Right end label (100.0%)
        ctx.save();
        ctx.font = "500 11px 'IBMPlexSans', 'SomarRegular', sans-serif";
        ctx.fillStyle = "#6b7280";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(
          String(overviewProgress?.donut?.total) || "0",
          chartArea.right - 15,
          bottomY,
        );
        ctx.restore();
      },
    }),
    [overallProgress, overviewProgress?.donut],
  );

  const dottedGridPlugin = useMemo(
    () => ({
      id: "dottedGrid",
      afterDatasetsDraw(chart: ChartJS) {
        const { ctx, chartArea, scales } = chart;
        if (!scales.y) return;

        const yScale = scales.y;
        ctx.save();
        ctx.strokeStyle = "#e5e7ed";
        ctx.lineWidth = 1;
        ctx.setLineDash([15, 10]);

        yScale.ticks.forEach((tick) => {
          const y = yScale.getPixelForValue(tick as unknown as number);
          if (y >= chartArea.top && y <= chartArea.bottom) {
            ctx.beginPath();
            ctx.moveTo(chartArea.left, y);
            ctx.lineTo(chartArea.right, y);
            ctx.stroke();
          }
        });

        ctx.restore();
      },
    }),
    [],
  );

  const trendParams = useMemo(
    () => ({
      startDate: toDashboardApiDate(range?.startDate || ""),
      endDate: toDashboardApiDate(range?.endDate || ""),
      interval: (isWeekly ? "week" : "month") as "week" | "month",
      cumulative: isCumulative,
    }),
    [isCumulative, isWeekly, range],
  );

  const hasRange = !!range?.startDate && !!range?.endDate;
  const trendsQuery = useGetTrendsQuery(trendParams, {
    skip: !hasRange,
  });
  const hasTrendData = !!trendsQuery.data?.points?.length;

  const series = useMemo(() => {
    return (trendsQuery.data?.points || []).map((point) => ({
      label: point.period,
      dateLabel: point.dateLabel,
      actual: point.actual,
      forecast: point.forecast,
      plan: point.plan,
    }));
  }, [trendsQuery.data]);

  const lineData = useMemo(
    () => ({
      labels: series.map((d) => d.label),
      datasets: [
        {
          label: "Actual",
          data: series.map((d) => d.actual),
          borderColor: "#7A2F6A",
          backgroundColor: "rgba(122, 47, 106, 0.12)",
          tension: 0.28,
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 1,
          spanGaps: false,
        },
        {
          label: "Forecast",
          data: series.map((d) => d.forecast),
          borderColor: "#00AEEF",
          backgroundColor: "rgba(0, 174, 239, 0.08)",
          tension: 0.24,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          borderDash: [3, 3],
          spanGaps: false,
        },
        {
          label: "Plan",
          data: series.map((d) => d.plan),
          borderColor: "#8EA4BF",
          backgroundColor: "rgba(142, 164, 191, 0.12)",
          tension: 0.2,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          spanGaps: false,
        },
      ],
    }),
    [series],
  );

  const lineOptions: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "end",
          labels: {
            usePointStyle: false,
            boxWidth: 18,
            boxHeight: 2,
            padding: 14,
            color: "#4b5563",
            font: { size: 11 },
          },
        },
        tooltip: {
          intersect: false,
          mode: "index",
          padding: 10,
          displayColors: false,
          backgroundColor: "#0b0d12",
          bodyColor: "#ffffff",
          titleColor: "#ffffff",
          callbacks: {
            title(items) {
              const index = items[0]?.dataIndex ?? 0;
              return series[index]?.dateLabel || "";
            },
            label(context) {
              const value = context.parsed.y;
              return `${context.dataset.label}   ${value}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false, drawBorder: false },
          axis: "x",
          border: { color: "transparent" },
          ticks: {
            color: "#9ca3af",
            font: { size: 11 },
            padding: 8,
          },
        },
        y: {
          beginAtZero: true,
          suggestedMax: 1200,
          axis: "y",
          border: { display: false, dash: [4, 4] },
          grid: {
            color: "rgba(156, 163, 175, 0.35)", // soft gray (Tailwind gray-400-ish)
            lineWidth: 1,
            borderDash: [4, 4], // ✅ dotted / dashed line
            drawTicks: false,
            drawBorder: false,
          },
          ticks: {
            color: "#9ca3af",
            font: {
              size: 11,
            },
            padding: 8,
            stepSize: 200,
          },
        },
      },
    }),
    [series],
  );

  const MiscIcon = SYS_TYPES["Misc" as keyof typeof SYS_TYPES]?.icon;

  return (
    <div className='performance-overview'>
      <div className='card gauge-card'>
        <div className='card__header'>
          <div className='card__title'>
            {MiscIcon && (
              <div className='rounded-md border-gray-200 border p-1 mr-2 flex items-center justify-center w-icon-xl h-icon-xl'>
                <MiscIcon />
              </div>
            )}
            <span>{t("Overall Progress")}</span>

            <InfoCircle />
          </div>
        </div>
        <div className='gauge'>
          {hasOverviewData ? (
            <>
              <div className='gauge__chart' aria-label='Overall progress gauge'>
                <Doughnut
                  data={gaugeData}
                  options={gaugeOptions}
                  plugins={[centerTextPlugin]}
                />
              </div>
              <div className='gauge__meta'>
                <div className='legend'>
                  {gaugeRanges.map((range) => (
                    <div className='legend__item' key={range.label}>
                      <span
                        className={`legend__dot legend__dot--${range.tone}`}
                      />
                      <span className='legend__label'>{range.label}</span>
                    </div>
                  ))}
                </div>
                <div className='progress-list'>
                  {progressSummary.map((item) => (
                    <div className='progress-list__item' key={item.label}>
                      <div
                        className={`progress-list__bar progress-list__bar--${item.tone}`}
                      />
                      <div className='progress-list__content'>
                        <span className='progress-list__value'>
                          {item.value}%
                        </span>
                        <span className='progress-list__label'>
                          {item.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className='dashboard-note'>
              {isOverviewLoading
                ? t("Loading dashboard data...")
                : t("No data available")}
            </p>
          )}
        </div>
      </div>

      <div className='card trend-card flex-1 min-w-0'>
        <div className='card__header'>
          <div className='card__title'>
            {MiscIcon && (
              <div className='rounded-md border-gray-200 border p-1 mr-2 flex items-center justify-center w-icon-xl h-icon-xl'>
                <MiscIcon />
              </div>
            )}
            <span>Actual vs Plan trend</span>
            <InfoCircle />
          </div>
          <div className='trend-toggles'>
            <div className='toggle'>
              <span className='toggle__label'>Cummulative</span>
              <label className='toggle__switch'>
                <input
                  type='checkbox'
                  checked={isCumulative}
                  onChange={() => setIsCumulative((prev) => !prev)}
                  aria-label='Toggle cumulative'
                />
                <span className='toggle__slider' />
              </label>
            </div>

            <div className='toggle'>
              <span className='toggle__label'>Weekly</span>
              <label className='toggle__switch'>
                <input
                  type='checkbox'
                  checked={isWeekly}
                  onChange={() => setIsWeekly((prev) => !prev)}
                  aria-label='Toggle weekly data'
                />
                <span className='toggle__slider' />
              </label>
            </div>
          </div>
        </div>
        <div className='trend-chart'>
          {hasTrendData ? (
            <Line
              data={lineData}
              options={lineOptions}
              plugins={[dottedGridPlugin]}
              height={260}
            />
          ) : (
            <p className='dashboard-note'>
              {trendsQuery.isLoading
                ? t("Loading dashboard data...")
                : t("No data available")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceOverview;
