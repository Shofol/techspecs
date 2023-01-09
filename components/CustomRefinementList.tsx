import React from 'react';
import {
    useRefinementList,
    UseRefinementListProps,
} from 'react-instantsearch-hooks-web';
import { Column } from 'react-table';
import Table from './Table';

export function CustomRefinementList(props: UseRefinementListProps) {
    const [loading, setLoading] = React.useState(false);

    const { items, refine, toggleShowMore } = useRefinementList(props);

    const data = items.map((item) => ({
        ...item,
        name: item.value.toUpperCase(),
        amount: item.count
    }));


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


    return <>
        <Table
            columns={columns}
            data={data}
            loading={loading}
        />
        <button onClick={() => toggleShowMore()}>Show More</button>
    </>;
}
