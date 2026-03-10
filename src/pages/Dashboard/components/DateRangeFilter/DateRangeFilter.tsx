import { FC } from "react";
import { useTranslation } from "react-i18next";
import { IDateRange } from "../../utils/dateRange";

interface IDateRangeFilterProps {
  range: IDateRange;
  onChange: (nextRange: IDateRange) => void;
}

const DateRangeFilter: FC<IDateRangeFilterProps> = ({ range, onChange }) => {
  const { t } = useTranslation();

  const handleDateChange = (key: "startDate" | "endDate", value: string) => {
    onChange({
      ...range,
      [key]: value,
    });
  };

  return (
    <div className='dashboard-toolbar__dates'>
      <label>
        <span>{t("Start Date")}</span>
        <input
          type='date'
          value={range.startDate}
          aria-label={t("Dashboard start date")}
          title={t("Dashboard start date")}
          onChange={(event) =>
            handleDateChange("startDate", event.target.value)
          }
        />
      </label>

      <label>
        <span>{t("End Date")}</span>
        <input
          type='date'
          value={range.endDate}
          aria-label={t("Dashboard end date")}
          title={t("Dashboard end date")}
          onChange={(event) => handleDateChange("endDate", event.target.value)}
        />
      </label>
    </div>
  );
};

export default DateRangeFilter;
