import React, { useEffect, useState } from 'react';
import { Container } from 'styled/elements/Container';
import { useSession } from 'next-auth/react';
import { CoinData } from 'pages';
import axios from 'axios';
import { Watchlist } from '@prisma/client';
import WatchlistList from 'components/pages/watchlist/WatchlistList/WatchlistList';
import WatchlistTable from 'components/pages/watchlist/WatchlistTable/WatchlistTable';

const Watchlist = () => {
	const { data, status } = useSession();
	const [userWatchlists, setUserWatchlists] = useState<Watchlist[]>([]);
	const [currentWatchlist, setCurrentWatchlist] = useState<Watchlist | null>(
		null
	);
	const [coins, setCoins] = useState<CoinData[]>([]);

	const changeCurrentWatchlist = async (watchlistName: string) => {
		const watchlist = (
			await axios.get('/api/watchlist/get', {
				params: {
					userId: data?.user.id,
					name: watchlistName,
				},
			})
		).data;

		setCurrentWatchlist(watchlist);
	};

	const getWatchlists = async () => {
		//Get all user's watchlists
		const watchlists = (
			await axios.get('/api/watchlist/getAll', {
				params: {
					userId: data?.user.id,
				},
			})
		).data as Watchlist[];

		setUserWatchlists(watchlists);

		const mainWatchlist = watchlists.find(
			(watchlist) => watchlist.isMain === true
		);

		setCurrentWatchlist(mainWatchlist!);
	};

	const getCoinsOnWatchlist = async () => {
		if (!currentWatchlist) {
			return;
		}

		if (currentWatchlist?.coinIds.length === 0) {
			setCoins([]);
			return;
		}

		const filteredCoins = (
			await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
				params: {
					vs_currency: 'usd',
					ids: currentWatchlist.coinIds.join(','),
					order: 'market_cap_desc',
					per_page: 100,
					sparkline: 'true',
					price_change_percentage: '1h,24h,7d',
				},
			})
		).data;

		setCoins(filteredCoins);
	};

	const refetchWatchlist = async () => {
		if (!currentWatchlist) {
			return;
		}

		const data = (
			await axios.get('/api/watchlist/get', {
				params: {
					watchlistId: currentWatchlist.id,
				},
			})
		).data;

		setCurrentWatchlist(data);
	};

	useEffect(() => {
		getWatchlists();
	}, []);

	useEffect(() => {
		getCoinsOnWatchlist();
	}, [currentWatchlist]);

	return (
		<Container>
			{status !== 'authenticated' ? (
				<>
					<p>Sign up today and get</p>
					<p>your own crypto Watchlist</p>
				</>
			) : (
				<>
					{currentWatchlist && (
						<WatchlistList
							currentWatchlist={currentWatchlist}
							watchlists={userWatchlists}
							changeWatchlistCallback={changeCurrentWatchlist}
							getWatchlists={getWatchlists}
						/>
					)}
					{coins && (
						<WatchlistTable
							coins={coins}
							watchlistCallback={refetchWatchlist}
						/>
					)}
				</>
			)}
		</Container>
	);
};

export default Watchlist;
