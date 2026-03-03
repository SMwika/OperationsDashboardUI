import Filters from "@/components/Filters/Filters.tsx";
import TableComponent from "@/components/TableComponent/TableComponent.tsx";
import {FC, useState} from "react";
import {IFilterState, IKeyValue, IProjectMyTask} from "@/interfaces";
import {doRedirect} from "@/helpers";
import {useAppDispatch} from "@/hooks/redux.ts";

const filters: Array<{ title: string; key: string; }> = [
  {title: 'Milestone', key: 'milestone'},
  {title: 'Status', key: 'milestone_status'},
];

interface ITasksProps {
  options: IKeyValue | null;
  data: IProjectMyTask[];
}

const Tasks: FC<ITasksProps> = ({data, options}) => {
  const dispatch = useAppDispatch();
  const [filtersState, setFiltersState] = useState<IFilterState>(filters.reduce((acc, item) => {
    acc[item.key] = {};
    return acc;
  }, {} as IFilterState));
  const [filteredData, setFilteredData] = useState(data);

  const getData = (newFilters?: IFilterState) => {
    const filters = newFilters ? newFilters: filtersState;
    const isFiltered = Object.keys(filters).some(key => Object.keys(filters[key]).length);
    return !isFiltered ? data : data.filter(item => {
      const milestoneMatch = Object.keys(filters.milestone).includes(item.Milestone);
      const statusMatch = Object.keys(filters.milestone_status).includes(item.Action);
      return milestoneMatch || statusMatch;
    })
  }

  const handleRedirect = (Id: number) => {
    doRedirect({Id, model: 'project.task', filtersState, dispatch})
  }

  return (
    <>
      <div className="dashboard-table-filters">
        <Filters
          data={filters}
          filtersState={filtersState}
          setFiltersState={setFiltersState}
          onApply={(newFilters) => setFilteredData(getData(newFilters))}
          lookup={options}
        />
      </div>
      <TableComponent
        headCells={[
          {field: 'Activity ID', headerName: 'Activity ID', withOutSort: true},
          {field: 'Milestone', headerName: 'Milestone', withOutSort: true},
          {field: 'System Type', headerName: 'System Type', withOutSort: true},
          {field: 'Plan', headerName: 'Plan', withOutSort: true},
          {field: 'Actual', headerName: 'Actual', withOutSort: true},
          {field: 'Action', headerName: 'Action', withOutSort: true},
        ]}
        data={filteredData || []}
        showAll
        tableQuery={{}}
        handleRequestSort={() => {}}
        handleRedirect={handleRedirect}
      />
    </>

  );
};

export default Tasks;