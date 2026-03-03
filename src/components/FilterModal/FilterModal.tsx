import {
  Dialog,
  DialogContent,
  Checkbox,
} from "@mui/material";
import React, {useState} from "react";
import Button, {BUTTON_COLORS} from "@/components/common/Button/Button.tsx";
import './FilterModal.scss';
import {CloseIcon} from "@/components/Icons/Icons.tsx";
import {useTranslation} from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.ts";
import { IFilterState, ILookUp } from "@/interfaces";
import {setFiltersState} from "@/store/common/common.slice.ts";

interface IFilterModalProps {
  close: () => void;
  lookup: ILookUp | null;
  getData: (filters?: IFilterState) => void;
  clearFilter: (filters?: IFilterState) => void;
}

const filters: Array<{ title: string; key: string; }> = [
  {title: 'Scope year', key: 'scope_years'},
  {title: 'Projects', key: 'system_types'},
  {title: 'Regions', key: 'regions'},
  {title: 'Violations', key: 'violations'},
  {title: 'Contractor', key: 'contractors'},
  {title: 'Priority', key: 'priority'},
];

const visibleItemsNo = 14;

const FilterModal: React.FC<IFilterModalProps> = ({close, lookup, getData, clearFilter}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const filtersState = useAppSelector((state) => state.common.filters.filtersState);
  const [visibleItems, setVisibleItems] = useState<{ [key: string]: number; }>({
    'scope_years': visibleItemsNo,
    'system_types': visibleItemsNo,
    'regions': visibleItemsNo,
    'violations': visibleItemsNo,
    'contractors': visibleItemsNo,
    'priority': visibleItemsNo,
  });

  const filteredItems = (key: string) => {
    return Array.isArray(lookup?.[key]) ? lookup[key] : [];
  }

  const onChange = (name: string, clear: boolean, isChecked: boolean, item: {id: number, value: string}) => {
  
      const newFilters = {
        ...filtersState,
        [name]: { ...filtersState[name] }
      };
      if (clear) {
        newFilters[name] = {};
        getData(newFilters);
      } else if (isChecked) {
        newFilters[name] && delete newFilters[name][item.value];
      } else {
        if(newFilters[name]){
          newFilters[name][item.value] = item.id
        }
      }
      dispatch(setFiltersState(newFilters));
    };


  return (
    <Dialog className='filterModal' open={true} onClose={close} disablePortal>
      <div className="filterModal__btns">
        <Button title='' color={BUTTON_COLORS.TRANSPARENT} onClick={close} IconNode={<CloseIcon/>}/>
        <h2>Filters</h2>
      </div>
      <DialogContent className='filterModal__content'>
        {filters.map(({ title, key }) => filteredItems(key)?.length ? (
          <div className="menu-list-grow" key={key}>
            <p>{title}</p>
            <div className='items'>
              {filteredItems(key)?.slice(0, visibleItems[key]).map(item => {
                  const isChecked = filtersState[key]?.hasOwnProperty(item.value);
                return (
                  <div className='item'><Checkbox onChange={() => onChange(key, false, isChecked, item)}  checked={isChecked} /> <span>{t(String(item.value))}</span></div>
                  )
                }
              )}
              <div className="load-more">
                {filteredItems(key)?.length > visibleItems[key] && <span onClick={() => setVisibleItems(prev => ({ ...prev, [key]: prev[key] + visibleItemsNo }))}>Show +{visibleItemsNo}</span>}
                {visibleItems[key] > visibleItemsNo && <span onClick={() => setVisibleItems(prev => ({ ...prev, [key]: ((prev[key] - visibleItemsNo) <= visibleItemsNo) ? visibleItemsNo : prev[key] - visibleItemsNo }))}>Show Less</span>}
              </div>
            </div>
          </div>
        ) : null)}
      </DialogContent>
      <div className='filterModal__footer'>
        <span onClick={() => {
          clearFilter(filtersState);
          close();
        }} className="clear">Clear all</span>
        <Button title={t('Apply')} color={BUTTON_COLORS.DEFAULT} onClick={() => {
          getData(filtersState);
          close();
        }} />
      </div>
    </Dialog>
  );
}

export default FilterModal;
