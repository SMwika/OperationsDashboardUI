import React from 'react';
import {Skeleton, TableContainer} from "@mui/material";
import Table from "@mui/material/Table";
import './TableComponent.scss';
import TableHeadComponent from "./TableHeadComponent";
import TableBodyComponent from "./TableBodyComponent";
import TablePagination from "@mui/material/TablePagination";
import {IHeadCell} from '@/interfaces';
import clsx from "clsx";

const getTableSkeleton = (rows: number, cells: any[], options: any) => {
  return (
    <tbody>
      {[...Array(rows).keys()].map((i) =>
        <tr className='table-row' key={i}>
          {cells.map((item, i) => {
            return <td key={i} className={clsx('table-cell', options[item.field]?.className)}><Skeleton height={22}/></td>
          })}
        </tr>
      )}
    </tbody>
  )
}

interface ITableComponentProps {
  headCells: IHeadCell[];
  data: any[];
  transformers?: object;
  fixedLeft?: string[];
  fixedRight?: string[];
  defaultPaginate?: number;
  checkedItems?: {[key: string]: string}[];
  handleCheckedItems?: (value: [] | any) => void;
  loading?: boolean;
  link?: string;
  tableQuery: any;
  handleRequestSort: (field: string) => void;
  handleRedirect?: (Id: number) => void;
  options?: any;
  isExternalLink?: boolean;
  addToFavourite?: () => void;
}

type TableComponentProps =
  | (ITableComponentProps & {showAll: true; total?: never;})
  | (ITableComponentProps & {showAll?: false; total: number;});

const TableComponent: React.FC<TableComponentProps> = (props) => {

  const {
    headCells,
    data,
    transformers = {},
    fixedLeft = [],
    fixedRight = [],
    defaultPaginate = 10,
    total,
    checkedItems,
    handleCheckedItems,
    loading,
    link,
    tableQuery: {order, page, setPage, orderBy, rowsPerPage, setRowsPerPage},
    handleRequestSort,
    handleRedirect,
    options = {},
    isExternalLink,
    showAll,
    addToFavourite
  } = props;

  const showCheckbox = !!handleCheckedItems;

  const renderRows = data.map((entry: object) => {
    const transform = {};
    Object.keys(transformers).forEach((key: string) => {
      // @ts-ignore
      transform[key] = transformers[key].apply(this, [entry]);
    });
    return {...entry, ...transform};
  })

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
    handleCheckedItems && handleCheckedItems([]);
  };

  return (
    <>
      <TableContainer className='table'>
        <Table>
          <TableHeadComponent
            headCells={headCells}
            fixedLeft={fixedLeft}
            fixedRight={fixedRight}
            orderBy={orderBy}
            order={order}
            handleRequestSort={handleRequestSort}
            handleCheckedItems={handleCheckedItems}
            checkedItems={checkedItems}
            showCheckbox={showCheckbox}
            tableData={data}
            options={options}
            addToFavourite={addToFavourite}
          />
          {!loading
            ? <TableBodyComponent
                headCells={headCells}
                tableData={renderRows}
                fixedLeft={fixedLeft}
                fixedRight={fixedRight}
                handleCheckedItems={handleCheckedItems}
                checkedItems={checkedItems}
                showCheckbox={showCheckbox}
                link={link}
                isExternalLink={isExternalLink}
                options={options}
                handleRedirect={handleRedirect}
                addToFavourite={addToFavourite}
              />
            : getTableSkeleton(defaultPaginate, headCells.filter(item => item.headerName), options)
          }
        </Table>
      </TableContainer>
      {!loading
        ? (!showAll || (total !== undefined && total > 5)) && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 20, 50, 100]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => handleChangePage(newPage)}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )
        : <Skeleton/>
      }

    </>
  );
};

export default TableComponent;