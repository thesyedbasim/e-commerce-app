import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.css';
import { Provider } from 'react-redux';
import { store } from '../store';
import NavBar from '../components/nav/Navbar';
import { supabase } from '$lib/supabase';
import { setAuthUser } from '../store/authSlice';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';

supabase.auth.onAuthStateChange(() => store.dispatch(setAuthUser));

export type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & { Component: NextPageWithLayout };

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout = Component.getLayout ?? ((page) => page);

	return getLayout(
		<Provider store={store}>
			<NavBar />
			<div className="container-fluid">
				<Component {...pageProps} />
			</div>
		</Provider>
	);
}

export default MyApp;
