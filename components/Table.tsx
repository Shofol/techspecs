import React, { useEffect, useState } from "react";
import {
  Row,
  TableProps,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";
import Image from "next/image";
const Table = ({
  columns,
  data,
  loading,
  updateData,
  handleDelete,
  onRowSelection,
  resetData,
  editable,
  manualPagination,
  fetchData,
  enableSelection,
  pageCount: controlledPageCount,
}: {
  columns: any[];
  data: any[];
  loading: boolean;
  updateData: Function;
  handleDelete: Function;
  onRowSelection: Function;
  resetData: Function;
  editable: boolean;
  manualPagination?: boolean;
  fetchData?: Function;
  enableSelection: boolean;
  pageCount?: number;
}) => {
  const [skipPageReset, setSkipPageReset] = React.useState(false);
  const [editableRowIndex, setEditableRowIndex] = React.useState(null);
  const [hoverdRowIndex, setHoverdRowIndex] = useState(-1);

  // Create an editable cell renderer
  const EditableCell = ({
    value: initialValue,
    row,
    column,
    updateMyData, // This is a custom function that we supplied to our table instance
    editableRowIndex, // index of the row we requested for editing
  }: {
    value: any;
    row: Row;
    column: any;
    updateMyData: Function;
    editableRowIndex: number;
  }) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);
    const [prevValue, setPrevValue] = React.useState(initialValue);

    const onChange = (e: any) => {
      setValue(e.target.value);
    };

    // We'll only update the external data when the input is blurred
    // const onBlur = () => {
    //   updateMyData(row, column.id, prevValue, value);
    // };

    // If the initialValue is changed externall, sync it up with our state
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return row.index === editableRowIndex && column.editable ? (
      <input
        className="border-2 border-blue rounded-sm px-2 py-2"
        value={value}
        onChange={onChange}
        // onBlur={onBlur}
      />
    ) : (
      <p>{value}</p>
    );
  };

  // Set our editable cell renderer as the default Cell renderer
  const defaultColumn: any = {
    Cell: EditableCell,
  };

  const updateMyData = (prevValue: String, value: String) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    updateData(prevValue, value);
  };

  const deleteData = (row: Row) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    handleDelete(row);
  };

  let tableParams: any = {
    columns,
    data,
    defaultColumn,
    initialState: { pageIndex: 0, pageSize: 20 }, // Pass our hoisted table state
    autoResetPage: !skipPageReset,
    updateMyData,
    // pass state variables so that we can access them in edit hook later
    editableRowIndex,
    setEditableRowIndex, // setState hook for toggling edit on/off switch
  };

  tableParams = manualPagination
    ? {
        ...tableParams,
        pageCount: controlledPageCount,
        manualPagination: true,
      }
    : tableParams;

  const {
    getTableProps,
    getTableBodyProps,
    getRowId,
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
    selectedFlatRows,
    // Get the state from the instance
    state: { pageIndex = 0, pageSize },
  } = useTable(tableParams, useSortBy, usePagination, useRowSelect, (hooks) => {
    if (enableSelection) {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          disableSortBy: true,
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          // @ts-nocheck
          Header: (props: any) => {
            const { getToggleAllRowsSelectedProps } = props;
            return (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            );
          },
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: (props: any) => {
            const { row } = props;
            return (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            );
          },
        },
        ...columns,
      ]);
    }

    if (editable) {
      hooks.visibleColumns.push((columns) => [
        ...columns,
        // pass edit hook
        {
          //   Header: "Edit",
          accessor: "edit",
          id: "edit",
          disableSortBy: true,
          width: 5,
          Cell: ({ row, setEditableRowIndex, editableRowIndex }) => (
            <button
              className={
                "text-xs " +
                (row.index === hoverdRowIndex ? "opacity-100" : "opacity-0")
              }
              onClick={() => {
                const currentIndex = row.index;
                if (editableRowIndex !== currentIndex) {
                  // row requested for edit access
                  setEditableRowIndex(currentIndex);
                } else {
                  // request for saving the updated row
                  setEditableRowIndex(null);
                  const updatedRow = row.values;
                  // call your updateRow API
                }
              }}
            >
              {/* single action button supporting 2 modes */}
              {editableRowIndex !== row.index ? (
                <div className="flex items-center hover:opacity-70">
                  <img src="/edit.svg" alt="Edit" className="w-3 mr-1" />
                  <span>EDIT</span>
                </div>
              ) : (
                <span className="text-blue-500 hover:opacity-70">
                  SAVE CHANGES
                </span>
              )}
            </button>
          ),
        },
        {
          accessor: "delete",
          id: "delete",
          disableSortBy: true,
          width: 5,

          // Header: "Delete",
          Cell: ({ row, setEditableRowIndex, editableRowIndex }) => (
            <button
              className={
                "text-xs " +
                (row.index === hoverdRowIndex ? "opacity-100" : "opacity-0")
              }
              onClick={() => {
                if (editableRowIndex !== row.index) {
                  deleteData(row);
                } else {
                  setEditableRowIndex(null);
                  resetData();
                }
              }}
            >
              {editableRowIndex !== row.index ? (
                <div className="flex items-center hover:opacity-70">
                  <img src="/trash.svg" alt="Edit" className="w-3 mr-1" />
                  <span className="text-red-500">DELETE</span>
                </div>
              ) : (
                <span className="text-blue-500 hover:opacity-70">CANCEL</span>
              )}
            </button>
          ),
        },
      ]);
    }
  });

  useEffect(() => {
    onRowSelection(selectedFlatRows.map((d) => d.original));
  }, [selectedFlatRows]);

  const IndeterminateCheckbox = React.forwardRef((props: any, ref) => {
    const { indeterminate, ...rest } = props;
    const defaultRef = React.useRef();
    const resolvedRef: any = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  });

  IndeterminateCheckbox.displayName = "IndeterminateCheckbox";

  const [currentPageList, setCurrentPageList] = useState<Number[]>([]);

  useEffect(() => {
    if (!manualPagination) {
      if (pageOptions.length > 5) {
        setCurrentPageList([...Array(5)].map((item, index) => index + 1));
      } else {
        setCurrentPageList(
          [...Array(pageOptions.length)].map((item, index) => index + 1)
        );
      }
    }
    if (manualPagination) {
      if (+pageCount > 5) {
        setCurrentPageList([...Array(5)].map((item, index) => index + 1));
      } else {
        setCurrentPageList(
          [...Array(+pageCount)].map((item, index) => index + 1)
        );
      }
    }
  }, [pageOptions, pageCount]);

  useEffect(() => {
    // alert(pageIndex);
    fetchData && fetchData(pageIndex);
    setSkipPageReset(true);
  }, [pageIndex]);

  const handlePageClick = (event: any) => {
    const value = +event.target.innerHTML;
    if (value > 1) {
      if (
        currentPageList.findIndex((item) => item === value) ===
        currentPageList.length - 1
      ) {
        setCurrentPageList(
          [
            ...Array(
              value + 5 > pageOptions.length
                ? pageOptions.length - value + 1
                : 5
            ),
          ].map((item, index) => index + value)
        );
      } else if (currentPageList.findIndex((item) => item === value) === 0) {
        setCurrentPageList(
          [...Array(5)].map((item, index) => index + value - 4)
        );
      }
    }
    const page = event.target.innerHTML
      ? Number(event.target.innerHTML) - 1
      : 0;
    gotoPage(page);
  };

  // Render the UI for your table
  return (
    <>
      <table {...getTableProps()} className="w-full mb-10">
        <thead className="bg-med-blue text-med-light-gray text-left">
          {headerGroups.map((headerGroup, index) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, i) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="py-5 px-10 text-sm "
                  key={i}
                >
                  <div className="flex items-center">
                    {column.render("Header")}
                    {!column.disableSortBy && (
                      <span className="flex flex-col ml-2">
                        <Image
                          src="/up.svg"
                          alt="up icon"
                          width={5}
                          height={6}
                          className={
                            "mb-px " +
                            (column.isSorted
                              ? !column.isSortedDesc
                                ? "opacity-100"
                                : "opacity-60"
                              : "opacity-60")
                          }
                        />
                        <Image
                          src="/down.svg"
                          alt="down icon"
                          width={5}
                          height={6}
                          className={
                            column.isSorted
                              ? column.isSortedDesc
                                ? "opacity-100"
                                : "opacity-60"
                              : "opacity-60"
                          }
                        />

                        {/* {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""} */}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                onMouseEnter={(e) => setHoverdRowIndex(i)}
                {...row.getRowProps()}
                className="odd:bg-white even:bg-med-gray"
                key={i}
              >
                {row.cells.map((cell, index) => {
                  return (
                    <td
                      className="text-light-blue pl-10 py-5 text-sm"
                      {...cell.getCellProps()}
                      key={index}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-center items-center">
        <div className="pagination flex mb-20 text-light-blue">
          <button
            className="bg-white px-3 py-1 rounded-tl-md rounded-bl-md hover:bg-slate-400 hover:text-white duration-100"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            {"<<"}
          </button>{" "}
          <button
            className="bg-white px-2 py-1 hover:bg-slate-400 hover:text-white duration-100"
            onClick={() => {
              // previousPage();
              handlePageClick({ target: { innerHTML: pageIndex } });
            }}
            disabled={!canPreviousPage}
          >
            {"<"}
          </button>{" "}
          {currentPageList.map((page, index) => (
            <button
              key={index}
              className={
                "bg-white px-3 py-1 hover:bg-slate-400 hover:text-white duration-100 " +
                (pageIndex + 1 === page ? "bg-slate-400 text-white" : "")
              }
              onClick={(event) => handlePageClick(event)}
            >
              {page.toString()}
            </button>
          ))}
          <button
            className="bg-white px-3 py-1 hover:bg-slate-400 hover:text-white duration-100"
            onClick={() => {
              // nextPage();
              handlePageClick({ target: { innerHTML: pageIndex + 2 } });
            }}
            disabled={!canNextPage}
          >
            {">"}
          </button>{" "}
          <button
            className="bg-white px-3 py-1 rounded-tr-md rounded-br-md hover:bg-slate-400 hover:text-white duration-100"
            onClick={() =>
              handlePageClick(
                manualPagination
                  ? { target: { innerHTML: pageCount } }
                  : { target: { innerHTML: pageOptions.length } }
              )
            }
            disabled={!canNextPage}
          >
            {">>"}
          </button>{" "}
        </div>
      </div>
    </>
  );
};

export default Table;
