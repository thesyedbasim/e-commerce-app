import type { NextPage, GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const user = await supabase.auth.api.getUserByCookie(req);
	console.log('user', user);

	if (user)
		return {
			redirect: {
				destination: '/cart',
				permanent: false
			}
		};

	return { props: {} };
};

const Signup: NextPage = () => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [passwordConfirm, setPasswordConfirm] = useState<string>('');

	const [isFormValid, setIsFormValid] = useState<boolean>(false);

	useEffect(() => {
		if (
			(!email.trim() || !password.trim() || passwordConfirm.trim()) &&
			password.trim() !== passwordConfirm.trim()
		)
			setIsFormValid(false);
		else setIsFormValid(true);
	}, [email, password, passwordConfirm]);

	const signupUser = () => {
		if (!isFormValid) return;

		supabase.auth.signUp({ email, password });
	};

	return (
		<>
			<h1>Sign up</h1>
			<form
				className="form"
				onSubmit={(e) => {
					e.preventDefault();
					signupUser();
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
					value="Sign up"
					disabled={!isFormValid}
				/>
			</form>
		</>
	);
};

export default Signup;
