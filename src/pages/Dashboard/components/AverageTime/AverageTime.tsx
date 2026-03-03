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
import InfoCircle from "@/assets/icons/info-circle.svg";
import "./AverageTime.scss";

const SAMPLE_DATA = [
  {
    assignee: "Mohamed Mahmoud Abd El",
    value: 137.92,
    durationLabel: "137d 22h",
  },
  { assignee: "Zaman Yousaf Goraya", value: 15, durationLabel: "15d 0h" },
  { assignee: "Jayaraju Vedala", value: 4.83, durationLabel: "4d 20h" },
  { assignee: "Revanth Kumar", value: 4.79, durationLabel: "4d 19h" },
  { assignee: "Mohammed Bafadhl", value: 3.58, durationLabel: "3d 14h" },
  { assignee: "Mohammed Oman Baiker", value: 2.29, durationLabel: "2d 7h" },
  { assignee: "Jahangir Ahmad Nakoo", value: 2.21, durationLabel: "2d 5h" },
  { assignee: "Abdulaziz Abuafaraj", value: 2.0, durationLabel: "2d 0h" },
  { assignee: "-", value: 1.96, durationLabel: "2d 23" },
  {
    assignee: "Nansakishor Dhanaji Vala...",
    value: 2.5,
    durationLabel: "2d 12h",
  },
];

const AverageTime: FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"close" | "open">("close");

  const data = useMemo(() => SAMPLE_DATA, []);

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
        <ResponsiveContainer width='100%' height={430}>
          <BarChart
            data={data}
            layout='vertical'
            margin={{ top: 6, right: 20, left: 2, bottom: 8 }}
            barCategoryGap='40%'>
            <CartesianGrid strokeDasharray='4 4' />
            <XAxis
              type='number'
              domain={[0, 210]}
              ticks={[20, 40, 60, 80, 100, 120, 140, 180, 160, 200]}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type='category'
              dataKey='assignee'
              width={140}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(value, _name, props) => [
                `${value} days`,
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
      </div>
    </section>
  );
};

export default AverageTime;
