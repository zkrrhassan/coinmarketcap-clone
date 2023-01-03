import CommunityLayout from 'components/layout/CommunityLayout/CommunityLayout';
import EditProfileForm from 'components/pages/community/EditProfileForm/EditProfileForm';
import React from 'react';
import { NextPageWithLayout } from './_app';

const Settings: NextPageWithLayout = () => {
	return (
		<>
			<EditProfileForm />
		</>
	);
};

Settings.NestedLayout = CommunityLayout;

export default Settings;
