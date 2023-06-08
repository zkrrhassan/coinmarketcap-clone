import React, { MouseEvent, useState } from 'react';
import { Container } from 'styled/elements/Container';
import { useSession } from 'next-auth/react';
import WatchlistList from 'components/pages/watchlist/WatchlistList/WatchlistList';
import WatchlistModal from 'components/pages/watchlist/WatchlistModal/WatchlistModal';
import WatchlistTable from 'components/pages/watchlist/WatchlistTable/WatchlistTable';
import { Watchlist } from '@prisma/client';

const Watchlist = () => {
	const { data: session } = useSession();
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [watchlistAction, setWatchlistAction] = useState<
		'edit' | 'create' | null
	>(null);
	const [currentWatchlist, setCurrentWatchlist] = useState<Watchlist>();

	const updateCurrentWatchlist = (watchlist: Watchlist) => {
		setCurrentWatchlist(watchlist);
	};

	const handleOpenCreate = () => {
		setModalOpen(true);
		setWatchlistAction('create');
	};

	const handleModalClose = () => {
		setModalOpen(false);
		setWatchlistAction(null);
	};

	const handleOpenEdit = (e: MouseEvent) => {
		e.stopPropagation();
		setModalOpen(true);
		setWatchlistAction('edit');
	};

	return (
		<Container>
			{!session ? (
				<>
					<p>Sign up today and get</p>
					<p>your own crypto Watchlist</p>
				</>
			) : (
				<>
					<WatchlistList
						currentWatchlist={currentWatchlist}
						setCurrentWatchlist={setCurrentWatchlist}
						handleOpenCreate={handleOpenCreate}
						handleOpenEdit={handleOpenEdit}
					/>
					{currentWatchlist && (
						<>
							<WatchlistModal
								handleModalClose={handleModalClose}
								modalOpen={modalOpen}
								watchlistAction={watchlistAction}
								currentWatchlist={currentWatchlist}
							/>
							<WatchlistTable
								currentWatchlist={currentWatchlist}
								updateCurrentWatchlist={updateCurrentWatchlist}
							/>
						</>
					)}
				</>
			)}
		</Container>
	);
};

export default Watchlist;
