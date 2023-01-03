import { Time } from 'lightweight-charts';
import dynamic from 'next/dynamic';
import React from 'react';
const Chart = dynamic(() => import('components/Chart/Chart'), {
	ssr: false,
});

interface ChartSectionProps {
	data: { time: Time; value: number }[];
	name: string;
}

const ChartSection = ({ data, name }: ChartSectionProps) => {
	return (
		<div>
			<div>
				<p>{name} to USD Chart</p>
			</div>
			<div>
				<div>
					<div>Price</div>
					<div>Market Cap</div>
					<div>Candle Chart</div>
				</div>
				<div>
					<div>1D</div>
					<div>7D</div>
					<div>1M</div>
					<div>3M</div>
					<div>1Y</div>
					<div>YTD</div>
					<div>ALL</div>
				</div>
			</div>
			<Chart data={data} colors={{}} />
		</div>
	);
};

export default ChartSection;
