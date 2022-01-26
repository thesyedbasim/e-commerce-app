import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const Login: NextPage = () => {
	const router = useRouter();

	useEffect(() => {
		const user = supabase.auth.user();
		if (user) router.replace('/');
	}, []);

	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const [isFormValid, setIsFormValid] = useState<boolean>(false);

	useEffect(() => {
		if (!email.trim() || !password.trim()) setIsFormValid(false);
		else setIsFormValid(true);
	}, [email, password]);

	const loginUser = async () => {
		if (!isFormValid) return;

		const { user } = await supabase.auth.signIn({ email, password });

		if (user) router.replace('/cart');
	};

	return (
		<>
			<h1>Login</h1>
			<form
				className="form"
				onSubmit={(e) => {
					e.preventDefault();
					loginUser();
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
				<input
					type="submit"
					className="btn btn-primary"
					disabled={!isFormValid}
					value="Login"
				/>
			</form>
		</>
	);
};

export default Login;
