import React from 'react';
import { HeaderWrapper } from 'components/SectionHeader/SectionHeader.styled';

interface SectionHeaderProps {
	title: string;
	description: string;
}

const SectionHeader = ({ title, description }: SectionHeaderProps) => {
	return (
		<HeaderWrapper>
			<h1>{title}</h1>
			<p>{description}</p>
		</HeaderWrapper>
	);
};

export default SectionHeader;
