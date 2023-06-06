import axios from 'axios';
import ExchangesTable from 'components/pages/exchanges/ExchangesTable/ExchangesTable';
import Pagination from 'components/Pagination/Pagination';
import SectionHeader from 'components/SectionHeader/SectionHeader';
import SEO from 'components/SEO/SEO';
import type { GetServerSideProps, NextPage } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const exchanges = (
		await axios.get(`${process.env.API_URL}/exchanges`, {
			params: {
				per_page: 100,
				page: query.page,
			},
		})
	).data;

	return {
		props: {
			exchanges,
		},
	};
};

export interface Exchange {
	index: number;
	name: string;
	image: string;
	trust_score: number;
	trust_score_rank: number;
	trade_volume_24h_btc: number;
	trade_volume_24h_btc_normalized: number;
	year_established: number;
	country: string;
	id: number;
}

const Exchanges: NextPage<{ exchanges: Exchange[] }> = ({ exchanges }) => {
	return (
		<>
			<SEO
				title="Top Cryptocurrency Exchanges Ranked By Volume | CoinMarketCap"
				description="See our list of cryptocurrency exchanges ✔️ Ranked by volume ✔️ Binance ✔️ Coinbase Pro ✔️ Huobi ✔️ Kraken ✔️ Bithumb ✔️ Bitfinex ✔️ And many more ✔️"
			/>
			<SectionHeader
				title="Top Cryptocurrency Spot Exchanges"
				description="CoinMarketCap ranks and scores exchanges based on traffic, liquidity, trading volumes, and confidence in the legitimacy of trading volumes reported."
			/>
			<ExchangesTable exchanges={exchanges} />
			<Pagination itemsPerPage={100} totalItems={1_000} uri="/exchanges" />
		</>
	);
};

export default Exchanges;
