import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from '../store';
import { supabase } from '$lib/supabase';
import { setAuthUser } from '../store/authSlice';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';
import NavBar from '@components/layout/nav/Nav';
import Footer from '@components/layout/footer/Footer';

supabase.auth.onAuthStateChange(() => store.dispatch(setAuthUser));

export type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & { Component: NextPageWithLayout };

const queryClient = new QueryClient({
	defaultOptions: {
		queries: { refetchOnWindowFocus: false, refetchOnMount: false }
	}
});

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout = Component.getLayout ?? ((page) => page);

	return getLayout(
		<QueryClientProvider client={queryClient}>
			<Provider store={store}>
				<NavBar />
				<div className="px-10 md:px-24 py-14">
					<Component {...pageProps} />
				</div>
				<Footer />
			</Provider>
		</QueryClientProvider>
	);
}

export default MyApp;
