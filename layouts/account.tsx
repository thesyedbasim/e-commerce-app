import { ReactElement } from 'react';
import Link from 'next/link';

const AccountPageLayout = (page: ReactElement) => {
	return (
		<>
			{page}
			<nav className="nav nav-pills flex-column flex-sm-row">
				<Link href="/account/orders">
					<a className="flex-sm-fill text-sm-center nav-link active">Orders</a>
				</Link>
				<Link href="/account/not shipped">
					<a className="flex-sm-fill text-sm-center nav-link" href="#">
						Longer nav link
					</a>
				</Link>
				<a className="flex-sm-fill text-sm-center nav-link" href="#">
					Link
				</a>
				<a className="flex-sm-fill text-sm-center nav-link disabled">
					Disabled
				</a>
			</nav>
		</>
	);
};

export default AccountPageLayout;
