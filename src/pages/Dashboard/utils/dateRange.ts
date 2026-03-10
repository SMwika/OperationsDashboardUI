export interface IDateRange {
  startDate: string;
  endDate: string;
}

const formatDate = (value: Date) => {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getDefaultDateRange = (): IDateRange => {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);

  return {
    startDate: formatDate(yearStart),
    endDate: formatDate(now),
  };
};

export const toDashboardApiDate = (value: string) => {
  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return value;
  }

  return `${day}-${month}-${year}`;
};
