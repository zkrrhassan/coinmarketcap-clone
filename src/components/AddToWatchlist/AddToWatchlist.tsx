import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useState } from 'react';
import Loader from 'styled/elements/Loader';
import { useSession } from 'next-auth/react';
import { changeAuthOpen } from 'app/slices/menuSlice';
import { useAppDispatch } from 'hooks/redux';
import { useTheme } from 'styled-components';

interface AddToWatchlistProps {
	coinId: string;
	watchlistCallback: () => Promise<void>;
	isOnWatchlist?: boolean;
}

const AddToWatchlist = ({
	coinId,
	watchlistCallback,
	isOnWatchlist,
}: AddToWatchlistProps) => {
	const [loading, setLoading] = useState<boolean>(false);
	const { status, data } = useSession();
	const dispatch = useAppDispatch();
	const {
		colors: { textColor, star },
	} = useTheme();

	const handleUpdateWatchlist = async () => {
		if (status !== 'authenticated') {
			dispatch(changeAuthOpen('signup'));
		}
		if (!data || !data.user) {
			return;
		}
		setLoading(true);
		if (isOnWatchlist) {
			await axios.post(
				`/api/watchlist/removeCoin`,
				{
					coinId,
				},
				{
					params: {
						userId: data.user.id,
					},
				}
			);
		} else {
			await axios.post(
				`/api/watchlist/addCoin`,
				{
					coinId,
				},
				{
					params: {
						userId: data.user.id,
					},
				}
			);
		}

		await watchlistCallback();
		setLoading(false);
	};

	return (
		<button onClick={handleUpdateWatchlist}>
			{loading ? (
				<Loader color={textColor} width={14} height={14} />
			) : isOnWatchlist ? (
				<FontAwesomeIcon icon={faStarSolid} fontSize={12} color={star} />
			) : (
				<FontAwesomeIcon icon={faStar} fontSize={12} color={textColor} />
			)}
		</button>
	);
};

export default AddToWatchlist;
