import { faCommentDots, faHeart } from '@fortawesome/free-regular-svg-icons';
import {
	faCaretDown,
	faCaretUp,
	faEllipsis,
	faRetweet,
	faHeart as faHeartBold,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProfileImage from 'components/ProfileImage/ProfileImage';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { calculateEllapsedTime } from 'utils/calculateEllapsedTime';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Post as PrismaPost } from '@prisma/client';
import { formatToLongDate } from 'utils/formatDate';
import {
	Content,
	ContentWrapper,
	CreatedAt,
	DisplayName,
	Name,
	PostInfo,
	PostToolbar,
	PostWrapper,
	Status,
	ToolbarButton,
	ImageWrapper,
} from './Post.styled';
import { useTheme } from 'styled-components';

export interface PostProps {
	id: string;
	image: string | null;
	name: string;
	displayName: string;
	createdAt: Date;
	status: string | null;
	content: string;
	likes: string[];
	detailed?: boolean;
	marginInline?: boolean;
	noMarginTop?: boolean;
	commented?: boolean;
	isComment?: boolean;
}

const Post = ({
	id,
	image,
	name,
	displayName,
	createdAt,
	status,
	content,
	likes,
	detailed,
	marginInline,
	noMarginTop,
	commented,
	isComment,
}: PostProps) => {
	const { data } = useSession();
	const [isLiked, setIsLiked] = useState<boolean | null>(null);
	const nameFirstLetter = name.charAt(0);
	const {
		colors: { downColor },
	} = useTheme();

	useEffect(() => {
		if (data && data.user) {
			setIsLiked(likes.includes(data!.user.id));
		}
	}, [data]);

	const handleLike = async () => {
		if (!data || !data.user) return;

		const params = isComment ? { commentId: id } : { postId: id };

		if (isLiked) {
			const endpoint = isComment ? '/api/comment/unlike' : '/api/post/unlike';
			const post = (
				await axios.post(
					endpoint,
					{
						userId: data?.user.id,
					},
					{
						params,
					}
				)
			).data as PrismaPost;
			setIsLiked(post.likes.includes(data!.user.id));
		} else {
			const endpoint = isComment ? '/api/comment/like' : '/api/post/like';
			const post = (
				await axios.post(
					endpoint,
					{
						userId: data?.user.id,
					},
					{
						params,
					}
				)
			).data as PrismaPost;
			setIsLiked(post.likes.includes(data!.user.id));
		}
	};

	return (
		<PostWrapper
			marginInline={marginInline}
			noMarginTop={noMarginTop}
			commented={commented}
		>
			<ImageWrapper>
				<ProfileImage
					source={image && `/uploads/${image}.jpeg`}
					firstLetter={nameFirstLetter}
					width={56}
					height={56}
					variant="medium"
				/>
			</ImageWrapper>
			<ContentWrapper>
				<PostInfo>
					<Link href={`/community/profile/${name}`}>
						<DisplayName>{displayName}</DisplayName>
					</Link>
					<Link href={`/community/profile/${name}`}>
						<Name>@{name}</Name>
					</Link>
					{!detailed && (
						<Name>
							&nbsp;·&nbsp; {calculateEllapsedTime(new Date(createdAt))}
						</Name>
					)}
					{status && (
						<Status variant={status as 'bullish' | 'bearish'}>
							<FontAwesomeIcon
								icon={status === 'bearish' ? faCaretDown : faCaretUp}
							/>
							<span>{status}</span>
						</Status>
					)}
				</PostInfo>
				<Content detailed={detailed}>{content}</Content>
				{detailed && (
					<CreatedAt>{formatToLongDate(new Date(createdAt))}</CreatedAt>
				)}
				<PostToolbar>
					<ToolbarButton>
						<FontAwesomeIcon icon={faCommentDots} fontSize={18} />
					</ToolbarButton>
					<ToolbarButton>
						<FontAwesomeIcon icon={faRetweet} fontSize={18} />
					</ToolbarButton>
					<ToolbarButton onClick={handleLike}>
						<FontAwesomeIcon
							icon={isLiked ? faHeartBold : faHeart}
							fontSize={18}
							color={isLiked ? downColor : undefined}
						/>
						<span>{likes.length}</span>
					</ToolbarButton>
					<ToolbarButton>
						<FontAwesomeIcon icon={faEllipsis} fontSize={18} />
					</ToolbarButton>
				</PostToolbar>
			</ContentWrapper>
		</PostWrapper>
	);
};

export default Post;
