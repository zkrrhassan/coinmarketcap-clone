import type { GetServerSideProps, NextPage } from 'next';
import axios from 'axios';
import CategoriesTable from 'components/pages/categories/CategoriesTable/CategoriesTable';

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
	return <CategoriesTable categories={categories} />;
};

export default Categories;
