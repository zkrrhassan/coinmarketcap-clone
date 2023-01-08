import type { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import CategoriesTable from 'components/pages/categories/CategoriesTable/CategoriesTable';
import SEO from 'components/SEO/SEO';

export interface Category {
	id: string;
	name: string;
	market_cap: number;
	market_cap_change_24h: number;
	top_3_coins: string[];
	volume_24h: number;
	index: number;
}

interface CategoriesProps {
	categories: Category[];
}

export const getServerSideProps: GetServerSideProps = async () => {
	const res = await axios.get(`${process.env.CMC_API_URI}/coins/categories`);

	return {
		props: {
			categories: res.data,
		},
	};
};

const Categories: NextPage<CategoriesProps> = ({ categories }) => {
	return (
		<>
			<SEO
				title="Cryptocurrency Sectors by 24h Price Change | CoinMarketCap"
				description="Cryptocurrency category by 24h price change. Find out which parts of the crypto market are hot right now."
			/>
			<CategoriesTable categories={categories} />;
		</>
	);
};

export default Categories;
