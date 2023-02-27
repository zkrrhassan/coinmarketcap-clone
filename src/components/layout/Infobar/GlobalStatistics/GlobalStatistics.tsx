import axios from 'axios';
import React from 'react';
import { formatLargeValue, formatPercentageValue } from 'utils/formatValues';
import GlobalStatistic from 'components/layout/Infobar/GlobalStatistics/GlobalStatistic';
import { GlobalStatisticsContainer } from 'components/layout/Infobar/GlobalStatistics/GlobalStatistics.styled';
import { useQuery } from '@tanstack/react-query';

interface CoinsGlobal {
	active_cryptocurrencies: number;
	markets: number;
	total_market_cap: {
		[key: string]: number;
	};
	total_volume: {
		[key: string]: number;
	};
	market_cap_percentage: {
		[key: string]: number;
	};
}

const GlobalStatistics = () => {
	const {
		data: global,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['global'],
		queryFn: async () => (await axios.get<CoinsGlobal>('/api/global')).data,
	});

	if (isLoading) return <GlobalStatisticsContainer />;

	if (isError) return <GlobalStatisticsContainer />;

	const {
		active_cryptocurrencies,
		market_cap_percentage,
		markets,
		total_market_cap,
		total_volume,
	} = global;

	return (
		<GlobalStatisticsContainer>
			<GlobalStatistic
				name="Cryptos"
				value={formatLargeValue(active_cryptocurrencies)}
			/>
			<GlobalStatistic name="Exchanges" value={markets} />
			<GlobalStatistic
				name="Market Cap"
				value={`$${formatLargeValue(total_market_cap.usd)}`}
			/>
			<GlobalStatistic
				name="24h Vol"
				value={`$${formatLargeValue(total_volume.usd)}`}
			/>
			<GlobalStatistic
				name="Dominance"
				value={`BTC: ${formatPercentageValue(
					market_cap_percentage.btc,
					1
				)}% ETH: ${formatPercentageValue(market_cap_percentage.eth, 1)}%`}
			/>
		</GlobalStatisticsContainer>
	);
};

export default GlobalStatistics;
