import React, { FC, PropsWithChildren } from 'react';
import Footer from 'components/layout/Footer/Footer';
import MobileMenu from 'components/layout/MobileMenu/MobileMenu';
import LoginSignup from 'components/LoginSignup/LoginSignup';
import { Toaster } from 'react-hot-toast';
import { Main, HeaderWrapper } from './Layout.styled';
import Navbar from '../Navbar/Navbar';
import Infobar from '../Infobar/Infobar';

const Layout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<>
			<HeaderWrapper>
				<Navbar />
				<Infobar />
			</HeaderWrapper>
			<Main>
				<Toaster position="top-center" />
				{children}
			</Main>
			<Footer />
			<MobileMenu />
			<LoginSignup />
		</>
	);
};

export default Layout;
