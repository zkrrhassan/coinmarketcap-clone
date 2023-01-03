import type { AppProps } from 'next/app';
import Layout from 'components/layout/Layout/Layout';
// STYLES
import GlobalStyles from 'styled/GlobalStyles';
import 'styled/styles.css';
// FONTAWESOME
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
// REDUX
import { Provider } from 'react-redux';
import store from 'app/store';
import { SessionProvider } from 'next-auth/react';
import { ComponentType, ReactElement } from 'react';
import { NextPage } from 'next/types';
import ThemeProvider from 'src/theme/ThemeProvider';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
	NestedLayout?: ComponentType<{ children: ReactElement }>;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	return (
		<SessionProvider session={pageProps.session}>
			<Provider store={store}>
				<ThemeProvider>
					<GlobalStyles />
					<Layout>
						{Component.NestedLayout ? (
							<Component.NestedLayout>
								<Component {...pageProps} />
							</Component.NestedLayout>
						) : (
							<Component {...pageProps} />
						)}
					</Layout>
				</ThemeProvider>
			</Provider>
		</SessionProvider>
	);
}

export default MyApp;
