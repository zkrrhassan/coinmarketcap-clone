import PercentageChange from 'components/PercentageChange/PercentageChange';
import SectionHeader from 'components/SectionHeader/SectionHeader';
import Table, { TableColumn } from 'components/Table/Table';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from 'pages/categories';
import React from 'react';
import { formatLargeValue } from 'utils/formatValues';
import { TopCoinsWrapper } from './CategoriesTable.styled';

interface CategoriesTableProps {
	categories: Category[];
}

const CategoriesTable = ({ categories }: CategoriesTableProps) => {
	const columns: TableColumn<Category>[] = [
		{
			id: 'rank',
			header: '#',
			cell: ({ row: { index } }) => <>{index + 1}</>,
			size: 50,
			textAlign: 'start',
		},
		{
			header: 'Name',
			accessorKey: 'name',
			cell: ({ row }) => (
				<Link href={`/categories/${row.original.id}`}>{row.original.name}</Link>
			),
			size: 200,
			textAlign: 'start',
		},
		{
			header: 'Top Coins',
			accessorKey: 'top_3_coins',
			cell: ({ row }) => (
				<TopCoinsWrapper>
					{row.original.top_3_coins.map((coin, index) => (
						<Image key={index} src={coin} alt="" width={24} height={24} />
					))}
				</TopCoinsWrapper>
			),
		},
		{
			header: '24h',
			cell: ({ row }) => (
				<PercentageChange value={row.original.market_cap_change_24h} />
			),
			size: 120,
		},
		{
			header: 'Market Cap',
			accessorKey: 'market_cap',
			cell: ({ getValue }) => <>${formatLargeValue(getValue<number>())}</>,
			size: 250,
		},
		{
			header: 'Volume',
			accessorKey: 'volume_24h',
			cell: ({ getValue }) => <>${formatLargeValue(getValue<number>())}</>,
			size: 250,
		},
		{
			id: 'placeholder',
			size: 'auto' as unknown as number,
		},
	];

	return (
		<>
			<SectionHeader
				title="Cryptocurrency Sectors by 24h Price Change"
				description="We have created an index for each cryptocurrency category. Categories are ranked by 24h price change. Click on a crypto category name to see the constituent parts of the index and their recent price performance."
			/>
			<Table columns={columns} data={categories} />
		</>
	);
};

export default CategoriesTable;
