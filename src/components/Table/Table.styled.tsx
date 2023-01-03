import styled from 'styled-components';

export const TableWrapper = styled.div`
	overflow-x: scroll;

	::-webkit-scrollbar {
		height: 6px;
		background-color: transparent;
	}
	::-webkit-scrollbar-thumb {
		border-radius: 3px;
		background: ${({ theme: { colors } }) => colors.colorLightNeutral3};
	}
`;

export const Table = styled.table`
	width: 100%;
	min-width: max-content;
	border-spacing: 0px;
	position: relative;
	border-collapse: collapse;

	tr {
		text-align: right;
		&:hover td {
			background: ${({ theme: { colors } }) => colors.colorNeutral1};
		}
	}

	td {
		padding: 10px;
		font-size: 14px;
		line-height: 24px;
		font-weight: 600;
		white-space: nowrap;
		border-bottom: 1px solid ${({ theme: { colors } }) => colors.borderColor};
		background: ${({ theme: { colors } }) => colors.bgColor};

		&:first-child,
		&:nth-child(2),
		&:nth-child(3) {
			position: sticky;
			background: ${({ theme: { colors } }) => colors.bgColor};
		}

		&:first-child {
			left: 0px;
		}
		&:nth-child(2) {
			left: 33px;
		}
		&:nth-child(3) {
			left: 78px;
		}
	}

	th {
		padding: 10px;
		border-top: 1px solid ${({ theme: { colors } }) => colors.borderColor};
		border-bottom: 1px solid ${({ theme: { colors } }) => colors.borderColor};
		font-size: 12px;
		line-height: 1.9;
		position: sticky;
		top: 0;
		z-index: 10;
		background: ${({ theme: { colors } }) => colors.bgColor};
	}
`;
