import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
	faBell,
	faFileLines,
	faUser,
} from '@fortawesome/free-regular-svg-icons';
import {
	faUser as faUserBold,
	faBell as faBellBold,
	faFileLines as faFileLinesBold,
} from '@fortawesome/free-solid-svg-icons';
import { faEllipsis, faRss } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
	SidebarLeftWrapper,
	StickyWrapper,
	StyledLink,
	ImageWrapper,
} from './SidebarLeft.styled';

const SidebarLeft = () => {
	const { data } = useSession();
	const { pathname } = useRouter();
	const iconProps = {
		fontSize: 20,
		width: 20,
		height: 20,
	};

	return (
		<SidebarLeftWrapper>
			<StickyWrapper>
				<Link href="/community">
					<a>
						<ImageWrapper>
							<Image
								src="/static/community.svg"
								alt=""
								width={208}
								height={25}
							/>
						</ImageWrapper>
					</a>
				</Link>
				<ul>
					<li>
						<Link href="/community" passHref>
							<StyledLink active={pathname === '/community'}>
								<FontAwesomeIcon icon={faRss} {...iconProps} />
								Feed
							</StyledLink>
						</Link>
					</li>
					<li>
						<Link href="/community/articles" passHref>
							<StyledLink>
								<FontAwesomeIcon
									icon={
										pathname === '/community/articles'
											? faFileLinesBold
											: faFileLines
									}
									{...iconProps}
								/>
								Articles
							</StyledLink>
						</Link>
					</li>
					<li>
						<Link href="/community/notifications" passHref>
							<StyledLink>
								<FontAwesomeIcon
									icon={
										pathname === '/community/notifications'
											? faBellBold
											: faBell
									}
									{...iconProps}
								/>
								Notifications
							</StyledLink>
						</Link>
					</li>
					<li>
						<Link href={`/community/profile/${data?.user?.name}`} passHref>
							<StyledLink
								active={
									pathname === '/community/profile/[name]' ||
									pathname === '/community/edit-profile'
								}
							>
								<FontAwesomeIcon
									icon={
										pathname === '/community/profile/[name]' ||
										pathname === '/community/edit-profile'
											? faUserBold
											: faUser
									}
									{...iconProps}
								/>
								Profile
							</StyledLink>
						</Link>
					</li>
					<li>
						<Link href="" passHref>
							<StyledLink>
								<FontAwesomeIcon icon={faEllipsis} {...iconProps} />
								More
							</StyledLink>
						</Link>
					</li>
				</ul>
			</StickyWrapper>
		</SidebarLeftWrapper>
	);
};

export default SidebarLeft;
