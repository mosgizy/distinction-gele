import { useState } from 'react';
// import { HamburgerIcon } from 'lucide-react';

const Nav = () => {
	const [current, setCurrent] = useState('home');

	const navItems = ['home', 'designs', 'reviews'];

	const scrollToSection = (sectionId: string) => {
		const section = document.getElementById(sectionId);
		if (section) {
			section.scrollIntoView({ behavior: 'smooth' });
		}
		setCurrent(sectionId);
	};

	return (
		<nav className="section-wrapper flex justify-center lg:justify-between items-center py-10 text-primary">
			<h2 className="font-bold font-playfair text-3xl">Distinction Gele</h2>
			{/* <HamburgerIcon className="lg:hidden" /> */}

			<ul className="items-center gap-12 font-medium text-sm capitalize hidden lg:flex">
				{navItems.map((item) => (
					<li
						key={item}
						onClick={() => scrollToSection(item)}
						className={`${
							current === item && '!border-primary'
						} border-b transition-all border-transparent hover:border-primary cursor-pointer`}
					>
						{item}
					</li>
				))}
			</ul>
			<button
				onClick={() => scrollToSection('booking')}
				className="hidden lg:block font-lato font-semibold capitalize text-primary px-8 py-3 rounded-2xl border-2 border-dashed border-primary transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none cursor-pointer"
			>
				Book now shine later
			</button>
		</nav>
	);
};

export default Nav;
