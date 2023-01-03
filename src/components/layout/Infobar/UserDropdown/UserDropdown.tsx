import React from 'react';
import Link from 'next/link';
import { Button } from 'styled/elements/Button';
import { useAppDispatch } from 'hooks/redux';
import { changeAuthOpen } from 'app/slices/menuSlice';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import ProfileImage from 'components/ProfileImage/ProfileImage';
import {
	UserDropdownWrapper,
	ButtonsWrapper,
	UserMenuWrapper,
	UserMenuDropdown,
	UserMenu,
	UserPreview,
	UserName,
	UserEmail,
	UserMenuItem,
	ImageWrapper,
} from './UserDropdown.styled';

const UserDropdown = () => {
	const dispatch = useAppDispatch();
	const { data, status } = useSession();

	const openSignUp = () => {
		dispatch(changeAuthOpen('signup'));
	};
	const openLogIn = () => {
		dispatch(changeAuthOpen('login'));
	};

	const handleLogOut = () => {
		signOut({
			redirect: false,
		});
	};

	return (
		<UserDropdownWrapper>
			{status === 'unauthenticated' && (
				<ButtonsWrapper>
					<Button outlined onClick={openLogIn}>
						Log in
					</Button>
					<Button onClick={openSignUp}>Sign up</Button>
				</ButtonsWrapper>
			)}
			{status === 'authenticated' && data && (
				<UserMenuWrapper>
					<ImageWrapper>
						<ProfileImage
							source={data.user.image && `/uploads/${data.user.image}.jpeg`}
							firstLetter={data.user.name.charAt(0)}
							width={28}
							height={28}
							variant="small"
						/>
					</ImageWrapper>
					<UserMenuDropdown>
						<UserMenu>
							<Link href={`/community/profile/${data.user.name}`}>
								<a>
									<UserPreview>
										<ProfileImage
											source={
												data.user.image && `/uploads/${data.user.image}.jpeg`
											}
											firstLetter={data.user.name.charAt(0)}
											width={64}
											height={64}
											variant="medium"
										/>
										<div>
											<UserName>Hi, {data.user?.name}</UserName>
											<UserEmail>{data.user?.email}</UserEmail>
										</div>
									</UserPreview>
								</a>
							</Link>
							<div>
								<Link href="/watchlist">
									<a>
										<UserMenuItem>Watchlist</UserMenuItem>
									</a>
								</Link>
								<Link href={`/community/profile/${data.user.name}`}>
									<a>
										<UserMenuItem>My Profile</UserMenuItem>
									</a>
								</Link>
								<Link href="/settings">
									<a>
										<UserMenuItem>Settings</UserMenuItem>
									</a>
								</Link>
								<UserMenuItem as="button" onClick={handleLogOut}>
									Log out
								</UserMenuItem>
							</div>
						</UserMenu>
					</UserMenuDropdown>
				</UserMenuWrapper>
			)}
		</UserDropdownWrapper>
	);
};

export default UserDropdown;
