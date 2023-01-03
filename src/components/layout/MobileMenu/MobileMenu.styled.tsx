import styled from 'styled-components';

export const MobileMenu = styled.div<{ isOpen: boolean }>`
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	background: ${({ theme: { colors } }) => colors.white};
	z-index: 100;
	transform: ${({ isOpen }) => (isOpen ? 'unset' : 'translateX(-100%)')};
	transition: transform 0.2s ease-in-out;

	@media screen and (min-width: 1200px) {
		display: none;
	}
`;

export const MenuHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 16px;
	border-bottom: 1px solid ${({ theme: { colors } }) => colors.borderColor};
`;

export const MenuWrapper = styled.div`
	padding: 8px 16px;
	height: calc(100% - 64px);
	overflow: auto;

	::-webkit-scrollbar {
		width: 6px;
		background-color: transparent;
	}
	::-webkit-scrollbar-thumb {
		border-radius: 3px;
		background: ${({ theme: { colors } }) => colors.colorLightNeutral3};
	}
`;

export const MenuList = styled.ul``;

export const SubmenuHeader = styled.div`
	text-transform: capitalize;
	height: 48px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 8px;
	border-bottom: 1px solid ${({ theme: { colors } }) => colors.borderColor};

	& .chevron {
		transition: transform 0.3s ease;
		transform-origin: center;
	}

	& .chevron.open {
		transform: rotate(180deg);
	}
`;

export const HeaderText = styled.p`
	font-size: 16px;
	font-weight: 600;
`;

export const SubmenuWrapper = styled.div`
	height: 0px;
	overflow-y: hidden;
	transition: height 0.3s ease;
	padding: 0 8px;
`;

export const SubmenuCategory = styled.p`
	margin: 10px 0;
	color: ${({ theme: { colors } }) => colors.textColor};
	opacity: 0.4;
	font-size: 14px;
	font-weight: 600;
	text-transform: uppercase;
`;

export const SubmenuItem = styled.div`
	display: flex;
	align-items: center;
	gap: 20px;
	padding: 8px 0;
`;

export const ItemText = styled.p`
	font-size: 16px;
	font-weight: 500;
`;
