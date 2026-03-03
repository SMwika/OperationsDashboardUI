import { useAppDispatch, useAppSelector } from "@/hooks/redux.ts";
import { setFiltersState } from "@/store/common/common.slice.ts";
import { IFilterState, ILookUp } from "@/interfaces";
import { FC } from "react";
import DropDown from "../common/DropDown/DropDown.tsx";
import "./MainFilters.scss";
import { useTranslation } from "react-i18next";
import { FilterIcon } from "@/components/Icons/Icons.tsx";

interface IMainFiltersProps {
  lookup: ILookUp | null;
  getData: (filters?: IFilterState) => void;
  clearFilter: (filters?: IFilterState) => void;
  title: string;
  setShowFilterModal: (arg0: boolean) => void;
}

const filters: Array<{ title: string; key: string }> = [
  { title: "Scope year", key: "scope_years" },
  { title: "Projects", key: "system_types" },
  { title: "Regions", key: "regions" },
  { title: "Violations", key: "violations" },
  { title: "Contractor", key: "contractors" },
  { title: "Priority", key: "priority" },
];

const MainFilters: FC<IMainFiltersProps> = ({
  getData,
  clearFilter,
  lookup,
  title,
  setShowFilterModal,
}) => {
  // const [getViolationsData, { data: violationsData = [] }] = useLazyGetViolationOptionsQuery();
  const filtersState = useAppSelector(
    (state) => state.common.filters.filtersState,
  );
  // const systemTypes = useAppSelector((state) => state.common.filters.systemTypes);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  // const handleSystemTypes = (item: number) => {
  //   if(item === 0){
  //     dispatch(setSystemTypes([]));
  //     dispatch(setFiltersState({...filtersState, violations: {}}));
  //     return;
  //   }
  //   let newSystemTypes = systemTypes.slice();
  //   if (newSystemTypes.includes(item)) {
  //     newSystemTypes = newSystemTypes.filter(el => el !== item);
  //   } else {
  //     newSystemTypes = [...newSystemTypes, item]
  //   }
  //   if(!newSystemTypes.length){
  //     dispatch(setSystemTypes([]));
  //     dispatch(setFiltersState({...filtersState, violations: {}}));
  //     return;
  //   }
  //   if(newSystemTypes.every(item => !lookup?.system_types?.find(el => el.id === item)!.violation)){
  //     dispatch(setFiltersState({...filtersState, violations: {}}));
  //   }
  //   dispatch(setSystemTypes(newSystemTypes))
  // }

  const onChange = (
    name: string,
    clear: boolean,
    isChecked: boolean,
    item: { id: number; value: string },
  ) => {
    const newFilters = {
      ...filtersState,
      [name]: { ...filtersState[name] },
    };
    if (clear) {
      newFilters[name] = {};
      getData(newFilters);
    } else if (isChecked) {
      newFilters[name] && delete newFilters[name][item.value];
    } else {
      if (newFilters[name]) {
        newFilters[name][item.value] = item.id;
      }
    }
    dispatch(setFiltersState(newFilters));
  };

  const filterCount = Object.keys(filtersState).reduce(
    (count, key) => count + Object.keys(filtersState[key]).length,
    0,
  );

  return (
    <div className="mainFilters">
      <div className="mainFilters-info">
        <h1 className="page-title">{t(title)}</h1>
        {/* <ManagerInfo name={String(lookup?.project_manager ?? '')}/> */}
      </div>
      <div className="filters">
        <span onClick={() => setShowFilterModal(true)} className="all">
          <FilterIcon /> All filters {!!filterCount && `(${filterCount})`}
        </span>
        {filters.map(({ title, key }) => (
          <DropDown
            key={key}
            title={t(title)}
            name={key}
            listItems={Array.isArray(lookup?.[key]) ? lookup[key] : []}
            onChange={onChange}
            filtersState={filtersState}
            onApply={getData}
            disabled={
              title === "Violations" &&
              (!Object.values(filtersState["system_types"])?.length ||
                Object.values(filtersState["system_types"]).every(
                  (item) =>
                    !lookup?.system_types?.find((el) => el.id === item)
                      ?.violation,
                ))
            }
          />
        ))}
        <span onClick={() => clearFilter(filtersState)} className="clear">
          Clear all
        </span>
      </div>
      {/* <div className='tabs-block tabs-block--filled'>
        <Tabs
          value={systemTypes[0] || 0}
          onChange={(_, newValue) => handleSystemTypes(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          TabScrollButtonProps={{ disabled: false }}
        >
          <Tab value={0} label={t("All Projects")}/>
          {system_types.map((item: { id: number; value: string }) =>
            <Tab
              key={item.id}
              value={item.id}
              label={item.value}
              className={systemTypes.includes(item.id) ? 'Mui-selected' : ''}
              onClick={() => {
                if (systemTypes[0] === item.id) {
                  handleSystemTypes(item.id)
                }
              }}
            />
          )}
        </Tabs>

      </div> */}
    </div>
  );
};

export default MainFilters;
