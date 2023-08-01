import React from "react";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  usePagination,
} from "react-table";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { Pagination, BasicPagination } from "./pagination";

function TableTemplate({
  columns,
  data,
  paginationOption = "full",
  ...mainTableProps
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
  } = useTable(
    { columns, data, initialState: { pageIndex: 0 } },
    useFilters,
    useGlobalFilter,
    usePagination
  );

  const { pageIndex, pageSize } = state;

  // this has to cover both "data loading" and "no results (e.g. no comments)".
  if (data.length === 0) {
    return (
      <TableContainer whiteSpace="pre-wrap">
        <Table {...getTableProps()} {...mainTableProps}>
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th {...column.getHeaderProps()}>
                    {column.render("Header")}
                    <div>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
        </Table>
      </TableContainer>
    );
  }

  function pagination() {
    if (paginationOption === "full") {
      return (
        <Pagination
          paginationReqs={{
            pageIndex,
            pageSize,
            canPreviousPage,
            canNextPage,
            pageOptions,
            pageCount,
            gotoPage,
            nextPage,
            previousPage,
            setPageSize,
          }}
        />
      );
    } else if (paginationOption === "basic") {
      return (
        <BasicPagination
          paginationReqs={{
            pageIndex,
            pageSize,
            canPreviousPage,
            canNextPage,
            pageOptions,
            pageCount,
            gotoPage,
            nextPage,
            previousPage,
            setPageSize,
          }}
        />
      );
    } else {
      return;
    }
  }

  return (
    <TableContainer whiteSpace="pre-wrap">
      <Table {...getTableProps()} {...mainTableProps}>
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th {...column.getHeaderProps()}>
                  {column.render("Header")}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <Td {...cell.getCellProps()} wordBreak="break-word">
                      {cell.render("Cell")}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      {pagination()}
    </TableContainer>
  );
}

export default TableTemplate;
