import React, { useEffect, useState } from "react";
import {
  Column,
  Row,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";

const Table = ({
  columns,
  data,
  loading,
  updateData,
  handleDelete,
  onRowSelection,
}: {
  columns: any[];
  data: any[];
  loading: boolean;
  updateData: Function;
  handleDelete: Function;
  onRowSelection: Function;
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
    const onBlur = () => {
      updateMyData(row, column.id, prevValue, value);
    };

    // If the initialValue is changed externall, sync it up with our state
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return row.index === editableRowIndex && column.editable ? (
      <input
        className="border-2 border-blue-500 rounded-sm px-2"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
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
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0, pageSize: 10 }, // Pass our hoisted table state
      autoResetPage: !skipPageReset,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
      // pass state variables so that we can access them in edit hook later
      editableRowIndex,
      setEditableRowIndex, // setState hook for toggling edit on/off switch
    },
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
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
        // pass edit hook
        {
          //   Header: "Edit",
          accessor: "edit",
          id: "edit",
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
                  console.log("updated row values:");
                  console.log(updatedRow);
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
          // Header: "Delete",
          Cell: ({ row, setEditableRowIndex, editableRowIndex }) => (
            <button
              className={
                "text-xs " +
                (row.index === hoverdRowIndex ? "opacity-100" : "opacity-0")
              }
              onClick={() => {
                deleteData(row);
              }}
            >
              <div className="flex items-center hover:opacity-70">
                <img src="/trash.svg" alt="Edit" className="w-3 mr-1" />
                <span className="text-red-500">DELETE</span>
              </div>
              {/* single action button supporting 2 modes */}
              {/* {editableRowIndex !== row.index ? <div className='flex items-center'><img src="/edit.svg" alt="Edit" className='w-3 mr-1' />
                                <span>Edit</span></div> : <span className='text-blue-500'>SAVE CHANGES</span>} */}
            </button>
          ),
        },
      ]);
    }
  );

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
    if (pageOptions.length > 5) {
      setCurrentPageList([...Array(5)].map((item, index) => index + 1));
    } else {
      setCurrentPageList(
        [...Array(pageOptions.length)].map((item, index) => index + 1)
      );
    }
  }, [pageOptions]);

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
                  className="py-5 px-10 text-sm"
                  key={i}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
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
                      className="text-light-blue px-10 py-5 text-sm"
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
        {/* 
            Pagination can be built however you'd like. 
            This is just a very basic UI implementation:
          */}
        {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
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
            onClick={() => previousPage()}
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
          {/* <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span> */}
          <button
            className="bg-white px-3 py-1 hover:bg-slate-400 hover:text-white duration-100"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            {">"}
          </button>{" "}
          <button
            className="bg-white px-3 py-1 rounded-tr-md rounded-br-md hover:bg-slate-400 hover:text-white duration-100"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </button>{" "}
          {/* <span>
                    | Go to page:{' '}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(page)
                        }}
                        style={{ width: '100px' }}
                    />
                </span>{' '}
                <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select> */}
        </div>
      </div>
    </>
  );
};

export default Table;
