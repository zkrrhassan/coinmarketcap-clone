import CommunityLayout from 'components/layout/CommunityLayout/CommunityLayout';
import PostForm from 'components/pages/community/CreatePostForm/CreatePostForm';
import Posts from 'components/pages/community/FeedPosts/FeedPosts';
import { NextPageWithLayout } from 'pages/_app';
import React from 'react';

const Community: NextPageWithLayout = () => {
	return (
		<div>
			<PostForm />
			<Posts />
		</div>
	);
};

Community.NestedLayout = CommunityLayout;

export default Community;
