import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { User } from '@prisma/client';
import axios from 'axios';
import ProfileImage from 'components/ProfileImage/ProfileImage';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { formatToShortDate } from 'utils/formatDate';
import {
	EditButton,
	EditButtonText,
	EditButtonWrapper,
	ProfileContent,
	ProfileData,
	ProfileDisplayName,
	ProfileJoined,
	ProfileName,
	ProfileNameWrapper,
	ProfileStatistic,
	ProfileStatisticWrapper,
	ProfileWrapper,
	StatisticNumber,
	ImageWrapper,
} from './ProfileInfo.styled';

const ProfileInfo = () => {
	const {
		query: { name },
	} = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [error, setError] = useState<string>('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			if (name) {
				try {
					setLoading(true);
					const res = await axios.get(`/api/user/get`, {
						params: {
							name,
						},
					});
					setUser(res.data);
				} catch (error) {
					console.error(error);
					setError('User not found');
				} finally {
					setLoading(false);
				}
			}
		};

		fetchUser();
	}, [name]);

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<>
			{loading && <div>Loading...</div>}
			{user && (
				<ProfileWrapper>
					<ProfileData>
						<ImageWrapper>
							<ProfileImage
								source={user.image && `/uploads/${user.image}.jpeg`}
								firstLetter={user.name.charAt(0)}
								width={110}
								height={110}
								variant="large"
							/>
						</ImageWrapper>
						<ProfileContent>
							<ProfileNameWrapper>
								<ProfileDisplayName>{user?.name}</ProfileDisplayName>
								<ProfileName>@displayName</ProfileName>
								<ProfileStatisticWrapper>
									<ProfileStatistic>
										<StatisticNumber>0</StatisticNumber> Following
									</ProfileStatistic>
									<ProfileStatistic>
										<StatisticNumber>0</StatisticNumber> Followers
									</ProfileStatistic>
								</ProfileStatisticWrapper>
							</ProfileNameWrapper>
							<Link href="/community/edit-profile" passHref>
								<EditButtonWrapper>
									<EditButton>
										<FontAwesomeIcon icon={faPenToSquare} />
										<EditButtonText>Edit</EditButtonText>
									</EditButton>
								</EditButtonWrapper>
							</Link>
						</ProfileContent>
					</ProfileData>
					{user.emailVerified && (
						<ProfileJoined>
							Joined {formatToShortDate(new Date(user.emailVerified))}
						</ProfileJoined>
					)}
				</ProfileWrapper>
			)}
		</>
	);
};

export default ProfileInfo;
