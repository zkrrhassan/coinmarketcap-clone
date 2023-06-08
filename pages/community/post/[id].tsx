import BackHistory from 'components/BackHistory/BackHistory';
import CommunityLayout from 'components/layout/CommunityLayout/CommunityLayout';
import Post from 'components/pages/community/Post/Post';
import CreatePostForm from 'components/pages/community/CreatePostForm/CreatePostForm';
import React from 'react';
import styled from 'styled-components';
import Loader from 'styled/elements/Loader';
import usePost from 'hooks/usePost';

const PostDetail = () => {
	const { data: post, isLoading, isError, refetch } = usePost();

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
				refetchCallback={refetch}
			/>
			<CreatePostForm comment postId={post.id} />
			<div>
				{post.replies.map((reply) => (
					<Post
						key={reply.id}
						{...reply}
						image={reply.author.image}
						name={reply.author.name}
						displayName={reply.author.name}
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
