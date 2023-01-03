import axios from 'axios';
import ExchangeInfo from 'components/pages/exchanges/ExchangeInfo/ExchangeInfo';
import Table, { TableColumn } from 'components/Table/Table';
import { GetServerSideProps } from 'next';
import React from 'react';
import { NextPage } from 'next/types';
import { ExchangeInfoProps } from 'components/pages/exchanges/ExchangeInfo/ExchangeInfo';
import { ColumnDef } from '@tanstack/react-table';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const res = await axios.get(
		`${process.env.CMC_API_URI}/exchanges/${query.slug}`
	);

	return {
		props: {
			data: res.data,
		},
	};
};

interface ExchangeTicker {
	base: string;
	target: string;
	last: number;
	volume: number;
}

interface ExchangeProps {
	data: ExchangeInfoProps & {
		tickers: ExchangeTicker[];
	};
}

const Exchange: NextPage<ExchangeProps> = ({ data }) => {
	const columns: TableColumn<ExchangeTicker>[] = [
		{
			header: '#',
			id: 'index',
			cell: ({ row: { index } }) => <>{index + 1}</>,
			size: 50,
			textAlign: 'start',
		},
		{
			header: 'Currency',
			accessorKey: 'base',
			size: 100,
		},
		{
			header: 'Pair',
			cell: ({ row }) => (
				<>
					{row.original.base} / {row.original.target}
				</>
			),
			size: 200,
		},
		{
			header: 'Price',
			accessorKey: 'last',
			size: 200,
		},
		{
			header: 'Volume',
			accessorKey: 'volume',
			size: 225,
		},
		{
			id: 'placeholder',
			header: '',
			// prevents default column size (150px)
			size: 'auto' as unknown as number,
		},
	];

	return (
		<>
			<ExchangeInfo {...data} />
			<Table columns={columns} data={data.tickers} />
		</>
	);
};

export default Exchange;
