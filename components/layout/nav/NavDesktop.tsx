import Link from 'next/link';
import classNames from 'classnames';
import styles from './Nav.module.scss';

import SearchBar from '@components/search/SearchBar';
import CartIcon from '@icons/Cart';
import ProfileIcon from '@icons/Profile';
import WishlistIcon from '@icons/Wishlist';
import OrderIcon from '@components/icons/Order';

const NavDesktop: React.FC<{
	numOfItemsInCart: number;
	isUserLoggedIn: boolean;
}> = ({ numOfItemsInCart, isUserLoggedIn }) => {
	return (
		<nav className={classNames(styles['nav-bar'])}>
			<div className={classNames(styles['nav-content'])}>
				<div className="nav-links">
					<ul className={classNames(styles['nav-links-container'])}>
						<li className="mx-4">
							<Link
								href="/"
								passHref={true}
								className="nav-link hover:text-gray-400"
							>
								Home
							</Link>
						</li>
						<li className="mx-4">
							<Link
								href="/search/featured"
								passHref={true}
								className="nav-link hover:text-gray-400"
							>
								Featured
							</Link>
						</li>
						<li className="mx-4">
							<Link
								href="/search/new-arrivals"
								passHref={true}
								className="nav-link hover:text-gray-400"
							>
								New Arrivals
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
									<Link href="/orders" passHref>
										<OrderIcon />
									</Link>
								</li>
							)}
							{isUserLoggedIn && (
								<li className="mx-4 text-white hover:scale-110 active:scale-95 cursor-pointer">
									<Link href="/wishlist" passHref>
										<WishlistIcon />
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
										Login
									</Link>
								</li>
							)}
						</ul>
					</nav>
				</div>
			</div>
		</nav>
	);
};

export default NavDesktop;
