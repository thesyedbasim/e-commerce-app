import { useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { supabase } from '$lib/supabase';

const Signout: NextPage = () => {
	const router = useRouter();

	useEffect(() => {
		(async () => {
			supabase.auth.signOut();
			router.replace('/');
		})();
	}, []);

	return <p>signing out...</p>;
};

export default Signout;
