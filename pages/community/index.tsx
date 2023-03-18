import CommunityLayout from 'components/layout/CommunityLayout/CommunityLayout';
import CreatePostForm from 'components/pages/community/CreatePostForm/CreatePostForm';
import Posts from 'components/pages/community/FeedPosts/FeedPosts';
import { NextPageWithLayout } from 'pages/_app';
import React from 'react';

const Community: NextPageWithLayout = () => {
	return (
		<div>
			<CreatePostForm />
			<Posts />
		</div>
	);
};

Community.NestedLayout = CommunityLayout;

export default Community;
