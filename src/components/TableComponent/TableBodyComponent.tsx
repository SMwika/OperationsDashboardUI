import React, {Fragment} from 'react';
import {TableBody, TableCell, TableRow} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import {IHeadCell} from '@/interfaces';
import {Link} from "react-router-dom";
import clsx from 'clsx';
import {StarOffIcon, StarOnIcon} from "@/components/Icons/Icons.tsx";

interface ITableBodyComponentProps {
  headCells: IHeadCell[];
  fixedLeft?: string[];
  fixedRight?: string[];
  showCheckbox?: boolean;
  checkedItems?: {[key: string]: string}[];
  handleCheckedItems?: (value: [] | any) => void;
  tableData: any[];
  link?: string;
  isExternalLink?: boolean;
  options?: any;
  handleRedirect?: (Id: number) => void;
  addToFavourite?: () => void;
}

const TableBodyComponent: React.FC<ITableBodyComponentProps> = (props) => {

  const {
    headCells,
    tableData,
    fixedLeft = [],
    fixedRight = [],
    showCheckbox,
    checkedItems = [],
    handleCheckedItems = () => {},
    link,
    isExternalLink,
    options,
    handleRedirect,
    addToFavourite
  } = props;

  const generateLink = (Id: number) => {
    if(isExternalLink){
      return <a href={`${link}/${Id}?${localStorage.getItem('encryptData')}`} className="table-link"/>
    }else{
      return <Link to={`${link}/${Id}`} className="table-link"/>
    }
  }

  return (
    <TableBody>
      {!!tableData.length
        ? tableData.map((item) => {
          const isChecked = !!checkedItems.find(el => String(item.Id) === String(el.Id));
          return (
            <Fragment key={item.Id}>
              <TableRow className={`table-row ${(link || handleRedirect) ? 'hasHover' : ''}`}>
                {showCheckbox && (
                  <TableCell className="table-cell table-cell-checkbox">
                    <Checkbox
                      checked={isChecked}
                      onChange={() => handleCheckedItems && handleCheckedItems(isChecked ?
                        checkedItems.filter(el => String(item.Id) !== String(el.Id)) :
                        [...checkedItems, item])
                      }
                      disableRipple
                    />
                  </TableCell>
                )}
                {!!addToFavourite && (
                  <td className='table-cell star-cell' onClick={() => addToFavourite()}>
                    {!item.favourite ? <StarOffIcon/> : <StarOnIcon/>}
                  </td>
                )}
                {!!fixedLeft.length && (
                  <TableCell className="table-cell table-cell-fixed left">
                    {headCells.map(el => fixedLeft.includes(el.field) && (
                      <span className='table-cell-item' key={el.field}>
                      {link && generateLink(item.Id)}
                        {item[el.field] || 'N/A'}
                    </span>
                    ))}
                  </TableCell>
                )}

                {headCells.filter(e => e.field !== 'star').map(el => ![...fixedLeft, ...fixedRight].includes(el.field) && !el.hidden && (
                  <TableCell key={el.field} className={clsx('table-cell', options[el.field]?.className)} onClick={() => {
                    if(handleRedirect){
                      handleRedirect(item.Id || item.ID);
                    }
                  }}>
                    {link && generateLink(item.Id)}
                    {item[el.field] || 'N/A'}
                  </TableCell>
                ))}
                {!!fixedRight.length && (
                  <TableCell className="table-cell table-cell-fixed right">
                    {headCells.map(el => fixedRight.includes(el.field) && (
                      <span className='table-cell-item' key={el.field}>
                      {link && generateLink(item.Id)}
                        {item[el.field] || 'N/A'}
                    </span>
                    ))}
                  </TableCell>
                )}
              </TableRow>
            </Fragment>
          )
        })
        : <TableRow>
            <TableCell className='table-cell' colSpan={6}><p>No records to display</p></TableCell>
          </TableRow>
      }
    </TableBody>
  );
};

export default TableBodyComponent;