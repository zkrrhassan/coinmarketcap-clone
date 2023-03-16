import React from 'react';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import LinksSectionMobile from 'components/pages/coin/LinksSectionMobile/LinksSectionMobile';
import CoinData from 'components/pages/coin/CoinData/CoinData';
import ChartSection from 'components/pages/coin/ChartSection/ChartSection';
import { Time } from 'lightweight-charts';
import SEO from 'components/SEO/SEO';
import { capitalize } from 'lodash';

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
		return axios.get(`${process.env.API_URL}/coins/${query.slug}`);
	};

	const result = await Promise.all([getCoinInfo()]);

	return {
		props: {
			info: result[0].data,
		},
	};
};

const Coin = ({ info }: CoinProps) => {
	return (
		<>
			<SEO
				title={`${capitalize(
					info.name
				)} price today, BTC to USD live, marketcap and chart | CoinMarketCap`}
				description={`Get the latest ${capitalize(
					info.name
				)} price, BTC market cap, trading pairs, charts and data today from the world’s number one cryptocurrency price-tracking website`}
			/>
			{info && (
				<>
					<CoinData info={info} />
					<LinksSectionMobile links={info.links} name={info.name} />
					<ChartSection name={info.name} />
				</>
			)}
		</>
	);
};

export default Coin;
