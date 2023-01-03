import BackHistory from 'components/BackHistory/BackHistory';
import CommunityLayout from 'components/layout/CommunityLayout/CommunityLayout';
import EditProfileForm from 'components/pages/community/EditProfileForm/EditProfileForm';
import { NextPageWithLayout } from 'pages/_app';
import React from 'react';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next/types';

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

const EditProfile: NextPageWithLayout = () => {
	return (
		<>
			<BackHistory text="Edit My Profile" />
			<EditProfileForm />
		</>
	);
};

EditProfile.NestedLayout = CommunityLayout;

export default EditProfile;
