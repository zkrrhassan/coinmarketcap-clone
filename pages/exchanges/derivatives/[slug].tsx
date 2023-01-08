import axios from 'axios';
import ExchangeInfo, {
	ExchangeInfoProps,
} from 'components/pages/exchanges/ExchangeInfo/ExchangeInfo';
import Table, { TableColumn } from 'components/Table/Table';
import { GetServerSideProps } from 'next';
import React from 'react';
import { NextPage } from 'next/types';
import { ColumnDef } from '@tanstack/react-table';
import { formatLargeValue, formatPrice } from 'utils/formatValues';
import PercentageChange from 'components/PercentageChange/PercentageChange';
import SEO from 'components/SEO/SEO';
import { capitalize } from 'lodash';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const res = await axios.get(
		`${process.env.CMC_API_URI}/derivatives/exchanges/${query.slug}`,
		{
			params: {
				include_tickers: 'unexpired',
			},
		}
	);

	return {
		props: {
			data: res.data,
			derivative: query.slug,
		},
	};
};

interface DerivativeTicker {
	base: number;
	target: number;
	last: number;
	h24_volume: number;
	h24_percentage_change: number;
	open_interest_usd: number;
	contract_type: number;
	bid_ask_spread: number;
}

interface DerivativeProps {
	data: ExchangeInfoProps & {
		tickers: DerivativeTicker[];
	};
	derivative: string;
}

const Derivative: NextPage<DerivativeProps> = ({ data, derivative }) => {
	const columns: TableColumn<DerivativeTicker>[] = [
		{
			id: 'rank',
			header: '#',
			cell: ({ row: { index } }) => <>{index + 1}</>,
			size: 50,
			textAlign: 'start',
		},
		{
			header: 'Symbol',
			accessorKey: 'base',
			size: 100,
			textAlign: 'start',
		},
		{
			header: 'Pair',
			cell: ({
				row: {
					original: { base, target },
				},
			}) => (
				<>
					{base} / {target}
				</>
			),
		},
		{
			header: 'Price',
			accessorKey: 'last',
			cell: ({ getValue }) => <>${formatPrice(getValue<number>())}</>,
		},
		{
			header: 'Volume 24h',
			accessorKey: 'h24_volume',
			cell: ({ getValue }) => <>{formatLargeValue(getValue<number>())}</>,
		},
		{
			header: 'Volume % 24h',
			accessorKey: 'h24_percentage_change',
			cell: ({ getValue }) => <PercentageChange value={getValue<number>()} />,
		},
		{
			header: 'Open Interest',
			accessorKey: 'open_interest_usd',
			cell: ({ getValue }) => <>{formatLargeValue(getValue<number>())}</>,
		},
		{
			header: 'Spread',
			accessorKey: 'bid_ask_spread',
			cell: ({ getValue }) => <>{formatPrice(getValue<number>())}</>,
		},
		{
			header: 'Contract Type',
			accessorKey: 'contract_type',
		},
		{
			id: 'placeholder',
			size: 'auto' as unknown as number,
		},
	];

	return (
		<>
			<SEO
				title={`${capitalize(
					derivative
				)} trade volume and market listings | CoinMarketCap`}
				description={`${capitalize(
					derivative
				)} trade volume and market listings`}
			/>
			<ExchangeInfo {...data} />
			<Table columns={columns} data={data.tickers} />
		</>
	);
};

export default Derivative;
