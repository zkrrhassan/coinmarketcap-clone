import axios from 'axios';
import React from 'react';
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
import { useQuery } from '@tanstack/react-query';

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
	const {
		data: trending,
		refetch,
		isLoading,
	} = useQuery({
		queryKey: ['trending'],
		queryFn: async () =>
			(
				await axios.get<{ coins: TrendingCoin[] }>(
					`${process.env.NEXT_PUBLIC_API_URL}/search/trending`
				)
			).data.coins,
	});

	return (
		<TrendingWrapper>
			<TrendingHeader>
				<p>🔥 Trending</p>
				<RefreshButton onClick={() => refetch()}>Refresh</RefreshButton>
			</TrendingHeader>
			{isLoading && <div>Loading</div>}
			{trending && (
				<ul>
					{trending.map(({ item }, index) => (
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
			)}
		</TrendingWrapper>
	);
};

export default Trending;
