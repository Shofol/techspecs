import React from 'react'
import { useTable, useSortBy, useRowSelect, Column, TableInstance } from 'react-table'
import clientPromise from '../../lib/mongodb';
import Table from '../Table';

const Brands = ({ products, totalCount }: any) => {
    const brands = products.map((product: any) => ({ name: product.Product.Brand, amount: 0 }))
    const [loading, setLoading] = React.useState(false);
    const pageCount = Math.ceil(totalCount / 20);

    const data = React.useMemo(
        () => brands,
        []
    )

    const columns: Array<Column<any>> = React.useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Amount of specifications',
                accessor: 'amount',
            },
        ],
        []
    )
    const fetchData = () => {
        // fetch('http://localhost:3000/api/hello').then(
        //     res => {
        //         alert(JSON.stringify(res))
        //     }
        // )
    }


    return (
        <div className='flex-1'>
            <div className='flex justify-between text-white bg-dark-blue px-10 pt-10 pb-28'>
                <h1 className='text-xl'>All Brands</h1>
                <button className='bg-cyan text-xs px-6 py-3'>CREATE NEW</button>
            </div>
            <div className='-my-15 mx-10'>
                <Table
                    columns={columns}
                    data={data}
                    fetchData={fetchData}
                    loading={loading}
                    pageCount={pageCount}
                />
            </div>
        </div>

    )
}

export default Brands


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


{/* <table {...getTableProps()} className="w-full ">
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
                </table> */}