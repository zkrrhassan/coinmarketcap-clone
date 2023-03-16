import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import Pagination from 'components/Pagination/Pagination';
import SEO from 'components/SEO/SEO';
import Table, { TableColumn } from 'components/Table/Table';
import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const coins = await axios.get(`${process.env.API_URL}/nfts/list`, {
		params: {
			page: query.page ?? 1,
			perPage: 100,
			order: 'market_cap_usd_desc',
		},
	});

	return {
		props: {
			nfts: coins.data,
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
		{
			id: 'placeholder',
			size: 'auto' as unknown as number,
		},
	];

	return (
		<>
			<SEO />
			<Table columns={columns} data={nfts} />
			<Pagination totalItems={2100} itemsPerPage={100} uri="/nft/collections" />
		</>
	);
};

export default Nft;
