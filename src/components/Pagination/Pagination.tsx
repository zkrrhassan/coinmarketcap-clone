import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
	faChevronLeft,
	faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactPaginateProps } from 'react-paginate';
import {
	PaginationWrapper,
	StyledPagination,
} from 'components/Pagination/Pagination.styled';

interface PaginationProps {
	uri: string;
	totalItems: number;
	itemsPerPage: number;
}

const Pagination = ({ uri, totalItems, itemsPerPage }: PaginationProps) => {
	const {
		push,
		query: { page },
	} = useRouter();
	const pageCount = Math.ceil(totalItems / itemsPerPage);
	const [initialPage, setInitialPage] = useState<number>(0);

	useEffect(() => {
		if (page) {
			setInitialPage(Number(page) - 1);
		}
	}, [page]);

	const handlePageClick: ReactPaginateProps['onPageChange'] = (event) => {
		const { selected } = event;
		push(`${uri}${selected !== 0 ? `?page=${selected + 1}` : ''}`);
	};

	return (
		<PaginationWrapper>
			<StyledPagination
				forcePage={initialPage}
				breakLabel="..."
				nextLabel={<FontAwesomeIcon size="xs" icon={faChevronRight} />}
				previousLabel={<FontAwesomeIcon size="xs" icon={faChevronLeft} />}
				pageRangeDisplayed={5}
				pageCount={pageCount}
				onPageChange={handlePageClick}
			/>
		</PaginationWrapper>
	);
};

export default Pagination;
