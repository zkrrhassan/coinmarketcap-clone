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
	const { data: global } = useQuery({
		queryKey: ['global'],
		queryFn: async () => (await axios.get<CoinsGlobal>('/api/global')).data,
	});

	return (
		global && (
			<GlobalStatisticsContainer>
				<GlobalStatistic
					name="Cryptos"
					value={formatLargeValue(global.active_cryptocurrencies)}
				/>
				<GlobalStatistic name="Exchanges" value={global.markets} />
				<GlobalStatistic
					name="Market Cap"
					value={`$${formatLargeValue(global.total_market_cap.usd)}`}
				/>
				<GlobalStatistic
					name="24h Vol"
					value={`$${formatLargeValue(global.total_volume.usd)}`}
				/>
				<GlobalStatistic
					name="Dominance"
					value={`BTC: ${formatPercentageValue(
						global.market_cap_percentage.btc,
						1
					)}% ETH: ${formatPercentageValue(
						global.market_cap_percentage.eth,
						1
					)}%`}
				/>
			</GlobalStatisticsContainer>
		)
	);
};

export default GlobalStatistics;
