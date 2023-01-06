import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import SEO from 'components/SEO/SEO';
import Table, { TableColumn } from 'components/Table/Table';
import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const res = await axios.get(`${process.env.CMC_API_URI}/nfts/list`, {
		params: {
			order: 'market_cap_usd_desc',
			per_page: 10,
			page: query.page ?? 1,
		},
	});

	return {
		props: {
			nfts: res.data,
		},
	};
};

export interface NFTData {
	id: number;
	name: string;
	symbol: string;
	index: number;
}

interface NftProps {
	nfts: NFTData[];
}

const Nft: NextPage<NftProps> = ({ nfts }) => {
	const columns: TableColumn<NFTData>[] = [
		{
			header: 'Name',
			accessorKey: 'name',
			cell: ({ row }) => (
				<Link href={`/nft/${row.original.id}`}>
					<a>
						<div style={{ display: 'flex', gap: '10px' }}>
							<p>{row.original.name}</p>
							<p>{row.original.symbol}</p>
						</div>
					</a>
				</Link>
			),
			textAlign: 'start',
		},
	];
	return (
		<>
			<SEO />
			<Table columns={columns} data={nfts} />
		</>
	);
};

export default Nft;
