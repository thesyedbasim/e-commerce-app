import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { User } from '@supabase/supabase-js';
import axios from 'axios';
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
			<div className="h-screen flex justify-center items-start pt-36">
				<div className="grid gap-8">
					<h1 className="text-2xl font-bold">Create new account</h1>
					<div className="">
						<form
							className="form"
							onSubmit={(e) => {
								e.preventDefault();
								signUpUser();
							}}
						>
							<div className="grid gap-3">
								<div className="flex flex-col">
									<label htmlFor="email">Email</label>
									<input
										className="bg-gray-100 w-72 py-1 px-2 focus:outline-none focus:border-black"
										id="email"
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>
								<div className="flex flex-col">
									<label htmlFor="password">Password</label>
									<input
										className="bg-gray-100 w-72 py-1 px-2 focus:outline-none focus:border-black"
										id="password"
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
								</div>
								<div className="flex flex-col">
									<label htmlFor="password">Confirm password</label>
									<input
										className="bg-gray-100 w-72 py-1 px-2 focus:outline-none focus:border-black"
										id="passwordConfirm"
										type="password"
										value={passwordConfirm}
										onChange={(e) => setPasswordConfirm(e.target.value)}
									/>
								</div>
								<p className="">{error}</p>
								<input
									type="submit"
									className="py-2 px-8 w-36 cursor-pointer font-semibold uppercase bg-black hover:bg-gray-800 text-white text-sm"
									disabled={!isFormValid && !!error}
									value="Sign up"
								/>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default Signup;
