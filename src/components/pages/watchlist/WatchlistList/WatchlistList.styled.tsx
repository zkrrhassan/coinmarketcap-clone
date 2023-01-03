import styled, { css } from 'styled-components';

export const ListItem = styled.div<{ add?: boolean }>`
	font-size: 12px;
	font-weight: 600;
	line-height: 40px;
	border-radius: 8px;
	padding: 0px 8px;
	cursor: pointer;

	${({ add }) =>
		add &&
		css`
			padding-top: 5px;
			position: relative;

			&::before {
				content: '';
				width: 100%;
				height: 1px;
				position: absolute;
				top: 0;
				left: 0;
				background: ${({ theme: { colors } }) => colors.colorLightNeutral2};
				display: block;
			}
		`}

	&:hover {
		background: ${({ theme: { colors } }) => colors.colorLightNeutral2};
	}
`;

export const InputWrapper = styled.div<{ second?: boolean }>`
	display: flex;
	flex-direction: column;
	margin-top: ${({ second }) => second && '24px'};
`;

export const Label = styled.label`
	font-weight: 600;
	font-size: 12px;
	margin-bottom: 6px;
`;

export const Input = styled.input<{ textarea?: boolean }>`
	resize: none;
	background-color: ${({ theme: { colors } }) => colors.controlBackgroundColor};
	border: 1px solid ${({ theme: { colors } }) => colors.colorLightNeutral2};
	border-radius: 8px;
	color: ${({ theme: { colors } }) => colors.textColor};
	max-width: 100%;
	outline: 0px;
	padding: ${({ textarea }) => (textarea ? '8px 16px' : '0px 16px')};
	width: 100%;
	font-size: 14px;
	height: 40px;
	line-height: 21px;
	min-height: ${({ textarea }) => textarea && '80px'};
`;

export const TitleWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 24px;
`;

export const FormWrapper = styled.div`
	background: ${({ theme: { colors } }) => colors.controlBackgroundColor};
	border-radius: 16px;
`;

export const WatchlistModal = styled.div<{ isOpen: boolean }>`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: ${({ theme: { colors } }) => colors.modal};
	z-index: 1000;
	display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
	justify-content: center;
	align-items: center;
`;

export const WatchlistListWrapper = styled.div`
	position: relative;
`;

export const CurrentWatchlistWrapper = styled.div`
	padding-block: 24px;
`;

export const WatchlistDropdown = styled.div<{ isOpen: boolean }>`
	position: absolute;
	top: calc(100% + 8px);
	left: 0;
	background: ${({ theme: { colors } }) => colors.controlBackgroundColor};
	padding: 8px 16px;
	border-radius: 8px;
	z-index: 100;
	min-width: 284px;
	box-shadow: 0px 1px 2px rgba(128, 138, 157, 0.12),
		0px 8px 32px rgba(128, 138, 157, 0.24);

	opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
	visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
	transition: opacity 0.1s ease-in-out;
`;

export const NameWrapper = styled.div`
	display: flex;
	align-items: center;
`;

export const MainBadge = styled.div`
	font-size: 12px;
	font-weight: 500;
	padding: 0px 6px;
	border-radius: 4px;
	line-height: 21px;
	background: ${({ theme: { colors } }) => colors.themeColor};
	color: white;
	width: fit-content;
	margin-bottom: 8px;
`;

export const Name = styled.p`
	margin: 0px;
	font-weight: 700;
	font-size: 24px;
	line-height: 34px;
	max-width: 455px;
	overflow: hidden;
	white-space: nowrap;
	margin-inline-end: 10px;
`;

export const RenameButton = styled.button`
	background: ${({ theme: { colors } }) => colors.colorLightNeutral2};
	padding: 4px 6px;
	height: 30px;
	border-radius: 8px;
	margin-right: 10px;
	color: ${({ theme: { colors } }) => colors.colorLightNeutral5};
`;

export const FormTitle = styled.p`
	font-size: 24px;
	font-weight: 700;
`;

export const WatchlistForm = styled.form`
	min-width: 480px;
	padding: 0 24px 24px;
`;

export const SaveButton = styled.button`
	align-items: center;
	background: ${({ theme: { colors } }) => colors.themeColor};
	border: 0px;
	border-radius: 8px;
	color: ${({ theme: { colors } }) => colors.white};
	cursor: pointer;
	font-weight: 600;
	height: 40px;
	font-size: 14px;
	padding: 0px 24px;
	line-height: 24px;
	width: 100%;
	margin-top: 24px;
`;
