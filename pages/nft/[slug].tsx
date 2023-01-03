import axios from 'axios';
import NFTInfo, { NFTInfoProps } from 'components/pages/nft/NFTInfo/NFTInfo';
import NFTMarketData, {
	NFTMarketDataProps,
} from 'components/pages/nft/NFTMarketData/NFTMarketData';
import { GetServerSideProps } from 'next';
import React from 'react';
import { Container } from 'styled/elements/Container';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const res = await axios.get(`${process.env.CMC_API_URI}/nfts/${query.slug}`);

	return {
		props: {
			data: res.data,
		},
	};
};

interface NFTProps {
	data: NFTInfoProps & NFTMarketDataProps;
}

const NFT = ({ data }: NFTProps) => {
	return (
		<Container style={{ paddingBlock: '50px' }}>
			<NFTInfo {...data} />
			<NFTMarketData {...data} />
		</Container>
	);
};

export default NFT;
