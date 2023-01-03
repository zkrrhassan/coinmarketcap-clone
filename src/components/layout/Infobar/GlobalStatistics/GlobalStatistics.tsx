import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { formatLargeValue, formatPercentageValue } from 'utils/formatValues';
import GlobalStatistic from 'components/layout/Infobar/GlobalStatistics/GlobalStatistic';
import { GlobalStatisticsContainer } from 'components/layout/Infobar/GlobalStatistics/GlobalStatistics.styled';

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
	const [global, setGlobal] = useState<CoinsGlobal | null>(null);

	useEffect(() => {
		const fetchInfo = async () => {
			try {
				const data = (await axios.get('/api/global')).data;
				setGlobal(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchInfo();
	}, []);

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
