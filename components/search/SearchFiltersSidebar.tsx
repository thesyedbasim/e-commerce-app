import Link from 'next/link';
import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import { useRef } from 'react';
import { UrlObject } from 'url';

interface ISiderbarItem {
	text: string;
	link: UrlObject;
}

interface ISidebarSection {
	heading: string;
	items: ISiderbarItem[];
}

const SearchFiltersSidebar: React.FC = () => {
	const sidebarSections = useRef<ISidebarSection[]>([
		{
			heading: 'Relevence',
			items: [
				{ text: 'Low to high', link: { query: { sort: 'price-asc' } } },
				{ text: 'High to low', link: { query: { sort: 'price-desc' } } }
			]
		}
	]);

	return (
		<aside className="space-y-7">
			{sidebarSections.current.map((sidebarSection) => (
				<SidebarSection
					key={sidebarSection.heading}
					sidebarSection={sidebarSection}
				/>
			))}
		</aside>
	);
};

export default SearchFiltersSidebar;

function SidebarSection({
	sidebarSection
}: {
	sidebarSection: ISidebarSection;
}) {
	return (
		<section className="">
			<h3 className="text-xl font-bold mb-3">{sidebarSection.heading}</h3>
			<ul className="">
				{sidebarSection.items.map((sidebarItem) => (
					<SidebarItem key={sidebarItem.text} sidebarItem={sidebarItem} />
				))}
			</ul>
		</section>
	);
}

function SidebarItem({ sidebarItem }: { sidebarItem: ISiderbarItem }) {
	const router = useRouter();

	return (
		<li className="hover:text-gray-500">
			<Link
				href={{
					query: {
						...router.query,
						...(sidebarItem.link.query as ParsedUrlQueryInput)
					}
				}}
			>
				{sidebarItem.text}
			</Link>
			<br />
		</li>
	);
}
