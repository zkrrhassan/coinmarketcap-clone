import CommunityLayout from 'components/layout/CommunityLayout/CommunityLayout';
import EditProfileForm from 'components/pages/community/EditProfileForm/EditProfileForm';
import React from 'react';
import { NextPageWithLayout } from './_app';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);

	if (!session) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	return {
		props: {},
	};
};

const Settings: NextPageWithLayout = () => {
	return (
		<>
			<EditProfileForm />
		</>
	);
};

Settings.NestedLayout = CommunityLayout;

export default Settings;
