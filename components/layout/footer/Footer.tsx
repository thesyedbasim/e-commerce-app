import Link from 'next/link';

const Footer: React.FC = () => {
	return (
		<footer className="bg-black px-8 py-6">
			<div className="copyrights-area flex justify-between">
				<p className="text-gray-400">&copy; Copyrights reserved 2022.</p>
				<nav className="flex gap-4 text-gray-400">
					<Link href="/terms-of-use" passHref={true}>
						<a className="hover:text-white">Terms of use</a>
					</Link>
					<Link href="/shipping" passHref={true}>
						<a className="hover:text-white">Shipping</a>
					</Link>
					<Link href="/privacy-policy" passHref={true}>
						<a className="hover:text-white">Privacy policy</a>
					</Link>
				</nav>
				<div className="misc">
					<a
						href="https://github.com/thesyedbasim/e-commerce-app"
						className="text-gray-400 hover:text-white"
					>
						GitHub
					</a>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
