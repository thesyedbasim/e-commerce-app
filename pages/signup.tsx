import { User } from '@supabase/supabase-js';
import axios from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const Signup: NextPage = () => {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(supabase.auth.user());

	supabase.auth.onAuthStateChange((event) => {
		setUser(supabase.auth.user());

		axios.post('/api/set-supabase-cookie', {
			event,
			session: supabase.auth.session()
		});
	});

	useEffect(() => {
		if (supabase.auth.user()) router.replace('/');
	}, []);

	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [passwordConfirm, setPasswordConfirm] = useState<string>('');

	const [isFormValid, setIsFormValid] = useState<boolean>(false);

	useEffect(() => {
		if (
			password !== passwordConfirm ||
			!email.trim() ||
			!password.trim() ||
			!passwordConfirm.trim()
		)
			setIsFormValid(false);
		else setIsFormValid(true);
	}, [email, password, passwordConfirm]);

	const signUpUser = async () => {
		if (!isFormValid) return;

		const { user, error } = await supabase.auth.signUp({ email, password });

		if (error) console.error('the error while sign up', error);

		if (user) router.replace('/');
	};

	return (
		<>
			<h1>Create new account</h1>
			<form
				className="form"
				onSubmit={(e) => {
					e.preventDefault();
					signUpUser();
				}}
			>
				<div className="form-group">
					<label htmlFor="email">Email</label>
					<input
						className="form-control"
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						className="form-control"
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password-confirm">Confirm Password</label>
					<input
						className="form-control"
						id="password-confirm"
						type="password"
						value={passwordConfirm}
						onChange={(e) => setPasswordConfirm(e.target.value)}
					/>
				</div>
				<input
					type="submit"
					className="btn btn-primary"
					disabled={!isFormValid}
					value="Sign up"
				/>
			</form>
		</>
	);
};

export default Signup;
