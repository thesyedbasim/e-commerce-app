import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getAuthUser, setAuthUser } from '../../store/authSlice';
import { getNumOfItemsInCart } from '../../store/cartSlice';
import { supabase } from '$lib/supabase';
import Search from '../misc/Search';

const Navbar: React.FC = () => {
	const dispatch = useAppDispatch();

	const authUser = useAppSelector(getAuthUser);
	const numOfItemsInCart = useAppSelector(getNumOfItemsInCart);

	supabase.auth.onAuthStateChange(() =>
		dispatch(setAuthUser(supabase.auth.user()))
	);

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<div className="container-fluid">
				<Link href="/">
					<a className="navbar-brand">Amazon clone</a>
				</Link>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarSupportedContent"
					aria-controls="navbarSupportedContent"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon" />
				</button>
				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						{authUser ? (
							<>
								<li className="nav-item">
									<Link href="/signout">
										<a className="btn nav-link">Sign out</a>
									</Link>
								</li>
								<li className="nav-item">
									<Link href="/orders">
										<a className="nav-link">My orders</a>
									</Link>
								</li>
							</>
						) : (
							<>
								<li className="nav-item">
									<Link href="/login">
										<a className="nav-link">Login</a>
									</Link>
								</li>
								<li className="nav-item">
									<Link href="/signup">
										<a className="nav-link">Sign up</a>
									</Link>
								</li>
							</>
						)}
					</ul>
					{authUser && (
						<Link href="/cart">
							<a className="nav-link">cart: {numOfItemsInCart}</a>
						</Link>
					)}
					<Search />
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
