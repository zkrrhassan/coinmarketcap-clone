import React from 'react';
import data from 'data/footerItems.json';
import Image from 'next/image';
import {
	FooterContent,
	FooterGrid,
	LogoWrapper,
	ListWrapper,
	FooterSection,
	FooterCategory,
	FooterList,
	FooterItem,
	FooterLink,
	FooterCopyright,
} from 'components/layout/Footer/Footer.styled';

type FooterData = Record<
	string,
	{
		text: string;
		url: string;
	}[]
>;

const Footer = () => {
	const footerData = Object.entries(data as unknown as FooterData);

	return (
		<footer>
			<FooterContent>
				<FooterGrid>
					<LogoWrapper>
						<Image src="/static/logo.svg" alt="" width={188} height={60} />
					</LogoWrapper>
					<ListWrapper>
						{footerData.map((section, index) => (
							<FooterSection key={index}>
								<FooterCategory>{section[0]}</FooterCategory>
								<FooterList>
									{section[1].map((item, index) => (
										<FooterItem key={index}>
											<FooterLink>{item.text}</FooterLink>
										</FooterItem>
									))}
								</FooterList>
							</FooterSection>
						))}
					</ListWrapper>
					<FooterCopyright>
						© 2022 CoinMarketCap. All rights reserved
					</FooterCopyright>
				</FooterGrid>
			</FooterContent>
		</footer>
	);
};

export default Footer;
