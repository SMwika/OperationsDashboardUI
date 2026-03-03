import React, {Fragment} from 'react';
import {TableCell, TableHead, TableRow} from "@mui/material";
import TableSortLabel from "@mui/material/TableSortLabel";
import SortDefault from "../../assets/icons/table/sort-default.svg";
import SortDown from "../../assets/icons/table/sort-down.svg";
import Checkbox from "@mui/material/Checkbox";
import {IHeadCell} from "@/interfaces";
import classNames from "classnames";
import {useTranslation} from "react-i18next";

interface ITableHeadComponentProps {
  headCells: IHeadCell[];
  fixedLeft?: string[];
  fixedRight?: string[];
  orderBy: string;
  order: "desc" | "asc";
  handleRequestSort: (field: string) => void;
  showCheckbox?: boolean;
  tableData: any[];
  options?: any;
  checkedItems?: {[key: string]: string}[];
  handleCheckedItems?: (value: [] | any) => void;
  addToFavourite?: () => void;
}

const TableHeadComponent: React.FC<ITableHeadComponentProps> = (props) => {
  const {t} = useTranslation();
  const {
    headCells,
    fixedLeft = [],
    fixedRight = [],
    orderBy,
    order,
    handleRequestSort, showCheckbox = false,
    checkedItems = [],
    handleCheckedItems = () => {},
    tableData,
    options,
    addToFavourite,
  } = props;

  const renderFixedContent = (arr: string[], position: 'left' | 'right') => (
    <TableCell className={`table-cell table-cell-fixed ${position}`}>
      {headCells.map(headCell => arr.includes(headCell.field) && (
        <Fragment key={headCell.headerName}>
          {!headCell.withOutSort
            ? <TableSortLabel
                active={orderBy === headCell.field}
                direction={orderBy === headCell.field ? order : 'asc'}
                onClick={() => handleRequestSort(headCell.field)}
                IconComponent={() => orderBy !== headCell.field ? <SortDefault/> : <SortDown/>}
                className='table-cell-item'
              >
                {t(headCell.headerName)}
              </TableSortLabel>
            : <span className='table-cell-item'>{t(headCell.headerName)}</span>
          }
        </Fragment>
      ))}
    </TableCell>
  )


  return (
    <TableHead className='table-head'>
      <TableRow>
        {showCheckbox && (
          <TableCell className="table-cell">
            <Checkbox
              checked={tableData.length === checkedItems.length}
              onChange={() => handleCheckedItems(tableData.length === checkedItems.length ? [] : tableData)}
              disableRipple
            />
          </TableCell>
        )}

        {!!addToFavourite && (
          <TableCell className="table-cell"></TableCell>
        )}
        {!!fixedLeft.length && renderFixedContent(fixedLeft, 'left')}

        {headCells.filter(e => e.field !== 'star').map((headCell) => ![...fixedLeft, ...fixedRight].includes(headCell.field) && !headCell.hidden && (
          <TableCell
            key={headCell.field}
            padding='none'
            sortDirection={orderBy === headCell.field ? order : false}
            className={classNames('table-cell', options[headCell.field]?.className)}
          >
            {!headCell.withOutSort
              ? <TableSortLabel
                active={orderBy === headCell.field}
                direction={orderBy === headCell.field ? order : 'asc'}
                onClick={() => handleRequestSort(headCell.field)}
                IconComponent={() => orderBy !== headCell.field ? <SortDefault/> : <SortDown/>}
              >
                {t(headCell.headerName)}
              </TableSortLabel>
              : headCell.headerName && <span>{t(headCell.headerName)}</span>
            }
          </TableCell>
        ))}
        {!!fixedRight.length && renderFixedContent(fixedRight, 'right')}
      </TableRow>
    </TableHead>
  );
};

export default TableHeadComponent;