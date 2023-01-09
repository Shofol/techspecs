import React from 'react'
import { usePagination, useRowSelect, useSortBy, useTable } from 'react-table'

const Table = ({
    columns,
    data,
    loading,
}) => {
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
        // Get the state from the instance
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 }, // Pass our hoisted table state
            manualPagination: true, // Tell the usePagination
            // hook that we'll handle our own data fetching
            // This means we'll also have to provide our own
            // pageCount.
            // pageCount: controlledPageCount,
        },
        useSortBy,
        usePagination,
        useRowSelect,
        hooks => {
            hooks.visibleColumns.push(columns => [
                // Let's make a column for selection
                {
                    id: 'selection',
                    // The header can use the table's getToggleAllRowsSelectedProps method
                    // to render a checkbox
                    // @ts-nocheck
                    Header: (props: any) => {
                        const { getToggleAllRowsSelectedProps } = props;
                        return (
                            <div>
                                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                            </div>
                        )
                    },
                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    // @ts-nocheck
                    Cell: (props: any) => {
                        const { row } = props;
                        return (
                            <div>
                                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                            </div>
                        )
                    },
                },
                ...columns,
            ])
        }
    )

    const IndeterminateCheckbox = React.forwardRef(
        (props: any, ref) => {
            const { indeterminate, ...rest } = props;
            const defaultRef = React.useRef()
            const resolvedRef: any = ref || defaultRef

            React.useEffect(() => {
                resolvedRef.current.indeterminate = indeterminate
            }, [resolvedRef, indeterminate])

            return (
                <>
                    <input type="checkbox" ref={resolvedRef} {...rest} />
                </>
            )
        }
    )

    IndeterminateCheckbox.displayName = 'IndeterminateCheckbox';


    // Listen for changes in pagination and use the state to fetch our new data
    // React.useEffect(() => {
    //     fetchData({ pageIndex, pageSize })
    // }, [fetchData, pageIndex, pageSize])

    // Render the UI for your table
    return (
        <>
            <table {...getTableProps()} className="w-full mb-20">
                <thead className='bg-med-blue text-med-light-gray text-left'>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())} className="py-5 px-10 text-sm">
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? ' 🔽'
                                                : ' 🔼'
                                            : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()} className="odd:bg-white even:bg-med-gray">
                                {row.cells.map(cell => {
                                    return <td className="text-light-blue px-10 py-5 text-sm"
                                        {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    })}
                    {/* <tr>
                        {loading ? (
                            // Use our custom loading state to show a loading indicator
                            <td colSpan="10000">Loading...</td>
                        ) : (
                            <td colSpan="10000">
                                Showing {page.length} of ~{controlledPageCount * pageSize}{' '}
                                results
                            </td>
                        )}
                    </tr> */}
                </tbody>
            </table>
            {/* 
            Pagination can be built however you'd like. 
            This is just a very basic UI implementation:
          */}
            {/* <div className="pagination mb-20">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>{' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>{' '}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>{' '}
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
                <span>
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
                </select>
            </div> */}
        </>
    )
}

export default Table
