import { supabase } from '$lib/supabase';
import { Cart } from '$lib/types/cart';
import {
	getCartItemsFetchStatus,
	getNumOfItemsInCart,
	setCartItems,
	setCartItemsFetchStatus
} from '$store/cartSlice';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import classNames from 'classnames';
import Search from 'components/misc/Search';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import CartIcon from './nav-icons/Cart';
import NavIconItem from './nav-icons/NavIconItem';
import ProfileIcon from './nav-icons/Profile';
import WishlistIcon from './nav-icons/Wishlist';

import styles from './Nav.module.scss';

const Navbar: React.FC = () => {
	const dispatch = useAppDispatch();

	const numOfItemsInCart = useAppSelector(getNumOfItemsInCart);
	const cartItemsFetchStatus = useAppSelector(getCartItemsFetchStatus);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	let user = supabase.auth.user();

	const fetchAndSetCartItems = async () => {
		console.log('fetching from db');

		if (!user) return;

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
									<a className="nav-link hover:text-white">Home</a>
								</Link>
							</li>
							<li className="mx-4">
								<Link href="/search/featured" passHref={true}>
									<a className="nav-link hover:text-white">Featured</a>
								</Link>
							</li>
							<li className="mx-4">
								<Link href="/search/new-arrivals" passHref={true}>
									<a className="nav-link hover:text-white">New Arrivals</a>
								</Link>
							</li>
						</ul>
					</div>
					<Search />
					<div className="nav-icons">
						<nav className="options-nav">
							<ul className="flex">
								<NavIconItem>
									<CartIcon cartItemsCount={numOfItemsInCart} />
								</NavIconItem>
								<NavIconItem>
									<WishlistIcon />
								</NavIconItem>
								<NavIconItem>
									<ProfileIcon />
								</NavIconItem>
							</ul>
						</nav>
					</div>
				</div>
			</nav>
		</>
	);
};

export default Navbar;
