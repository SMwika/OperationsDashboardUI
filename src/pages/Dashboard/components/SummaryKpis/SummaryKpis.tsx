import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  CompletedIcon,
  PendingIcon,
  ProjectIcon,
  SystemIcon,
  UserIcon,
  HorBarIcon,
} from "@/components/Icons/Icons.tsx";
import "./SummaryKpis.scss";

interface ISummaryRange {
  startDate: string;
  endDate: string;
}

interface ISummaryKpis {
  totalTickets: number;
  assignedTickets: number;
  unassignedTickets: number;
  solvedTickets: number;
  avgAssignmentHours: number;
  avgResolutionHours: number;
}

interface ISummaryResponse {
  range: ISummaryRange;
  kpis: ISummaryKpis;
  overviewProgress: {
    donut: { total: number; value: number; percent: number };
    weekly: { percent: number };
    monthly: { percent: number };
    yearly: { percent: number };
  };
}

const sampleSummaryData: ISummaryResponse = {
  range: { startDate: "2026-01-01", endDate: "2026-02-01" },
  kpis: {
    totalTickets: 140,
    assignedTickets: 100,
    unassignedTickets: 40,
    solvedTickets: 70,
    avgAssignmentHours: 4,
    avgResolutionHours: 4,
  },
  overviewProgress: {
    donut: { total: 750, value: 585, percent: 78 },
    weekly: { percent: 90 },
    monthly: { percent: 78 },
    yearly: { percent: 61 },
  },
};

const SummaryKpis: FC = () => {
  const { t } = useTranslation();

  const items = useMemo(
    () => [
      {
        key: "totalTickets",
        label: t("Total Tickets"),
        value: sampleSummaryData.kpis.totalTickets,
        icon: ProjectIcon,
        tone: "violet",
      },
      {
        key: "assignedTickets",
        label: t("Assigned Tickets"),
        value: sampleSummaryData.kpis.assignedTickets,
        icon: UserIcon,
        tone: "pink",
      },
      {
        key: "unassignedTickets",
        label: t("Unassigned Tickets"),
        value: sampleSummaryData.kpis.unassignedTickets,
        icon: PendingIcon,
        tone: "lilac",
      },
      {
        key: "solvedTickets",
        label: t("Solved Tickets"),
        value: sampleSummaryData.kpis.solvedTickets,
        icon: CompletedIcon,
        tone: "mint",
      },
      {
        key: "avgAssignmentHours",
        label: t("Avg. Assignment (Hours)"),
        value: sampleSummaryData.kpis.avgAssignmentHours.toFixed(0),
        icon: HorBarIcon,
        tone: "teal",
      },
      {
        key: "avgResolutionHours",
        label: t("Avg. Resolution (Hours)"),
        value: sampleSummaryData.kpis.avgResolutionHours.toFixed(0),
        icon: SystemIcon,
        tone: "cyan",
      },
    ],
    [t],
  );

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
