import React, { useEffect, useState } from "react";
import {
  useTable,
  useSortBy,
  useRowSelect,
  Column,
  TableInstance,
  Row,
} from "react-table";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import clientPromise from "../../lib/mongodb";
import Table from "../Table";

const Brands = ({ products }: any) => {
  const [updatedBrands, setUpdatedBrands] = useState(products);

  useEffect(() => {
    setData(
      updatedBrands.map((product: any) => ({
        name: product._id,
        amount: product.count,
      }))
    );
  }, [updatedBrands]);
  //   let brands =
  //   const totalCount = updatedBrands.length;
  const [loading, setLoading] = React.useState(false);
  const pageCount = Math.ceil(updatedBrands / 20);

  const [data, setData] = useState([]);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const [selectedRows, setSelectedRows] = useState<SelectedFlatRow[]>([]);

  const columns: Array<Column<any>> = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        editable: true,
      },
      {
        Header: "Amount of specifications",
        accessor: "amount",
      },
    ],
    []
  );

  interface SelectedFlatRow {
    name: String;
    amount: Number;
  }

  const resetData = () => {
    setData([]);
    setTimeout(() => {
      setData(data);
    }, 10);
  };

  const handleCancel = () => {
    setShowDeleteOption(false);
    setSelectedRows([]);
    resetData();
  };

  const fetchData = async () => {
    let res: any = await fetch("/api/brands", {
      method: "GET",
    });
    res = await res.json();
    setUpdatedBrands(res.data);
  };

  const updateData = async (prevValue: String, value: String) => {
    let res = await fetch("/api/brands", {
      method: "PUT",
      body: JSON.stringify({
        value,
        prevValue,
      }),
    });
    res = await res.json();
  };

  const handleDelete = async (row: Row) => {
    let res: any = await fetch("/api/brands", {
      method: "DELETE",
      body: JSON.stringify({
        value: [row.values.name],
      }),
    });
    res = await res.json();
    onDeletion(res.data);
  };

  const handleBulkDelete = async () => {
    let res: any = await fetch("/api/brands", {
      method: "DELETE",
      body: JSON.stringify({
        value: selectedRows.map((row) => row.name),
      }),
    });
    res = await res.json();
    onDeletion(res.data);
  };

  const onDeletion = (deletedItems: any[]) => {
    toast(`🗑️ ${deletedItems.map((item) => item).join(", ")} Deleted!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    fetchData();
  };

  const onRowSelection = (rows: SelectedFlatRow[]) => {
    rows.length > 0 ? setShowDeleteOption(true) : setShowDeleteOption(false);
    setSelectedRows(rows);
  };

  const deleteSelectedRows = () => {
    handleBulkDelete();
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ToastContainer />
      <div className="flex-1">
        <div className="flex justify-between text-white bg-dark-blue px-10 pt-10 pb-28">
          <h1 className="text-xl">All Brands</h1>
          {!showDeleteOption && (
            <button className="bg-cyan text-xs px-6 py-3">CREATE NEW</button>
          )}
          {showDeleteOption && (
            <div>
              <button className="text-xs px-6 py-3" onClick={handleCancel}>
                CANCEL
              </button>
              <button
                className="bg-red-500 text-xs px-6 py-3"
                onClick={deleteSelectedRows}
              >
                DELETE
              </button>
            </div>
          )}
        </div>
        <div className="-my-15 mx-10">
          <Table
            columns={columns}
            data={data}
            loading={loading}
            updateData={updateData}
            handleDelete={handleDelete}
            onRowSelection={onRowSelection}
            resetData={resetData}
            editable={true}
            enableSelection={true}
          />
        </div>
      </div>
    </>
  );
};

export default Brands;

// const tableInstance: TableInstance = useTable({ columns, data },
//     useSortBy,
//     useRowSelect,
//     hooks => {
//         hooks.visibleColumns.push(columns => [
//             // Let's make a column for selection
//             {
//                 id: 'selection',
//                 // The header can use the table's getToggleAllRowsSelectedProps method
//                 // to render a checkbox
//                 // @ts-nocheck
//                 Header: (props: any) => {
//                     const { getToggleAllRowsSelectedProps } = props;
//                     return (
//                         <div>
//                             <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
//                         </div>
//                     )
//                 },
//                 // The cell can use the individual row's getToggleRowSelectedProps method
//                 // to the render a checkbox
//                 // @ts-nocheck
//                 Cell: (props: any) => {
//                     const { row } = props;
//                     return (
//                         <div>
//                             <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
//                         </div>
//                     )
//                 },
//             },
//             ...columns,
//         ])
//     });

// const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     rows,
//     prepareRow
// } = tableInstance

// const IndeterminateCheckbox = React.forwardRef(
//     (props: any, ref) => {
//         const { indeterminate, ...rest } = props;
//         const defaultRef = React.useRef()
//         const resolvedRef: any = ref || defaultRef

//         React.useEffect(() => {
//             resolvedRef.current.indeterminate = indeterminate
//         }, [resolvedRef, indeterminate])

//         return (
//             <>
//                 <input type="checkbox" ref={resolvedRef} {...rest} />
//             </>
//         )
//     }
// )

// IndeterminateCheckbox.displayName = 'IndeterminateCheckbox';

{
  /* <table {...getTableProps()} className="w-full ">
                    <thead className='bg-med-blue text-med-light-gray text-left'>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()} >
                                {headerGroup.headers.map((column: any) => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        className="py-5 px-10 text-sm"
                                    >
                                        {column.render('Header')}
                                        <span>
                                            {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map(row => {
                            prepareRow(row)
                            return (
                                <tr {...row.getRowProps()}
                                    className="odd:bg-white even:bg-med-gray">
                                    {row.cells.map(cell => {
                                        return (
                                            <td
                                                {...cell.getCellProps()}
                                                className="text-light-blue px-10 py-5 text-sm"
                                            >
                                                {cell.render('Cell')}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table> */
}
