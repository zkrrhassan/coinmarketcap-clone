import { faBars, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { toggleOpen } from 'app/slices/menuSlice';
import { useAppDispatch } from 'hooks/redux';
import Submenu, { SubmenuProps } from 'components/layout/Navbar/Submenu';
import menuData from 'data/menuItems.json';
import {
	NavbarWrapper,
	NavbarContent,
	LogoWrapper,
	MenuList,
	MenuItem,
	MenuLink,
	Search,
	HamburgerButton,
} from 'components/layout/Navbar/Navbar.styled';

export type MenuData = Record<string, SubmenuProps>;

const Navbar = () => {
	const dispatchMenu = useAppDispatch();
	const data = Object.entries(menuData as unknown as MenuData);

	const handleToggleMenu = (): void => {
		dispatchMenu(toggleOpen());
	};

	return (
		<NavbarWrapper>
			<NavbarContent>
				<LogoWrapper>
					<Link href="/">
						<a>
							<Image src="/logo.svg" alt="" width={168} height={60} />
						</a>
					</Link>
				</LogoWrapper>
				<MenuList>
					{data.map((data, index) => (
						<MenuItem key={index}>
							<MenuLink>{data[0]}</MenuLink>
							<Submenu
								multiSubmenu={data[1].multiSubmenu}
								list={data[1].list}
							/>
						</MenuItem>
					))}
				</MenuList>
				<Search>
					<FontAwesomeIcon size="xl" icon={faMagnifyingGlass} />
				</Search>
				<HamburgerButton onClick={handleToggleMenu}>
					<FontAwesomeIcon size="xl" icon={faBars} />
				</HamburgerButton>
			</NavbarContent>
		</NavbarWrapper>
	);
};

export default Navbar;
