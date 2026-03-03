import TableComponent from "@/components/TableComponent/TableComponent.tsx";
import useTable from "@/hooks/useTable.tsx";
import {IFilterState, IHeadCell, IKeyValue} from "@/interfaces";
import Filters from "@/components/Filters/Filters.tsx";
import {FC, useEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/redux.ts";
import {getActivityLogs} from "@/store/dashboard/dashboard.actions.ts";
import Button, {BUTTON_COLORS} from "@/components/common/Button/Button.tsx";
import {doRedirect, getHumanDate, getStatusClassname} from "@/helpers";
import SearchField from "@/components/common/SearchField/SearchField.tsx";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import {ChevronRightIcon, HistoryIcon} from "@/components/Icons/Icons.tsx";
import {useTranslation} from "react-i18next";

const filters: Array<{ title: string; key: string; type?: string }> = [
  {title: 'Milestone', key: 'milestone'},
  {title: 'By', key: 'log_partner'},
];


const columns: IHeadCell[] = [
  {field: 'Activity', headerName: 'Activity', withOutSort: true},
  {field: 'Site ID', headerName: 'Site ID', withOutSort: true},
  {field: 'System', headerName: 'Activity Type', withOutSort: true},
  {field: 'Current Milestone', headerName: 'Current Milestone', withOutSort: true},
  {field: 'Next Milestone', headerName: 'Next Milestone', withOutSort: true},
  {field: 'Date', headerName: 'Date', withOutSort: true},
  {field: 'By', headerName: 'By', withOutSort: true},
  {field: 'Plan Start', headerName: 'Plan Start', withOutSort: true},
  {field: 'Plan End', headerName: 'Plan End', withOutSort: true},
  {field: 'Forecast Start', headerName: 'Forecast Start', withOutSort: true},
  {field: 'Forecast End', headerName: 'Forecast End', withOutSort: true},
  {field: 'From', headerName: 'From Status', withOutSort: true},
  {field: 'To', headerName: 'To Status', withOutSort: true},
];

interface IMyTasksProps {
  options: IKeyValue | null
}

const ActivityLog:FC<IMyTasksProps> = ({options}) => {
  const limit = 5;
  const {tableQuery, handleRequestSort} = useTable(limit);
  const [filtersState, setFiltersState] = useState<IFilterState>(filters.reduce((acc, item) => {
    acc[item.key] = {};
    return acc;
  }, {} as IFilterState));
  const dispatch = useAppDispatch();
  const activityLogs = useAppSelector(state => state.dashboard.activityLogs);
  const [searchText, setSearchText] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState({
    start: undefined,
    end: undefined,
  });
  const datePickerRef = useRef<DatePicker | null>(null);
  const {t} = useTranslation();

  useEffect(() => {
    getData();
  }, [searchText]);

  const getData = (filters?: IFilterState | undefined, dates?: {start: any; end: any}) => {
    const period = dates || selectedPeriod;
    const body = {
      Search: searchText,
      filter: {
        ...Object.keys(filters || filtersState).reduce((acc, item) => {
          acc[item] = Object.values(filters?.[item] || filtersState[item] || {}) as (string | number)[];
          return acc;
        }, {} as Record<string, (string | number)[]>),
        date_range: period.start ? [getHumanDate(period.start), getHumanDate(period.end)] : []
      }
    }
    dispatch(getActivityLogs(body))
  }

  const handleRedirect = (Id: number) => {
    doRedirect({Id, model: 'project.task', filtersState, dispatch})
  }

  const onChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    // @ts-ignore
    setSelectedPeriod({start, end});
    if(start === null && end === null) getData(undefined,{start, end});
  };

  return (
    <div className='dashboard-table' id='activityLog'>
      <div className="dashboard-table__top info">
        <div className="info-item color-violet">
          <div className="left-side">
            <HistoryIcon/>
          </div>
          <div className="right-side">
            <h2>{t('Activity Log')}</h2>
          </div>
        </div>
        <div className="dashboard-table-filters">
          <SearchField
            searchText={searchText}
            onChange={setSearchText}
            placeholder='Search by Site or Activity ID'
            onClose={() => setSearchText('')}
          />
          <div className="dropDown">
            <DatePicker
              ref={datePickerRef}
              selected={selectedPeriod.start}
              startDate={selectedPeriod.start}
              endDate={selectedPeriod.end}
              onChange={onChange}
              monthsShown={2}
              shouldCloseOnSelect={false}
              selectsRange
              isClearable={true}
              dateFormat="dd/MM/yyyy"
              placeholderText={t('Period')}
            >
              <div className='apply-btn'>
                <Button
                  color={BUTTON_COLORS.DEFAULT}
                  title={t('Apply')}
                  disabled={!selectedPeriod.start || !selectedPeriod.end}
                  onClick={() => {
                    getData();
                    datePickerRef.current?.setOpen(false);
                  }}
                />
              </div>
            </DatePicker>
          </div>
          <Filters
            data={filters}
            filtersState={filtersState}
            setFiltersState={setFiltersState}
            onApply={getData}
            lookup={options}
          />
          <Button title={t('View all')}
                  onClick={() => doRedirect({key: 'all_tasks', model: 'project.task', filtersState, dispatch})} color={BUTTON_COLORS.GRAY} EndIcon={<ChevronRightIcon/>}/>
        </div>
      </div>
      <TableComponent
        headCells={columns}
        data={activityLogs.data || []}
        showAll
        defaultPaginate={limit}
        loading={activityLogs.loading}
        tableQuery={tableQuery}
        handleRequestSort={handleRequestSort}
        handleRedirect={handleRedirect}
        options={{
          'Current Milestone': {className: 'wide-cell'},
          'Next Milestone': {className: 'wide-cell'},
        }}
        transformers={{
          From: (row: {[key: string]: string}) => (
            <span className={`status ${getStatusClassname(row.From)}`}>
              {row.From}
            </span>
          ),
          To: (row: {[key: string]: string}) => (
            <span className={`status ${getStatusClassname(row.To)}`}>
              {row.To}
            </span>
          ),
        }}
      />
    </div>
  );
};

export default ActivityLog;