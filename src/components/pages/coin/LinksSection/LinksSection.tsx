import React from 'react';
import { removeHttp } from 'utils/formatLink';
import { CoinLinks } from '../../../../../pages/coins/[slug]';
import {
	LinksList,
	SubList,
	SubListWrapper,
	LinkName,
	SubListItem,
} from './LinksSection.styled';

interface LinksSectionProps {
	links: CoinLinks;
}

const LinksSection = ({ links }: LinksSectionProps) => {
	return (
		<LinksList>
			<li>
				<LinkName>{removeHttp(links.homepage[0])}</LinkName>
			</li>
			<SubListWrapper>
				<LinkName>Explorers</LinkName>
				<SubList>
					{links.blockchain_site.length > 0 ? (
						links.blockchain_site.map(
							(link, index) =>
								link && (
									<li key={index}>
										<SubListItem>{removeHttp(link)}</SubListItem>
									</li>
								)
						)
					) : (
						<p>No explorers links available</p>
					)}
				</SubList>
			</SubListWrapper>
			<SubListWrapper>
				<LinkName>Community</LinkName>
				<SubList>
					<li>
						<SubListItem>{removeHttp(links.official_forum_url[0])}</SubListItem>
					</li>
					<li>
						<SubListItem href={links.subreddit_url}>reddit.com</SubListItem>
					</li>
				</SubList>
			</SubListWrapper>
			<li>
				<LinkName href={links.repos_url.github[0]}>Source code</LinkName>
			</li>
		</LinksList>
	);
};
export default LinksSection;
