import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProfileImage from 'components/ProfileImage/ProfileImage';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
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
import useUser from 'hooks/useUser';

const ProfileInfo = () => {
	const { query } = useRouter();

	const {
		data: user,
		isLoading,
		isError,
	} = useUser({ name: query.name as string });

	if (isLoading) return <div>Loading...</div>;

	if (isError) return <div></div>;

	return (
		<ProfileWrapper>
			<ProfileData>
				<ImageWrapper>
					<ProfileImage
						source={user.image}
						firstLetter={user.name.charAt(0)}
						width={110}
						height={110}
						variant="large"
					/>
				</ImageWrapper>
				<ProfileContent>
					<ProfileNameWrapper>
						<ProfileDisplayName>{user.displayName}</ProfileDisplayName>
						<ProfileName>{user.name}</ProfileName>
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
	);
};

export default ProfileInfo;
