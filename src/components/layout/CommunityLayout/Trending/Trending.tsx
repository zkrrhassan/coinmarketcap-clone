import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
	TrendingWrapper,
	TrendingHeader,
	RefreshButton,
	ItemWrapper,
	CoinInfo,
	CoinNumber,
	CoinName,
} from './Trending.styled';

interface TrendingCoin {
	item: {
		coin_id: number;
		id: string;
		name: string;
		price_btc: number;
		score: number;
		slug: string;
		symbol: string;
		market_cap_rank: number;
	};
}

const Trending = () => {
	const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[]>([]);

	const fetchTrendingCoins = async () => {
		try {
			const res = await axios.get(
				`${process.env.NEXT_PUBLIC_CMC_API_URI}/search/trending`
			);
			setTrendingCoins(res.data.coins);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchTrendingCoins();
	}, []);

	return (
		<TrendingWrapper>
			<TrendingHeader>
				<p>🔥 Trending</p>
				<RefreshButton onClick={fetchTrendingCoins}>Refresh</RefreshButton>
			</TrendingHeader>
			<ul>
				{trendingCoins.map(({ item }, index) => (
					<ItemWrapper key={item.id}>
						<Link href="">
							<CoinInfo>
								<CoinNumber>{index + 1}</CoinNumber>
								<CoinName>{item.name}</CoinName>
								<CoinNumber>{item.market_cap_rank}</CoinNumber>
							</CoinInfo>
						</Link>
					</ItemWrapper>
				))}
			</ul>
		</TrendingWrapper>
	);
};

export default Trending;
