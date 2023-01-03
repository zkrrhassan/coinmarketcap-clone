import { Comment, User } from '@prisma/client';
import axios from 'axios';
import BackHistory from 'components/BackHistory/BackHistory';
import CommunityLayout from 'components/layout/CommunityLayout/CommunityLayout';
import Post from 'components/pages/community/Post/Post';
import PostForm from 'components/pages/community/CreatePostForm/CreatePostForm';
import { PostWithAuthor } from 'components/pages/community/ProfilePosts/ProfilePosts';
import { GetServerSideProps } from 'next';
import { NextPageWithLayout } from 'pages/_app';
import React from 'react';
import styled from 'styled-components';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const { id } = query;

	const post = (
		await axios.get('http://localhost:3000/api/post/get', {
			params: {
				postId: id,
				withComments: true,
			},
		})
	).data;

	return {
		props: {
			post,
		},
	};
};
type CommentWithAuthor = Comment & {
	author: User;
};
type PostWithAuthorAndComments = PostWithAuthor & {
	comments: CommentWithAuthor[];
};

const PostDetail: NextPageWithLayout<{ post: PostWithAuthorAndComments }> = ({
	post,
}) => {
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
			<PostForm comment postId={post.id} />
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
