import DropDown from "../common/DropDown/DropDown";
import './Filters.scss';
import {IFilterState, IKeyValue} from "@/interfaces";
import {FC} from "react";

interface FilterData {
  title: string;
  key: string;
}

interface IFiltersProps {
  data: FilterData[];
  filtersState: IFilterState;
  setFiltersState: React.Dispatch<React.SetStateAction<IFilterState>>;
  onApply: (filters?: IFilterState | undefined) => void;
  lookup?: IKeyValue | null;
}

const Filters: FC<IFiltersProps> = ({ data, filtersState, setFiltersState, onApply, lookup }) => {

  const onChange = (name: string, clear: boolean, isChecked: boolean, item: {id: number, value: string}) => {

    const newFilters = {
      ...filtersState,
      [name]: { ...filtersState[name] }
    };
    if (clear) {
      newFilters[name] = {};
      onApply(newFilters);
    } else if (isChecked) {
      newFilters[name] && delete newFilters[name][item.value];
    } else {
      if(newFilters[name]){
        newFilters[name][item.value] = item.id
      }
    }
    setFiltersState(newFilters);
  };

  return (
    <div className="filters">
      {data.map(({ title, key }) => (
        <DropDown
          key={key}
          title={title}
          name={key}
          listItems={Array.isArray(lookup?.[key]) ? lookup[key] : []}
          onChange={onChange}
          filtersState={filtersState}
          onApply={onApply}
        />
      ))}
    </div>
  );
};

export default Filters;