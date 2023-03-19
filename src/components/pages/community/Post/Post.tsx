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
import React, { MouseEvent, useEffect, useState } from 'react';
import { calculateEllapsedTime } from 'utils/calculateEllapsedTime';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Like } from '@prisma/client';
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
	likes: Like[];
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
	likes,
	detailed,
	marginInline,
	noMarginTop,
	commented,
	isComment,
	refetchCallback,
}: PostProps) => {
	const { data: session } = useSession();
	const [isLiked, setIsLiked] = useState<boolean>(false);
	const nameFirstLetter = name.charAt(0);
	const {
		colors: { downColor },
	} = useTheme();
	const like = useMutation({
		mutationFn: async () =>
			await axios.patch(
				'/api/post/like',
				{},
				{
					params: {
						postId: id,
						userId: session?.user.id,
					},
				}
			),
		onSuccess: refetchCallback,
	});
	const unlike = useMutation({
		mutationFn: async () =>
			await axios.patch(
				'/api/post/unlike',
				{},
				{
					params: {
						postId: id,
						userId: session?.user.id,
					},
				}
			),
		onSuccess: refetchCallback,
	});

	useEffect(() => {
		if (session) {
			setIsLiked(likes.some((like) => like.userId === session.user.id));
		}
	}, [session, likes]);

	const updateLikes = (event: MouseEvent) => {
		event.stopPropagation();
		event.nativeEvent.preventDefault();

		if (isLiked) {
			unlike.mutate();
		} else {
			like.mutate();
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
					source={image}
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
					<ToolbarButton onClick={updateLikes}>
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
