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
import { useMutation } from '@tanstack/react-query';

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
	refetchCallback?: () => void;
}

const Post = ({
	id,
	image,
	name,
	displayName,
	createdAt,
	status,
	content,
	likes: initialLikes,
	detailed,
	marginInline,
	noMarginTop,
	commented,
	isComment,
	refetchCallback,
}: PostProps) => {
	const { data: session } = useSession();
	const [likes, setLikes] = useState<number>(initialLikes.length);
	const [isLiked, setIsLiked] = useState<boolean>();
	const nameFirstLetter = name.charAt(0);
	const {
		colors: { downColor },
	} = useTheme();
	const postMutation = useMutation({
		mutationFn: async () => {
			if (!session) return;

			const params = isComment ? { commentId: id } : { postId: id };

			if (isLiked) {
				const endpoint = isComment ? '/api/comment/unlike' : '/api/post/unlike';
				const post = (
					await axios.post(
						endpoint,
						{
							userId: session.user.id,
						},
						{
							params,
						}
					)
				).data as PrismaPost;
				setIsLiked(post.likes.includes(session.user.id));
				setLikes(post.likes.length);
				refetchCallback && refetchCallback();
			} else {
				const endpoint = isComment ? '/api/comment/like' : '/api/post/like';
				const post = (
					await axios.post(
						endpoint,
						{
							userId: session.user.id,
						},
						{
							params,
						}
					)
				).data as PrismaPost;
				setIsLiked(post.likes.includes(session.user.id));
				setLikes(post.likes.length);
			}
		},
	});

	useEffect(() => {
		if (session) {
			setIsLiked(initialLikes.includes(session.user.id));
		}
	}, [session]);

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
						<a>
							<DisplayName>{displayName}</DisplayName>
						</a>
					</Link>
					<Link href={`/community/profile/${name}`}>
						<a>
							<Name>@{name}</Name>
						</a>
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
					<ToolbarButton
						onClick={(e) => {
							e.stopPropagation();
							e.nativeEvent.preventDefault();
							postMutation.mutate();
						}}
					>
						<FontAwesomeIcon
							icon={isLiked ? faHeartBold : faHeart}
							fontSize={18}
							color={isLiked ? downColor : undefined}
						/>
						<span>{likes}</span>
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
