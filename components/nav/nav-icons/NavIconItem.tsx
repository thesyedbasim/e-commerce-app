const NavIconItem: React.FC = ({ children }) => {
	return (
		<li className="mx-4 text-white hover:scale-110 active:scale-95 cursor-pointer">
			{children}
		</li>
	);
};

export default NavIconItem;
