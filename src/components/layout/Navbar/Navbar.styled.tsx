import styled from 'styled-components';
import { Container } from 'styled/elements/Container';

// ---------------------------------SUBMENU ---------------------------------

interface SubmenuProps {
	multiSubmenu?: boolean;
	columns: number;
}

export const SubmenuWrapper = styled.div<SubmenuProps>`
	position: absolute;
	top: 100%;
	left: 50%;
	transform: translate(-50%, 0%);
	background: ${({ theme: { colors } }) => colors.bgColor};
	z-index: 1000;
	padding: 24px 19px;
	white-space: nowrap;
	display: grid;
	visibility: hidden;
	grid-template-columns: ${({ columns }) => `repeat(${columns}, 1fr)`};
	border-radius: 8px;
	box-shadow: rgba(128, 138, 157, 0.12) 0px 1px 2px,
		rgba(128, 138, 157, 0.24) 0px 8px 32px;
	opacity: 0;
	transition: opacity 0.25s ease 0.1s;

	&::before {
		content: '';
		display: block;
		width: 0px;
		z-index: 1000;
		height: 0px;
		border-width: 10px;
		border-style: solid;
		border-image: initial;
		border-top-color: transparent;
		border-right-color: transparent;
		border-left-color: transparent;
		border-bottom-color: ${({ theme: { colors } }) => colors.bgColor};
		position: absolute;
		top: -20px;
		left: calc(50% - 10px);
	}
`;

export const SubmenuColumn = styled.div`
	margin: 0 10px;
	align-self: flex-start;
`;

export const ColumnCategory = styled.p`
	margin: 0 0 10px 10px;
	font-size: 14px;
	text-transform: uppercase;
	opacity: 0.4;
	font-weight: 600;
`;

export const ColumnItem = styled.a`
	padding: 8px;
	font-size: 14px;
	font-weight: 500;
	display: flex;
	align-items: center;
	gap: 16px;
	cursor: pointer;
	&:hover {
		background: ${({ theme: { colors } }) => colors.colorLightNeutral1};
	}
`;

export const ItemText = styled.p`
	font-weight: 600;
`;

// --------------------------------- NAVBAR ---------------------------------

export const NavbarWrapper = styled.nav`
	border-bottom: 1px solid ${({ theme: { colors } }) => colors.borderColor};
`;

export const NavbarContent = styled(Container)`
	display: flex;
	align-items: center;
`;

export const MenuList = styled.ul`
	margin-left: 40px;
	display: none;
	@media screen and (min-width: 1200px) {
		display: flex;
		gap: 24px;
	}
`;

export const MenuLink = styled.a`
	font-size: 14px;
	font-weight: 700;
	min-height: 61px;
	display: flex;
	align-items: center;
	text-transform: capitalize;
	cursor: pointer;
	transition: color 0.1s ease;
`;

export const LogoWrapper = styled.div`
	margin-right: auto;
	@media screen and (min-width: 1200px) {
		margin-right: initial;
	}
`;

export const MenuItem = styled.li`
	position: relative;

	&:hover {
		${SubmenuWrapper} {
			visibility: visible;
			opacity: 1;
		}
		${MenuLink} {
			color: ${({ theme: { colors } }) => colors.themeColor};
		}
	}

	&:first-child {
		${SubmenuColumn}:first-child {
			grid-row: 1 / 3;
		}
	}
`;

export const Search = styled.button`
	@media screen and (min-width: 1200px) {
		display: none;
	}
`;
export const HamburgerButton = styled.button`
	margin-left: 30px;
	@media screen and (min-width: 1200px) {
		display: none;
	}
`;
