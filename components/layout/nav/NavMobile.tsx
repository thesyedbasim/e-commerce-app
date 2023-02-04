import Link from 'next/link';

import SearchBar from '@components/search/SearchBar';
import CartIcon from '@icons/Cart';
import { useState } from 'react';

const NavMobile: React.FC<{
	numOfItemsInCart: number;
	isUserLoggedIn: boolean;
}> = ({ numOfItemsInCart, isUserLoggedIn }) => {
	const [isNavOpen, setIsNavOpen] = useState<boolean>(false);

	return (
		<nav className="relative bg-black text-white px-12 py-4 text-lg">
			<div className="grid grid-cols-[1fr] grid-flow-col auto-cols-min gap-x-10 items-center">
				<SearchBar />

				<Link
					href="/cart"
					onClick={() => setIsNavOpen(false)}
					className="mx-4 text-white hover:scale-110 active:scale-95 cursor-pointer"
					passHref
				>
					<div className="relative">
						{numOfItemsInCart ? (
							<div className="item-counter absolute flex items-center justify-center p-2 -top-1.5 -right-1.5 bg-white text-black w-4 h-4 rounded-full font-semibold text-xs">
								{numOfItemsInCart}
							</div>
						) : null}
						<CartIcon cartItemsCount={numOfItemsInCart} />
					</div>
				</Link>

				<svg
					xmlns="http://www.w3.org/2000/svg"
					className={`w-6 justify-self-end ${isNavOpen ? 'hidden' : 'block'}`}
					viewBox="0 0 512 512"
					onClick={() => setIsNavOpen(true)}
				>
					<title>Menu</title>
					<path
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeMiterlimit="10"
						strokeWidth="32"
						d="M80 160h352M80 256h352M80 352h352"
					/>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className={`w-6 justify-self-end ${isNavOpen ? 'block' : 'hidden'}`}
					viewBox="0 0 512 512"
					onClick={() => setIsNavOpen(false)}
				>
					<title>Close</title>
					<path
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="32"
						d="M368 368L144 144M368 144L144 368"
					/>
				</svg>
			</div>
			<div className={`my-16 ${isNavOpen ? 'block' : 'hidden'}`}>
				<ul className="text-xl grid grid-cols-1 auto-rows-max justify-items-center gap-y-5">
					<li className="mx-4" onClick={() => setIsNavOpen(false)}>
						<Link href="/" className="nav-link hover:text-gray-400">
							Home
						</Link>
					</li>
					<li className="mx-4" onClick={() => setIsNavOpen(false)}>
						<Link
							href="/search/featured"
							className="nav-link hover:text-gray-400"
						>
							Featured
						</Link>
					</li>
					<li className="mx-4" onClick={() => setIsNavOpen(false)}>
						<Link
							href="/search/new-arrivals"
							className="nav-link hover:text-gray-400"
						>
							New Arrivals
						</Link>
					</li>
					{isUserLoggedIn && (
						<li className="mx-4" onClick={() => setIsNavOpen(false)}>
							<Link href="/orders">Orders</Link>
						</li>
					)}
					{isUserLoggedIn && (
						<li className="mx-4" onClick={() => setIsNavOpen(false)}>
							<Link href="/wishlist">Wishlist</Link>
						</li>
					)}
					{isUserLoggedIn && (
						<li className="mx-4" onClick={() => setIsNavOpen(false)}>
							<Link href="/profile">Profile</Link>
						</li>
					)}
					{!isUserLoggedIn && (
						<li className="mx-4" onClick={() => setIsNavOpen(false)}>
							<Link href="/login">Login</Link>
						</li>
					)}
				</ul>
			</div>
		</nav>
	);
};

export default NavMobile;
