import { FC, Fragment, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import InfoCircle from "@/assets/icons/info-circle.svg";
import { useGetAgingQuery } from "@/store/dashboard/dashboard.api.ts";
import "./Aging.scss";

type AgingValue = number | null;

interface IAgingRow {
  id: string;
  label: string;
  level: number;
  expandable?: boolean;
  children?: IAgingRow[];
  values: {
    d1_7: AgingValue;
    d8_14: AgingValue;
    d15_21: AgingValue;
    d21_30: AgingValue;
    d31_60: AgingValue;
    d60p: AgingValue;
    total: AgingValue;
  };
}

const COLUMNS = [
  { key: "d1_7", label: "1-7 days" },
  { key: "d8_14", label: "8-14 days" },
  { key: "d15_21", label: "15-21 days" },
  { key: "d21_30", label: "21-30 days" },
  { key: "d31_60", label: "31-60 days" },
  { key: "d60p", label: "+60 days" },
  { key: "total", label: "TOTAL" },
] as const;

const bucketToColumnKey: Record<string, keyof IAgingRow["values"]> = {
  "1-7": "d1_7",
  "8-14": "d8_14",
  "15-21": "d15_21",
  "21-30": "d21_30",
  "31-60": "d31_60",
  "60+": "d60p",
};

const renderValue = (value: AgingValue) => (value == null ? "-" : value);

const emptyAgingValues = (): IAgingRow["values"] => ({
  d1_7: null,
  d8_14: null,
  d15_21: null,
  d21_30: null,
  d31_60: null,
  d60p: null,
  total: null,
});

const formatTreeLabel = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

interface IAgingProps {
  asOf?: string;
}

const Aging: FC<IAgingProps> = ({ asOf }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const agingQuery = useGetAgingQuery({ asOf: asOf || "" }, { skip: !asOf });

  const hasData = !!agingQuery.data?.rows?.length;

  const rows = useMemo(
    () =>
      (agingQuery.data?.rows || []).map((row) => {
        const values: IAgingRow["values"] = {
          d1_7: null,
          d8_14: null,
          d15_21: null,
          d21_30: null,
          d31_60: null,
          d60p: null,
          total: row.total,
        };

        Object.entries(row.counts || {}).forEach(([bucket, count]) => {
          const key = bucketToColumnKey[bucket];
          if (key) {
            values[key] = count;
          }
        });

        const statusTree = agingQuery.data?.tree?.[row.status] || null;
        const children = statusTree
          ? Object.entries(statusTree).map(([category, types]) => {
              const categoryId = `${row.status}-${category}`
                .toLowerCase()
                .replace(/\s+/g, "-");

              return {
                id: categoryId,
                label: formatTreeLabel(category),
                level: 1,
                expandable: !!types?.length,
                values: emptyAgingValues(),
                children: (types || []).map((type) => ({
                  id: `${categoryId}-${type}`
                    .toLowerCase()
                    .replace(/\s+/g, "-"),
                  label: formatTreeLabel(type),
                  level: 2,
                  values: emptyAgingValues(),
                })),
              } as IAgingRow;
            })
          : undefined;

        return {
          id: row.status.toLowerCase().replace(/\s+/g, "-"),
          label: row.status,
          level: 0,
          expandable: !!children?.length,
          children,
          values,
        } as IAgingRow;
      }),
    [agingQuery.data?.rows, agingQuery.data?.tree],
  );

  const totalValues = useMemo(() => {
    const values: IAgingRow["values"] = {
      d1_7: null,
      d8_14: null,
      d15_21: null,
      d21_30: null,
      d31_60: null,
      d60p: null,
      total: agingQuery.data?.totals?.total ?? null,
    };

    const bucketTotals = agingQuery.data?.totals?.bucketTotals || {};
    Object.entries(bucketTotals).forEach(([bucket, count]) => {
      const key = bucketToColumnKey[bucket];
      if (key) {
        values[key] = count;
      }
    });

    return values;
  }, [agingQuery.data]);

  const toggle = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderRow = (row: IAgingRow): React.ReactNode => {
    const isExpanded = row.expandable ? (expanded[row.id] ?? false) : true;
    const showChildren = !!(
      row.expandable &&
      isExpanded &&
      row.children?.length
    );

    return (
      <Fragment key={row.id}>
        <tr
          className={`aging-row aging-row--level-${row.level} ${
            row.id === "late" ? "aging-row--highlight" : ""
          }`}>
          <td className='aging-label'>
            <div className='aging-label__content'>
              <span className={`aging-indent aging-indent--${row.level}`} />
              {row.expandable ? (
                <button
                  type='button'
                  className='aging-toggle'
                  onClick={() => toggle(row.id)}
                  aria-label={isExpanded ? t("Collapse row") : t("Expand row")}>
                  {isExpanded ? "−" : "+"}
                </button>
              ) : (
                <span className='aging-toggle aging-toggle--ghost'>+</span>
              )}
              <span>{t(row.label)}</span>
            </div>
          </td>

          {COLUMNS.map((column) => (
            <td key={`${row.id}-${column.key}`}>
              {renderValue(row.values[column.key])}
            </td>
          ))}
        </tr>

        {showChildren && row.children!.map((child) => renderRow(child))}
      </Fragment>
    );
  };

  return (
    <section className='dashboard-card table-card aging-card'>
      <div className='card-title-row aging-card__header'>
        <div className='aging-card__title'>
          <h4>{t("Aging")}</h4>
          <InfoCircle />
        </div>

        <div className='aging-card__actions'>
          <button type='button' className='active'>
            {t("Open Ticket aging")}
          </button>
          <button type='button'>{t("Assignment Aging Level")}</button>
        </div>
      </div>

      <div className='table-wrap'>
        {hasData ? (
          <table>
            <thead>
              <tr>
                <th>{t("Invoice Status")}</th>
                {COLUMNS.map((column) => (
                  <th key={column.key}>{t(column.label)}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => renderRow(row))}

              <tr className='total-row'>
                <td>{t("TOTAL")}</td>
                {COLUMNS.map((column) => (
                  <td key={`total-${column.key}`}>
                    {renderValue(totalValues[column.key])}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        ) : (
          <p className='dashboard-note'>
            {agingQuery.isLoading
              ? t("Loading dashboard data...")
              : t("No data available")}
          </p>
        )}
      </div>
    </section>
  );
};

export default Aging;
