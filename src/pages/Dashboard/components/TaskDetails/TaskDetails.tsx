import { FC } from "react";
import { useTranslation } from "react-i18next";
import InfoCircle from "@/assets/icons/info-circle.svg";
import "./TaskDetails.scss";

const SAMPLE_ROWS = [
  {
    sno: "001",
    systemName: "Authentication System",
    ticketId: "TCK-001",
    description: "Login timeout issue",
    requestType: "Operations Support",
    businessPriority: "High",
    team: "Engineering",
  },
  {
    sno: "002",
    systemName: "Payment System",
    ticketId: "TCK-002",
    description: "Add export to CSV",
    requestType: "Enhancement",
    businessPriority: "Medium",
    team: "Operations",
  },
  {
    sno: "003",
    systemName: "User Management System",
    ticketId: "TCK-003",
    description: "Payment retry logic",
    requestType: "Operations Support",
    businessPriority: "High",
    team: "Finance",
  },
  {
    sno: "004",
    systemName: "Notification System",
    ticketId: "TCK-004",
    description: "Update dashboard UI",
    requestType: "Enhancement",
    businessPriority: "Low",
    team: "Product",
  },
  {
    sno: "005",
    systemName: "Reporting System",
    ticketId: "TCK-005",
    description: "Notification delay",
    requestType: "Operations Support",
    businessPriority: "Medium",
    team: "Support",
  },
  {
    sno: "006",
    systemName: "Data Sync System",
    ticketId: "TCK-006",
    description: "Role-based access",
    requestType: "Enhancement",
    businessPriority: "High",
    team: "Security",
  },
  {
    sno: "007",
    systemName: "Access Control System",
    ticketId: "TCK-007",
    description: "App crash on iOS",
    requestType: "Operations Support",
    businessPriority: "High",
    team: "Mobile Team",
  },
  {
    sno: "008",
    systemName: "Analytics System",
    ticketId: "TCK-008",
    description: "Add dark mode",
    requestType: "Enhancement",
    businessPriority: "Low",
    team: "Design",
  },
  {
    sno: "009",
    systemName: "File Management System",
    ticketId: "TCK-009",
    description: "Report data mismatch",
    requestType: "Reporting",
    businessPriority: "Medium",
    team: "Analytics",
  },
  {
    sno: "010",
    systemName: "API Integration System",
    ticketId: "TCK-010",
    description: "API performance boost",
    requestType: "Enhancement",
    businessPriority: "High",
    team: "Platform",
  },
];

const TaskDetails: FC = () => {
  const { t } = useTranslation();

  return (
    <section className='dashboard-card table-card task-details'>
      <div className='card-title-row task-details__header'>
        <div className='task-details__title'>
          <h4>{t("Task Details")}</h4>
          <InfoCircle />
        </div>
      </div>

      <div className='table-wrap'>
        <table>
          <thead>
            <tr>
              <th>{t("S.No")}</th>
              <th>{t("System Name")}</th>
              <th>{t("Ticket / Request ID")}</th>
              <th>{t("Ticket/Enhancement Desc.")}</th>
              <th>{t("Type of Request")}</th>
              <th>{t("Business Priority")}</th>
              <th>{t("Reqt. By team")}</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_ROWS.map((row) => (
              <tr key={row.ticketId}>
                <td>{row.sno}</td>
                <td>{row.systemName}</td>
                <td>{row.ticketId}</td>
                <td>{row.description}</td>
                <td>{row.requestType}</td>
                <td>{row.businessPriority}</td>
                <td>{row.team}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TaskDetails;
