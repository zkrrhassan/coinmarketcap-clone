import React from 'react';
import { formatPrice } from 'utils/formatValues';
import {
	PriceSectionWrapper,
	PriceHeading,
	PriceWrapper,
	PriceCryptoWrapper,
	HighLowWrapper,
	PriceCrypto,
	CryptoValue,
	Progress,
	Symbol,
	Price,
	PriceCryptoChange,
} from 'components/pages/coin/PriceSection/PriceSection.styled';
import PercentageChange from 'components/PercentageChange/PercentageChange';

interface PriceSectionProps {
	name: string;
	symbol: string;
	price: number;
	priceBTC: number;
	priceETH: number;
	priceChange: number;
	priceChangeBTC: number;
	priceChangeETH: number;
	low: number;
	high: number;
}

const PriceSection = ({
	name,
	symbol,
	price,
	priceBTC,
	priceETH,
	priceChange,
	priceChangeBTC,
	priceChangeETH,
	low,
	high,
}: PriceSectionProps) => {
	return (
		<PriceSectionWrapper>
			<PriceHeading>
				{name} Price <Symbol>({symbol})</Symbol>
			</PriceHeading>
			<PriceWrapper>
				<Price>${formatPrice(price)}</Price>
				<PercentageChange value={priceChange} filled />
			</PriceWrapper>
			<PriceCryptoWrapper>
				{symbol !== 'btc' && (
					<PriceCryptoChange>
						{formatPrice(priceBTC)} BTC
						<PercentageChange value={priceChangeBTC} marginLeft={10} />
					</PriceCryptoChange>
				)}
				{symbol !== 'eth' && (
					<PriceCryptoChange>
						{formatPrice(priceETH)} ETH
						<PercentageChange value={priceChangeETH} marginLeft={10} />
					</PriceCryptoChange>
				)}
			</PriceCryptoWrapper>
			<HighLowWrapper>
				<PriceCrypto>
					Low:
					<CryptoValue>{formatPrice(low)}</CryptoValue>
				</PriceCrypto>
				<PriceCrypto>
					High:
					<CryptoValue>{formatPrice(high)}</CryptoValue>
				</PriceCrypto>
				<Progress max={high - low} value={price - low}></Progress>
			</HighLowWrapper>
		</PriceSectionWrapper>
	);
};

export default PriceSection;
