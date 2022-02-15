import { User } from '@supabase/supabase-js';
import axios from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '$lib/supabase';

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

	const [error, setError] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [passwordConfirm, setPasswordConfirm] = useState<string>('');

	const [isFormValid, setIsFormValid] = useState<boolean>(false);

	useEffect(() => {
		setError('');

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

		const { user, error: sbError } = await supabase.auth.signUp({
			email,
			password
		});

		if (sbError) {
			console.error('the error while sign up', sbError);
			setError(sbError.message);
		}

		if (user) router.replace('/');
	};

	return (
		<>
			<div className="d-flex justify-content-center row">
				<div className="card col-10 col-md-6">
					<div className="card-body">
						<h1 className="card-title">Create new account</h1>
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
							<p className="text-danger">{error}</p>
							<input
								type="submit"
								className="btn btn-primary"
								disabled={!isFormValid && !error}
								value="Sign up"
							/>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default Signup;
