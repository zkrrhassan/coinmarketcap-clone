import React from 'react';
import {
	StatisticWrapper,
	StatisticContent,
	StatisticName,
	StatisticValue,
} from 'components/pages/coin/StatsSection/StatsSection.styled';

interface StatisticProps {
	name: string;
	value: number;
	secondName?: string;
	secondValue?: number;
	dollar?: boolean;
}

const Statistic = ({
	name,
	value,
	dollar,
	secondName,
	secondValue,
}: StatisticProps) => {
	return (
		<StatisticWrapper>
			<StatisticContent>
				<StatisticName>{name}</StatisticName>
				<StatisticValue>
					{dollar && '$'}
					{value}
				</StatisticValue>
			</StatisticContent>
			{secondName && secondValue && (
				<StatisticContent second>
					<StatisticName>{secondName}</StatisticName>
					<StatisticValue>{secondValue}</StatisticValue>
				</StatisticContent>
			)}
		</StatisticWrapper>
	);
};

export default Statistic;
