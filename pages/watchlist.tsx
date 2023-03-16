import React, { useState } from 'react';
import { Container } from 'styled/elements/Container';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Watchlist } from '@prisma/client';
import WatchlistList from 'components/pages/watchlist/WatchlistList/WatchlistList';
import WatchlistTable from 'components/pages/watchlist/WatchlistTable/WatchlistTable';
import { useQuery } from '@tanstack/react-query';

const Watchlist = () => {
	const { data: session } = useSession();
	const userId = session?.user.id;
	const [currentWatchlist, setCurrentWatchlist] = useState<Watchlist | null>(
		null
	);
	const [coins, setCoins] = useState([]);
	// WATCHLISTS QUERY
	const { data: watchlists } = useQuery({
		queryKey: ['watchlists', userId],
		queryFn: async () =>
			(
				await axios.get<Watchlist[]>('/api/watchlist/getAll', {
					params: {
						userId: userId,
					},
				})
			).data,
		onSuccess(data) {
			const mainWatchlist = data.find((watchlist) => watchlist.isMain === true);
			setCurrentWatchlist(mainWatchlist!);
		},
		enabled: !!userId,
		refetchOnWindowFocus: false,
	});
	// COINS ON WATCHLIST QUERY
	const _ = useQuery({
		queryKey: ['coins', currentWatchlist],
		queryFn: async () => {
			if (currentWatchlist?.coinIds.length === 0) return null;

			return (
				await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
					params: {
						vs_currency: 'usd',
						ids: currentWatchlist?.coinIds.join(','),
						order: 'market_cap_desc',
						per_page: 100,
						sparkline: 'true',
						price_change_percentage: '1h,24h,7d',
					},
				})
			).data;
		},
		onSuccess: (data) => setCoins(data),
		enabled: !!currentWatchlist,
		refetchOnWindowFocus: false,
	});
	// UPDATE CURRENT WATCHLIST (after coin remove)
	const { refetch } = useQuery({
		queryKey: ['getWatchlist'],
		queryFn: async () =>
			(
				await axios.get<Watchlist>('api/watchlist/get', {
					params: {
						watchlistId: currentWatchlist!.id,
					},
				})
			).data,
		onSuccess: (data) => setCurrentWatchlist(data),
		refetchOnWindowFocus: false,
		enabled: false,
	});

	const changeCurrentWatchlist = (name: string) => {
		if (!watchlists) return;
		const newWatchlist = watchlists.find(
			(watchlist) => watchlist.name === name
		);
		if (newWatchlist) {
			setCurrentWatchlist(newWatchlist);
		}
	};

	return (
		<Container>
			{!session ? (
				<>
					<p>Sign up today and get</p>
					<p>your own crypto Watchlist</p>
				</>
			) : (
				<>
					{watchlists && currentWatchlist && (
						<WatchlistList
							currentWatchlist={currentWatchlist}
							watchlists={watchlists}
							changeWatchlistCallback={changeCurrentWatchlist}
						/>
					)}
					{coins && (
						<WatchlistTable coins={coins} watchlistCallback={refetch} />
					)}
				</>
			)}
		</Container>
	);
};

export default Watchlist;
