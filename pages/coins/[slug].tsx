import React from 'react';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import LinksSectionMobile from 'components/pages/coin/LinksSectionMobile/LinksSectionMobile';
import CoinData from 'components/pages/coin/CoinData/CoinData';
import ChartSection from 'components/pages/coin/ChartSection/ChartSection';
import { Time } from 'lightweight-charts';

export interface CoinLinks {
	homepage: string[];
	repos_url: {
		github: string[];
	};
	blockchain_site: string[];
	official_forum_url: string[];
	subreddit_url: string;
}

export interface MarketData {
	current_price: {
		usd: number;
		btc: number;
		eth: number;
	};
	price_change_percentage_24h_in_currency: {
		btc: number;
		eth: number;
	};
	price_change_percentage_24h: number;
	low_24h: {
		usd: number;
	};
	high_24h: {
		usd: number;
	};
	market_cap: {
		usd: number;
	};
	fully_diluted_valuation: {
		usd: number;
	};
	total_volume: {
		usd: number;
	};
	circulating_supply: number;
}

export interface CoinInfo {
	links: CoinLinks;
	name: string;
	image: {
		small: string;
	};
	symbol: string;
	market_cap_rank: number;
	market_data: MarketData;
}

interface CoinProps {
	info: CoinInfo;
	historical: {
		prices: [number, number][];
	};
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const getCoinInfo = () => {
		return axios.get(`${process.env.CMC_API_URI}/coins/${query.slug}`);
	};
	const getCoinHistory = () => {
		return axios.get(
			`${process.env.CMC_API_URI}/coins/${query.slug}/market_chart`,
			{
				params: {
					vs_currency: 'usd',
					days: '1',
				},
			}
		);
	};

	const result = await Promise.all([getCoinInfo(), getCoinHistory()]);

	return {
		props: {
			info: result[0].data,
			historical: result[1].data,
		},
	};
};

const Coin = ({ info, historical }: CoinProps) => {
	const initialData = historical.prices.map((el) => ({
		time: (el[0] / 1000) as Time,
		value: el[1],
	}));

	return (
		info && (
			<>
				<CoinData info={info} />
				<LinksSectionMobile links={info.links} name={info.name} />
				<ChartSection data={initialData} name={info.name} />
			</>
		)
	);
};

export default Coin;
