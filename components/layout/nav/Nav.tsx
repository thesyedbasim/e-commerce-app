import { useEffect, useState } from 'react';
import styles from './Nav.module.scss';
import { supabase } from '$lib/supabase';
import { Cart } from '$lib/types/cart';
import {
	getCartItemsFetchStatus,
	getNumOfItemsInCart,
	setCartItems,
	setCartItemsFetchStatus
} from '$store/cartSlice';
import { useAppDispatch, useAppSelector } from 'lib/hooks';
import classNames from 'classnames';
import Link from 'next/link';
import SearchBar from '@components/search/SearchBar';
import CartIcon from '@icons/Cart';
import ProfileIcon from '@icons/Profile';
import WishlistIcon from '@icons/Wishlist';
import OrderIcon from '@components/icons/Order';

const Navbar: React.FC = () => {
	const dispatch = useAppDispatch();

	const numOfItemsInCart = useAppSelector(getNumOfItemsInCart);
	const cartItemsFetchStatus = useAppSelector(getCartItemsFetchStatus);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);

	let user = supabase.auth.user();

	useEffect(() => {
		if (!user) setIsUserLoggedIn(false);
		else setIsUserLoggedIn(true);
	}, [user]);

	const fetchAndSetCartItems = async () => {
		if (!user) {
			const cartItems = JSON.parse(
				localStorage.getItem('cart') || JSON.stringify([])
			) as Cart[];

			dispatch(setCartItems(cartItems as Cart[]));
			dispatch(setCartItemsFetchStatus('FETCHED'));

			return;
		}

		setIsLoading(true);

		const { data, error: sbError } = await supabase
			.from('cart')
			.select('*, product (id, name, price)')
			.eq('user', user.id);

		setIsLoading(false);

		if (sbError) {
			console.error('error while reading cart', sbError);
			setError('There was some error fetching cart items.');

			return;
		}

		dispatch(setCartItems(data as Cart[]));
		dispatch(setCartItemsFetchStatus('FETCHED'));
	};

	useEffect(() => {
		if (cartItemsFetchStatus === 'FETCHED') return;

		fetchAndSetCartItems();
	}, []);

	return (
		<>
			<nav className={classNames(styles['nav-bar'])}>
				<div className={classNames(styles['nav-content'])}>
					<div className="nav-links">
						<ul className={classNames(styles['nav-links-container'])}>
							<li className="mx-4">
								<Link href="/" passHref={true}>
									<a className="nav-link hover:text-gray-400">Home</a>
								</Link>
							</li>
							<li className="mx-4">
								<Link href="/search/featured" passHref={true}>
									<a className="nav-link hover:text-gray-400">Featured</a>
								</Link>
							</li>
							<li className="mx-4">
								<Link href="/search/new-arrivals" passHref={true}>
									<a className="nav-link hover:text-gray-400">New Arrivals</a>
								</Link>
							</li>
						</ul>
					</div>
					<SearchBar />
					<div className="nav-icons">
						<nav className="options-nav">
							<ul className="flex">
								<li className="mx-4 text-white hover:scale-110 active:scale-95 cursor-pointer">
									<Link href="/cart" passHref>
										<div className="relative">
											{numOfItemsInCart ? (
												<div className="item-counter absolute flex items-center justify-center p-2 -top-1.5 -right-1.5 bg-white text-black w-4 h-4 rounded-full font-semibold text-xs">
													{numOfItemsInCart}
												</div>
											) : null}
											<CartIcon cartItemsCount={numOfItemsInCart} />
										</div>
									</Link>
								</li>
								{isUserLoggedIn && (
									<li className="mx-4 text-white hover:scale-110 active:scale-95 cursor-pointer">
										<Link href="/cart" passHref>
											<div className="relative">
												<OrderIcon />
											</div>
										</Link>
									</li>
								)}
								{isUserLoggedIn && (
									<li className="mx-4 text-white hover:scale-110 active:scale-95 cursor-pointer">
										<Link href="/wishlist" passHref>
											<div className="">
												<WishlistIcon />
											</div>
										</Link>
									</li>
								)}
								{isUserLoggedIn && (
									<li className="mx-4 text-white hover:scale-110 active:scale-95 cursor-pointer">
										<ProfileIcon />
									</li>
								)}
								{!isUserLoggedIn && (
									<li className="mx-4">
										<Link href="/login" passHref={true}>
											<a className="nav-link hover:text-gray-400">Login</a>
										</Link>
									</li>
								)}
							</ul>
						</nav>
					</div>
				</div>
			</nav>
		</>
	);
};

export default Navbar;
