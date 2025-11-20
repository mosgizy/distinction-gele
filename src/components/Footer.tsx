import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faTiktok, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
	const navItems = ['home', 'designs', 'reviews'];
	const scrollToSection = (sectionId: string) => {
		const section = document.getElementById(sectionId);
		if (section) {
			section.scrollIntoView({ behavior: 'smooth' });
		}
	};

	return (
		<footer className="bg-primary-300 text-white mt-24">
			<div className="section-wrapper section-spacer pb-6 mb-8 border-b border-primary">
				<div className="flex flex-col items-center justify-center gap-8">
					<h2 className="font-bold font-playfair text-3xl">Distinction Gele</h2>
					<ul className="flex items-center gap-6 capitalize">
						{navItems.map((item) => (
							<li
								key={item}
								onClick={() => scrollToSection(item)}
								className="cursor-pointer hover:underline"
							>
								{item}
							</li>
						))}
					</ul>
					<div>
						<ul className="flex items-center gap-6 mb-3">
							<li>
								<a
									href="https://www.instagram.com/distinctiongele?igsh=bHVuNGd2cnJoeXc2"
									target="_blank"
									rel="noopener noreferrer"
								>
									<FontAwesomeIcon icon={faInstagram} className="text-white text-2xl" />
								</a>
							</li>
							<li>
								<a href="">
									<FontAwesomeIcon icon={faFacebook} className="text-white text-2xl" />
								</a>
							</li>
							<li>
								<a
									href="https://www.tiktok.com/@distinctiongele?_r=1&_t=ZS-91Woz5PCZe5"
									target="_blank"
									rel="noopener noreferrer"
								>
									<FontAwesomeIcon icon={faTiktok} className="text-white text-2xl" />
								</a>
							</li>
							<li>
								<a href="https://wa.me/+2348096587253" target="_blank" rel="noopener noreferrer">
									<FontAwesomeIcon icon={faWhatsapp} className="text-white text-2xl" />
								</a>
							</li>
						</ul>
						<div className="text-center">Contact: 08096587253</div>
					</div>
				</div>
			</div>
			<p className="text-sm text-center pb-3">
				&copy; {new Date().getFullYear()} Distinction Gele. All rights reserved.
			</p>
		</footer>
	);
};

export default Footer;
