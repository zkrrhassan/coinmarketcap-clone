import axios from 'axios';
import Table, { TableColumn } from 'components/Table/Table';
import { ColumnDef } from '@tanstack/react-table';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import * as S from './HomeTable.styled';
import Link from 'next/link';
import Image from 'next/image';
import PercentageChange from 'components/PercentageChange/PercentageChange';
import AddToWatchlist from 'components/AddToWatchlist/AddToWatchlist';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Watchlist } from '@prisma/client';
import { startsWithHttp } from 'utils/formatLink';
import { CoinData } from 'pages';
import { formatLargeValue, formatPrice } from 'utils/formatValues';
import { useTheme } from 'styled-components';

export interface CoinOnWatchlist extends CoinData {
	isOnWatchlist: boolean;
}

interface HomeTableProps {
	initialCoins: CoinData[];
}

const HomeTable = ({ initialCoins }: HomeTableProps) => {
	const [coins, setCoins] =
		useState<(CoinOnWatchlist | CoinData)[]>(initialCoins);
	const { status, data } = useSession();
	const {
		colors: { upColor, downColor },
	} = useTheme();

	const processCoinsData = (watchlist: Watchlist) => {
		return initialCoins.map((coin) => {
			return {
				...coin,
				isOnWatchlist: watchlist?.coinIds.includes(coin.id) ?? false,
			};
		});
	};

	const fetchWatchlist = async () => {
		//reset coins if not logged in
		if (status !== 'authenticated') {
			setCoins(initialCoins);
			return;
		}
		//getting main watchlist
		const watchlist = (
			await axios.get('/api/watchlist/get', {
				params: {
					userId: data.user?.id,
					isMain: true,
				},
			})
		).data;
		//updating coins status
		setCoins(processCoinsData(watchlist));
	};

	useEffect(() => {
		//fetch coins on status change (logged in/out)
		fetchWatchlist();
	}, [status]);

	const columns: TableColumn<CoinOnWatchlist | CoinData>[] = [
		{
			id: 'add-to-watchlist',
			header: '',
			cell: ({ row }) => {
				if ('isOnWatchlist' in row.original) {
					return (
						<AddToWatchlist
							coinId={row.original.id}
							watchlistCallback={fetchWatchlist}
							isOnWatchlist={row.original.isOnWatchlist}
						/>
					);
				} else {
					return (
						<AddToWatchlist
							coinId={row.original.id}
							watchlistCallback={fetchWatchlist}
						/>
					);
				}
			},
			size: 'auto' as unknown as number,
		},
		{
			header: '#',
			accessorKey: 'market_cap_rank',
			size: 50,
			textAlign: 'start',
		},
		{
			header: 'Name',
			accessorKey: 'name',
			cell: ({ row, getValue }) => (
				<S.LinkWrapper>
					<Link href={`/coins/${row.original.id}`} passHref>
						<S.NameWrapper>
							{startsWithHttp(row.original.image) ? (
								<Image src={row.original.image} alt="" width={24} height={24} />
							) : (
								<div
									style={{
										width: '24px',
										height: '24px',
										background: '#8f8e8e',
										textAlign: 'center',
										color: '#fff',
									}}
								>
									?
								</div>
							)}
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<S.CoinName>{getValue<string>()}</S.CoinName>
								<S.CoinSymbol>{row.original.symbol}</S.CoinSymbol>
							</div>
						</S.NameWrapper>
					</Link>
				</S.LinkWrapper>
			),
			size: 225,
			textAlign: 'start',
		},
		{
			header: 'Price',
			accessorKey: 'current_price',
			size: 100,
			cell: ({ getValue }) => <div>${formatPrice(getValue<number>())}</div>,
		},

		{
			header: '1h%',
			accessorKey: 'price_change_percentage_1h_in_currency',
			cell: ({ getValue }) => <PercentageChange value={getValue<number>()} />,
			size: 85,
		},

		{
			header: '24h%',
			accessorKey: 'price_change_percentage_24h_in_currency',
			cell: ({ getValue }) => <PercentageChange value={getValue<number>()} />,
			size: 85,
		},

		{
			header: '7d%',
			accessorKey: 'price_change_percentage_7d_in_currency',
			cell: ({ getValue }) => <PercentageChange value={getValue<number>()} />,
			size: 85,
		},
		{
			header: 'Market Cap',
			accessorKey: 'market_cap',
			size: 150,
			cell: ({ getValue }) => (
				<div>${formatLargeValue(getValue<number>())}</div>
			),
		},
		{
			header: 'Volume (24h)',
			accessorKey: 'total_volume',
			size: 150,
			cell: ({ getValue }) => (
				<div>${formatLargeValue(getValue<number>())}</div>
			),
		},
		{
			header: 'Circulating Supply',
			accessorKey: 'circulating_supply',
			cell: ({ row, getValue }) => (
				<div>
					<span>{formatLargeValue(getValue<number>())}</span>{' '}
					<span style={{ textTransform: 'uppercase' }}>
						{row.original.symbol}
					</span>
				</div>
			),
			size: 150,
		},
		{
			header: 'Last 7 days',
			accessorFn: (row) => row.sparkline_in_7d.price,
			cell: ({ row, getValue }) => (
				<Sparklines data={getValue<number[]>()} width={164} height={53}>
					<SparklinesLine
						color={
							Number(
								row.original.price_change_percentage_7d_in_currency
									? row.original.price_change_percentage_7d_in_currency.toFixed(
											2
									  )
									: 0
							) > 0
								? upColor
								: downColor
						}
						style={{ fill: 'none', strokeWidth: '2px' }}
					/>
				</Sparklines>
			),
			minSize: 184,
		},
	];

	return coins && <Table columns={columns} data={coins} />;
};

export default HomeTable;
