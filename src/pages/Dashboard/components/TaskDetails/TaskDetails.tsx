import { FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import InfoCircle from "@/assets/icons/info-circle.svg";
import { useGetTaskDetailsQuery } from "@/store/dashboard/dashboard.api.ts";
import "./TaskDetails.scss";

interface ITaskDetailsProps {
  startDate?: string;
  endDate?: string;
}

const PAGE_SIZE = 10;

const TaskDetails: FC<ITaskDetailsProps> = ({ startDate, endDate }) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const taskDetailsQuery = useGetTaskDetailsQuery(
    {
      startDate: startDate || "",
      endDate: endDate || "",
    },
    {
      skip: !startDate || !endDate,
    },
  );

  const rows = useMemo(
    () => taskDetailsQuery.data?.rows || [],
    [taskDetailsQuery.data?.rows],
  );
  const hasData = rows.length > 0;

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return rows.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, rows]);

  return (
    <section className='dashboard-card table-card task-details'>
      <div className='card-title-row task-details__header'>
        <div className='task-details__title'>
          <h4>{t("Task Details")}</h4>
          <InfoCircle />
        </div>
      </div>

      <div className='table-wrap'>
        {hasData ? (
          <>
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
                {paginatedRows.map((row) => (
                  <tr key={`${row.id}-${row.sno}`}>
                    <td>{row.sno || "-"}</td>
                    <td>{row.systemName || row.areaPath || "-"}</td>
                    <td>{row.ticketId || row.id || "-"}</td>
                    <td>{row.description || "-"}</td>
                    <td>{row.requestType || row.workItemType || "-"}</td>
                    <td>{row.businessPriority || "-"}</td>
                    <td>{row.requestedBy || row.assignedTo || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {rows.length > PAGE_SIZE && (
              <div className='task-details__pagination'>
                <button
                  type='button'
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}>
                  {t("Previous")}
                </button>
                <span>
                  {t("Page")} {currentPage} {t("of")} {totalPages}
                </span>
                <button
                  type='button'
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}>
                  {t("Next")}
                </button>
              </div>
            )}
          </>
        ) : (
          <p className='dashboard-note'>
            {taskDetailsQuery.isLoading
              ? t("Loading dashboard data...")
              : t("No data available")}
          </p>
        )}
      </div>
    </section>
  );
};

export default TaskDetails;
