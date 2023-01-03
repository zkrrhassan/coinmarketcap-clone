import axios from 'axios';
import HomeTable from 'components/pages/home/HomeTable/HomeTable';
import Pagination from 'components/Pagination/Pagination';
import type { GetServerSideProps, NextPage } from 'next';
import { CoinData } from 'pages';

interface CategoriesProps {
	coins: CoinData[];
	category: string;
	totalCoins: number;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const res = await axios.get(`${process.env.CMC_API_URI}/coins/markets`, {
		params: {
			vs_currency: 'usd',
			order: 'market_cap_desc',
			per_page: 100,
			category: query.slug,
			sparkline: 'true',
			page: query.page ?? 1,
			price_change_percentage: '1h,24h,7d',
		},
	});

	return {
		props: {
			coins: res.data,
			category: query.slug,
		},
	};
};

const Categories: NextPage<CategoriesProps> = ({ coins, category }) => {
	return (
		<>
			<HomeTable initialCoins={coins} />
			<Pagination
				totalItems={4400}
				itemsPerPage={100}
				uri={`/categories/${category}`}
			/>
		</>
	);
};

export default Categories;
