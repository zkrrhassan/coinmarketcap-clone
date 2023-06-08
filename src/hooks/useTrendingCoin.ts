import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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

const fetchTrendingCoins = () =>
	axios.get<{ coins: TrendingCoin[] }>(
		`${process.env.NEXT_PUBLIC_API_URL}/search/trending`
	);

const useTrendingCoins = () => {
	return useQuery({
		queryKey: ['trending'],
		queryFn: async () => (await fetchTrendingCoins()).data.coins,
	});
};

export default useTrendingCoins;
