export const formatPrice = (price: number): string => {
	if (price > 1) {
		return new Intl.NumberFormat('en-IN', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(price);
	} else {
		const numberOfZeros = String(price).slice(2).search(/[1-9]/);
		return parseFloat(price.toFixed(numberOfZeros + 4)).toString();
	}
};

export const formatLargeValue = (price: number): string => {
	return Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(
		Number(price)
	);
};

export const formatPercentageValue = (
	price: number,
	digits?: number
): string => {
	return price.toFixed(digits ?? 2).slice(price > 0 ? 0 : 1);
};

export const displayValueIfExists = (
	callback: (value: number) => string,
	value: number
) => {
	return value ? callback(value) : '???';
};
