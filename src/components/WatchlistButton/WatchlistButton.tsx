import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React from 'react';
import Loader from 'styled/elements/Loader';
import { useSession } from 'next-auth/react';
import { changeAuthOpen } from 'app/slices/menuSlice';
import { useAppDispatch } from 'hooks/redux';
import { useTheme } from 'styled-components';
import { useMutation } from '@tanstack/react-query';

interface WatchlistButtonProps {
	coinId: string;
	isOnWatchlist?: boolean;
	watchlistCallback: () => void;
}

const WatchlistButton = ({
	coinId,
	isOnWatchlist,
	watchlistCallback,
}: WatchlistButtonProps) => {
	const { data: session } = useSession();
	const id = session?.user.id;
	const dispatch = useAppDispatch();
	const {
		colors: { textColor, star },
	} = useTheme();
	const addToWatchlist = useMutation({
		mutationFn: async () => {
			if (!id) throw Error('User id is required');
			await axios.post(
				'/api/watchlist/addCoin',
				{
					coinId,
				},
				{
					params: {
						userId: id,
					},
				}
			);
		},
		onSuccess: watchlistCallback,
	});
	const removeFromWatchlist = useMutation({
		mutationFn: async () => {
			if (!id) throw Error('User id is required');
			await axios.post(
				'/api/watchlist/removeCoin',
				{
					coinId,
				},
				{
					params: {
						userId: id,
					},
				}
			);
		},
		onSuccess: watchlistCallback,
	});

	const handleLoginOpen = () => {
		dispatch(changeAuthOpen('login'));
	};

	return (
		<button
			onClick={
				session
					? isOnWatchlist
						? () => removeFromWatchlist.mutate()
						: () => addToWatchlist.mutate()
					: handleLoginOpen
			}
		>
			{addToWatchlist.isLoading || removeFromWatchlist.isLoading ? (
				<Loader color={textColor} width={14} height={14} />
			) : isOnWatchlist ? (
				<FontAwesomeIcon icon={faStarSolid} fontSize={12} color={star} />
			) : (
				<FontAwesomeIcon icon={faStar} fontSize={12} color={textColor} />
			)}
		</button>
	);
};

export default WatchlistButton;
