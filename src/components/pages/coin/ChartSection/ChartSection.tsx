import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { SingleValueData, Time } from 'lightweight-charts';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { MouseEvent, useState } from 'react';
import styled from 'styled-components';
import { Container } from 'styled/elements/Container';
const Chart = dynamic(() => import('components/Chart/Chart'), {
	ssr: false,
});

interface ChartSectionProps {
	name: string;
}

const ChartSection = ({ name }: ChartSectionProps) => {
	const [days, setDays] = useState<number>(1);
	const { query, isReady } = useRouter();
	const [data, setData] = useState<SingleValueData[]>([]);
	useQuery({
		queryKey: ['historical', days],
		queryFn: async () => {
			return (
				await axios.get<{ prices: [number, number][] }>(
					`${process.env.NEXT_PUBLIC_API_URL}/coins/${query.slug}/market_chart`,
					{
						params: {
							vs_currency: 'usd',
							days,
						},
					}
				)
			).data;
		},
		onSuccess: (data) => {
			const initialData = data.prices.map((el) => ({
				time: (el[0] / 1000) as Time,
				value: el[1],
			}));
			setData(initialData);
		},
		enabled: isReady,
	});

	const handleChangeDays = (e: MouseEvent) => {
		const target = e.target as HTMLButtonElement;

		setDays(Number(target.value));
	};

	return (
		<ChartSectionWrapper>
			<Container>
				<Title>{name} to USD Chart</Title>
				<OptionsWrapper>
					<ButtonsWrapper>
						<ChartButton>Price</ChartButton>
						<ChartButton>Market Cap</ChartButton>
						<ChartButton>Candle Chart</ChartButton>
					</ButtonsWrapper>
					<ButtonsWrapper>
						<ChartButton onClick={handleChangeDays} value={1}>
							1D
						</ChartButton>
						<ChartButton onClick={handleChangeDays} value={7}>
							7D
						</ChartButton>
						<ChartButton onClick={handleChangeDays} value={30}>
							1M
						</ChartButton>
						<ChartButton onClick={handleChangeDays} value={90}>
							3M
						</ChartButton>
						<ChartButton onClick={handleChangeDays} value={360}>
							1Y
						</ChartButton>
					</ButtonsWrapper>
				</OptionsWrapper>
			</Container>
			<Chart data={data} colors={{}} />
		</ChartSectionWrapper>
	);
};

export default ChartSection;

const ChartSectionWrapper = styled.div`
	padding-bottom: 32px;
`;

const Title = styled.div`
	font-weight: 600;
	margin-bottom: 24px;
	font-size: 18px;
`;

const OptionsWrapper = styled.div`
	display: flex;
	justify-content: space-between;
`;

const ButtonsWrapper = styled.div`
	display: flex;
	padding: 4px;
	border-radius: 8px;
	background: ${({ theme: { colors } }) => colors.colorLightNeutral2};
`;

const ChartButton = styled.button`
	font-weight: 600;
	font-size: 12px;
	padding: 8px;
	border-radius: 8px;
	color: ${({ theme: { colors } }) => colors.colorLightNeutral6};

	&:hover {
		background: ${({ theme: { colors } }) => colors.bgColor};
	}
`;
