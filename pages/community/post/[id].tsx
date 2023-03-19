import axios from 'axios';
import BackHistory from 'components/BackHistory/BackHistory';
import CommunityLayout from 'components/layout/CommunityLayout/CommunityLayout';
import Post from 'components/pages/community/Post/Post';
import CreatePostForm from 'components/pages/community/CreatePostForm/CreatePostForm';
import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import Loader from 'styled/elements/Loader';
import { Like, Post as PrismaPost, User } from '@prisma/client';

type PostWithReplies = PrismaPost & {
	postAuthor: User;
	replies: (PrismaPost & {
		replyAuthor: User;
		likes: Like[];
	})[];
	likes: Like[];
};

const PostDetail = () => {
	const { query } = useRouter();
	const {
		data: post,
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ['postWithComments'],
		queryFn: async () =>
			(
				await axios.get<PostWithReplies>('/api/post/get', {
					params: {
						postId: query.id,
					},
				})
			).data,
		enabled: !!query.id,
	});

	if (isLoading) return <Loader />;

	if (isError) return <div />;

	return (
		<>
			<BackHistory text="Post detail" />
			<Post
				{...post}
				image={post.postAuthor.image}
				name={post.postAuthor.name}
				displayName={post.postAuthor.name}
				detailed
				marginInline
				refetchCallback={refetch}
			/>
			<CreatePostForm comment postId={post.id} />
			<div>
				{post.replies.map((reply) => (
					<Post
						key={reply.id}
						{...reply}
						image={reply.replyAuthor.image}
						name={reply.replyAuthor.name}
						displayName={reply.replyAuthor.name}
						marginInline
						isComment
						refetchCallback={refetch}
					/>
				))}
				<NoMoreComments>No more comments.</NoMoreComments>
			</div>
		</>
	);
};

PostDetail.NestedLayout = CommunityLayout;

export default PostDetail;

const NoMoreComments = styled.div`
	padding-block: 40px;
	font-size: 14px;
	text-align: center;
`;
