import React, { useEffect, Fragment } from 'react';
import Image from 'next/image';
import { toggleOpen } from 'app/slices/menuSlice';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { faChevronDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MenuData } from 'components/layout/Navbar/Navbar';
import menuData from 'data/menuItems.json';
import * as S from 'components/layout/MobileMenu/MobileMenu.styled';

const MobileMenu = () => {
	const dispatchMenu = useAppDispatch();
	const { isOpen } = useAppSelector((state) => state.menu);
	const data = Object.entries(menuData as unknown as MenuData);

	const handleToggleMenu = (): void => {
		dispatchMenu(toggleOpen());
	};

	const handleToggleSubmenu = (e: React.MouseEvent): void => {
		const header = e.currentTarget as HTMLDivElement;
		const submenu = header.nextElementSibling as HTMLDivElement;
		const chevron = header.querySelector('.chevron');

		if (submenu.style.height) {
			submenu.style.height = '';
			header.classList.add('open');
			chevron?.classList.remove('open');
		} else {
			submenu.style.height = `${submenu.scrollHeight}px`;
			chevron?.classList.add('open');
		}
	};

	useEffect(() => {
		document.body.style.overflow = `${isOpen ? 'hidden' : ''}`;
	}, [isOpen]);

	return (
		<S.MobileMenu isOpen={isOpen}>
			<S.MenuHeader>
				<div>
					<Image src="/logo.svg" alt="" width={188} height={60} />
				</div>
				<button onClick={handleToggleMenu}>
					<FontAwesomeIcon size="xl" icon={faXmark} />
				</button>
			</S.MenuHeader>
			<S.MenuWrapper>
				<S.MenuList role="menu">
					{data.map((row, index) => (
						<li key={index}>
							<S.SubmenuHeader onClick={handleToggleSubmenu}>
								<S.HeaderText>{row[0]}</S.HeaderText>
								<div>
									<FontAwesomeIcon icon={faChevronDown} className="chevron" />
								</div>
							</S.SubmenuHeader>
							<S.SubmenuWrapper>
								{row[1].list.map((section, index) => (
									<Fragment key={index}>
										<S.SubmenuCategory>{section.category}</S.SubmenuCategory>
										{section.items.map((item, index) => (
											<S.SubmenuItem key={index}>
												<Image
													src={`/static/${item.icon}`}
													alt=""
													width={32}
													height={32}
												/>
												<S.ItemText>{item.text}</S.ItemText>
											</S.SubmenuItem>
										))}
									</Fragment>
								))}
							</S.SubmenuWrapper>
						</li>
					))}
				</S.MenuList>
			</S.MenuWrapper>
		</S.MobileMenu>
	);
};

export default MobileMenu;
