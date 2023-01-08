import type { NextPage } from 'next';
import Pagination from 'components/Pagination/Pagination';
import SectionHeader from 'components/SectionHeader/SectionHeader';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import HomeTable from 'components/pages/home/HomeTable/HomeTable';
import SEO from 'components/SEO/SEO';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const coins = await axios.get(`${process.env.CMC_API_URI}/coins/markets`, {
		params: {
			vs_currency: 'usd',
			order: 'market_cap_desc',
			per_page: 100,
			sparkline: true,
			page: query.page ?? 1,
			price_change_percentage: '1h,24h,7d',
		},
	});

	const list = await axios.get(`${process.env.CMC_API_URI}/coins/list`);

	return {
		props: {
			initialCoins: coins.data,
			totalCoins: list.data.length,
		},
	};
};

export interface CoinData {
	market_cap_rank: number;
	id: string;
	name: string;
	circulating_supply: number;
	symbol: string;
	image: string;
	market_cap: number;
	price_change_percentage_1h_in_currency: number;
	price_change_percentage_24h_in_currency: number;
	price_change_percentage_7d_in_currency: number;
	current_price: number;
	total_volume: number;
	sparkline_in_7d: {
		price: number[];
	};
}

const Home: NextPage<{ initialCoins: CoinData[]; totalCoins: number }> = ({
	initialCoins,
	totalCoins,
}) => {
	return (
		<>
			<SEO />
			<SectionHeader
				title="Today's Cryptocurrency Prices by Market"
				description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio officia laboriosam ad, rerum iste eaque facilis tempora nam maiores nihil?"
			/>
			<HomeTable initialCoins={initialCoins} />
			<Pagination totalItems={totalCoins} itemsPerPage={100} uri="/" />
		</>
	);
};

export default Home;
