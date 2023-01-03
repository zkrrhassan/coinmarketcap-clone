import CommunityLayout from 'components/layout/CommunityLayout/CommunityLayout';
import ProfileInfo from 'components/pages/community/ProfileInfo/ProfileInfo';
import ProfilePosts from 'components/pages/community/ProfilePosts/ProfilePosts';
import { NextPageWithLayout } from 'pages/_app';

const Profile: NextPageWithLayout = () => {
	return (
		<div style={{ padding: '24px' }}>
			<ProfileInfo />
			<ProfilePosts />
		</div>
	);
};

Profile.NestedLayout = CommunityLayout;

export default Profile;
