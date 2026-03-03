import { FC, Fragment, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import InfoCircle from "@/assets/icons/info-circle.svg";
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

const SAMPLE_ROWS: IAgingRow[] = [
  {
    id: "on-schedule",
    label: "On Schedule",
    level: 0,
    values: {
      d1_7: 1,
      d8_14: 2,
      d15_21: null,
      d21_30: 1,
      d31_60: 3,
      d60p: 2,
      total: 14,
    },
  },
  {
    id: "late",
    label: "Late",
    level: 0,
    expandable: true,
    values: {
      d1_7: null,
      d8_14: 1,
      d15_21: null,
      d21_30: null,
      d31_60: null,
      d60p: null,
      total: 2,
    },
    children: [
      {
        id: "late-operations",
        label: "Operations",
        level: 1,
        expandable: true,
        values: {
          d1_7: null,
          d8_14: null,
          d15_21: null,
          d21_30: null,
          d31_60: null,
          d60p: null,
          total: null,
        },
        children: [
          {
            id: "late-bug",
            label: "Bug",
            level: 2,
            values: {
              d1_7: null,
              d8_14: null,
              d15_21: null,
              d21_30: null,
              d31_60: null,
              d60p: null,
              total: null,
            },
          },
          {
            id: "late-data-change",
            label: "Data Change",
            level: 2,
            values: {
              d1_7: null,
              d8_14: null,
              d15_21: null,
              d21_30: null,
              d31_60: null,
              d60p: null,
              total: null,
            },
          },
          {
            id: "late-general-enquiry",
            label: "General Enquiry",
            level: 2,
            values: {
              d1_7: null,
              d8_14: null,
              d15_21: null,
              d21_30: null,
              d31_60: null,
              d60p: null,
              total: null,
            },
          },
        ],
      },
      {
        id: "late-enhancement",
        label: "Enhancement",
        level: 1,
        values: {
          d1_7: null,
          d8_14: null,
          d15_21: null,
          d21_30: null,
          d31_60: null,
          d60p: null,
          total: null,
        },
      },
    ],
  },
];

const SAMPLE_TOTAL = {
  d1_7: 8,
  d8_14: 41,
  d15_21: 7,
  d21_30: 23,
  d31_60: 17,
  d60p: 17,
  total: 163,
};

const renderValue = (value: AgingValue) => (value == null ? "-" : value);

const Aging: FC = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    late: true,
    "late-operations": true,
  });

  const rows = useMemo(() => SAMPLE_ROWS, []);

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
                  {renderValue(SAMPLE_TOTAL[column.key])}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Aging;
