import React, { useRef } from 'react';
import { MarketData } from 'pages/coins/[slug]';
import Statistic from 'components/pages/coin/StatsSection/Statistic';
import {
	StatsSectionWrapper,
	StatisticsWrapper,
	StatisticsButton,
} from 'components/pages/coin/StatsSection/StatsSection.styled';

interface StatsSectionProps {
	marketData: MarketData;
}

const StatsSection = ({ marketData }: StatsSectionProps) => {
	const statsWrapper = useRef<HTMLDivElement>(null);

	const toggleShowStatistics = () => {
		const { current } = statsWrapper;
		if (!current) return;

		if (current.style.height) {
			current.style.height = '';
		} else {
			current.style.height = `${current.scrollHeight}px`;
		}
	};

	return (
		<StatsSectionWrapper>
			<StatisticsWrapper ref={statsWrapper}>
				<Statistic name="Market Cap" value={marketData.market_cap.usd} dollar />
				<Statistic
					name="Fully Diluted Market Cap"
					value={marketData.fully_diluted_valuation.usd}
					dollar
				/>
				<Statistic
					name="Total Volume"
					value={marketData.total_volume.usd}
					secondName="Total Volume / Market Cap"
					secondValue={marketData.total_volume.usd / marketData.market_cap.usd}
					dollar
				/>
				<Statistic
					name="Circulating Supply"
					value={marketData.circulating_supply}
				/>
			</StatisticsWrapper>
			<StatisticsButton onClick={toggleShowStatistics}>
				More stats
			</StatisticsButton>
		</StatsSectionWrapper>
	);
};

export default StatsSection;
