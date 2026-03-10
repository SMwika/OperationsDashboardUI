import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  StackIcon,
  MeasureIcon,
  BudgetIcon,
  OrderIcon,
  DollarIcon,
  PurchasingOrderIcon,
} from "@/components/Icons/Icons.tsx";
import { ISummaryKpis } from "@/store/dashboard/dashboard.api.ts";
import "./SummaryKpis.scss";

interface ISummaryKpisProps {
  data?: ISummaryKpis;
  isLoading?: boolean;
}

const formatAverage = (value: number) => {
  if (Number.isInteger(value)) {
    return value.toFixed(0);
  }

  return value.toFixed(2);
};

const SummaryKpis: FC<ISummaryKpisProps> = ({ data, isLoading }) => {
  const { t } = useTranslation();
  const hasData = !!data;

  const items = useMemo(
    () =>
      hasData
        ? [
            {
              key: "totalTickets",
              label: t("Total Tickets"),
              value: data.totalTickets,
              icon: BudgetIcon,
              tone: "violet",
            },
            {
              key: "assignedTickets",
              label: t("Assigned Tickets"),
              value: data.assignedTickets,
              icon: DollarIcon,
              tone: "violet",
            },
            {
              key: "unassignedTickets",
              label: t("Unassigned Tickets"),
              value: data.unassignedTickets,
              icon: MeasureIcon,
              tone: "violet",
            },
            {
              key: "solvedTickets",
              label: t("Solved Tickets"),
              value: data.solvedTickets,
              icon: StackIcon,
              tone: "mint",
            },
            {
              key: "avgAssignmentHours",
              label: t("Avg. Assignment (Hours)"),
              value: formatAverage(data.avgAssignmentHours),
              icon: PurchasingOrderIcon,
              tone: "mint",
            },
            {
              key: "avgResolutionHours",
              label: t("Avg. Resolution (Hours)"),
              value: formatAverage(data.avgResolutionHours),
              icon: OrderIcon,
              tone: "mint",
            },
          ]
        : [],
    [data, hasData, t],
  );

  if (!hasData) {
    return (
      <p className='dashboard-note'>
        {isLoading ? t("Loading dashboard data...") : t("No data available")}
      </p>
    );
  }

  return (
    <div className='dashboard-grid dashboard-grid--stats summary-kpis'>
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.key}
            className='dashboard-card kpi-card summary-kpis__card'>
            <div className='summary-kpis__header'>
              <p>{item.label}</p>
              <span
                className={`summary-kpis__icon summary-kpis__icon--${item.tone}`}>
                <Icon />
              </span>
            </div>
            <h3>{item.value}</h3>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryKpis;
