import Table, { TableColumn } from 'components/Table/Table';
import Image from 'next/image';
import Link from 'next/link';
import { Exchange } from 'pages/exchanges';
import { formatLargeValue } from 'utils/formatValues';
import { NameWrapper } from './ExchangesTable.styled';

interface ExchangesTableProps {
	exchanges: Exchange[];
}

const ExchangesTable = ({ exchanges }: ExchangesTableProps) => {
	const columns: TableColumn<Exchange>[] = [
		{
			header: '#',
			accessorKey: 'trust_score_rank',
			size: 50,
			textAlign: 'start',
		},
		{
			header: 'Name',
			accessorKey: 'name',
			cell: ({ row }) => (
				<Link href={`/exchanges/${row.original.id}`}>
					<a>
						<NameWrapper>
							<Image src={row.original.image} alt="" width={24} height={24} />
							<p>{row.original.name}</p>
						</NameWrapper>
					</a>
				</Link>
			),
			size: 225,
			textAlign: 'start',
		},
		{
			header: 'Trust Score',
			accessorKey: 'trust_score',
			size: 100,
		},
		{
			header: 'Total Volume',
			accessorKey: 'trade_volume_24h_btc',
			cell: ({ getValue }) => formatLargeValue(getValue<number>()),
			size: 100,
		},
		{
			header: 'Total Volume (Normalized)',
			accessorKey: 'trade_volume_24h_btc_normalized',
			cell: ({ getValue }) => formatLargeValue(getValue<number>()),
			size: 200,
		},
		{
			header: 'Year',
			accessorKey: 'year_established',
		},
		{
			header: 'Country',
			accessorKey: 'country',
		},
		{
			id: 'placeholder',
			size: 'auto' as unknown as number,
		},
	];

	return <Table columns={columns} data={exchanges} />;
};

export default ExchangesTable;
