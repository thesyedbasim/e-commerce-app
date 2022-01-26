import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.css';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import NavBar from '../components/nav/Navbar';
import { supabase } from '../lib/supabase';
import { setAuthUser } from '../app/store/authSlice';

supabase.auth.onAuthStateChange(() => store.dispatch(setAuthUser));

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Provider store={store}>
			<NavBar />
			<Component {...pageProps} />
		</Provider>
	);
}

export default MyApp;
