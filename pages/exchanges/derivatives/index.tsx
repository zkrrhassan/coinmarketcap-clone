import axios from 'axios';
import SectionHeader from 'components/SectionHeader/SectionHeader';
import SEO from 'components/SEO/SEO';
import Table, { TableColumn } from 'components/Table/Table';
import type { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { formatLargeValue } from 'utils/formatValues';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const res = await axios.get(
		`${process.env.CMC_API_URI}/derivatives/exchanges`,
		{
			params: {
				per_page: 100,
				page: query.page ?? 1,
				order: 'trade_volume_24h_btc_desc',
			},
		}
	);

	return {
		props: {
			derivatives: res.data,
			page: Number(query.page) || 1,
		},
	};
};

export interface Derivative {
	index: number;
	name: string;
	image: string;
	open_interest_btc: number;
	trade_volume_24h_btc: number;
	number_of_perpetual_pairs: number;
	number_of_futures_pairs: number;
	year_established: number;
	country: string;
	id: number;
}

const Derivatives: NextPage<{ derivatives: Derivative[]; page: number }> = ({
	derivatives,
	page,
}) => {
	const columns: TableColumn<Derivative>[] = [
		{
			id: 'rank',
			header: '#',
			cell: ({ row: { index } }) => <>{(page - 1) * 100 + (index + 1)}</>,
			size: 50,
			textAlign: 'start',
		},
		{
			header: 'Name',
			accessorKey: 'name',
			cell: ({
				getValue,
				row: {
					original: { id, image },
				},
			}) => (
				<Link href={`/exchanges/derivatives/${id}`}>
					<a>
						<div style={{ display: 'flex', gap: '10px' }}>
							<Image src={image} alt="" width={24} height={24} />
							<p>{getValue<string>()}</p>
						</div>
					</a>
				</Link>
			),
			size: 200,
			textAlign: 'start',
		},
		{
			header: '24H Open Interest',
			accessorKey: 'open_interest_btc',
			cell: ({ getValue }) => <>${formatLargeValue(getValue<number>())}</>,
			size: 150,
		},
		{
			header: '24h Volume',
			accessorKey: 'trade_volume_24h_btc',
			cell: ({ getValue }) => <>${formatLargeValue(getValue<number>())}</>,
			size: 150,
		},
		{
			header: 'Perpetuals',
			accessorKey: 'number_of_perpetual_pairs',
			size: 100,
		},
		{
			header: 'Futures',
			accessorKey: 'number_of_futures_pairs',
			size: 100,
		},
		{
			header: 'Year',
			accessorKey: 'year_established',
			size: 100,
		},
		{
			header: 'Country',
			accessorKey: 'country',
			size: 150,
			cell: ({
				row: {
					original: { country },
				},
			}) => <div style={{ whiteSpace: 'initial' }}>{country}</div>,
		},
		{
			id: 'placeholder',
			header: '',
			size: 'auto' as unknown as number,
		},
	];

	return (
		<>
			<SEO
				title="Top Cryptocurrency Derivatives Exchanges Ranked | CoinMarketCap"
				description="See our list of cryptocurrency derivatives exchanges ✔️ Ranked by volume ✔️ Binance ✔️ Bybit ✔️ Bitmex ✔️ Kraken ✔️ And many more ✔️"
			/>
			<SectionHeader
				title="Top Cryptocurrency Derivatives Exchanges"
				description="CoinMarketCap ranks the top cryptocurrency derivatives exchanges using an algorithm based on multiple factors including liquidity and normalized volume."
			/>
			<Table columns={columns} data={derivatives} />
		</>
	);
};

export default Derivatives;
