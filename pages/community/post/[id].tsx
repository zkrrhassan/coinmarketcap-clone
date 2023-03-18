import { Comment, User } from '@prisma/client';
import axios from 'axios';
import BackHistory from 'components/BackHistory/BackHistory';
import CommunityLayout from 'components/layout/CommunityLayout/CommunityLayout';
import Post from 'components/pages/community/Post/Post';
import CreatePostForm from 'components/pages/community/CreatePostForm/CreatePostForm';
import { PostWithAuthor } from 'components/pages/community/ProfilePosts/ProfilePosts';
import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import Loader from 'styled/elements/Loader';

type CommentWithAuthor = Comment & {
	author: User;
};
type PostWithAuthorAndComments = PostWithAuthor & {
	comments: CommentWithAuthor[];
};

const PostDetail = () => {
	const { query } = useRouter();
	const {
		data: post,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['postWithComments'],
		queryFn: async () =>
			(
				await axios.get<PostWithAuthorAndComments>('/api/post/get', {
					params: {
						postId: query.id,
						withComments: true,
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
				image={post.author.image}
				name={post.author.name}
				displayName={post.author.name}
				detailed
				marginInline
			/>
			<CreatePostForm comment postId={post.id} />
			<div>
				{post.comments.map((comment) => (
					<Post
						key={comment.id}
						image={comment.author.image}
						name={comment.author.name}
						displayName={comment.author.name}
						{...comment}
						marginInline
						isComment
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
