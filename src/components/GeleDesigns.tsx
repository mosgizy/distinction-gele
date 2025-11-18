import BounceCards from './BounceCards';
import TiltedCard from './TiltedCard';

const images = [
	'/images/gele-1.avif',
	'/images/gele-2.avif',
	'/images/gele-2.avif',
	'/images/gele-2.avif',
	'/images/gele-2.avif',
	'/images/gele-2.avif',
	'/images/gele-2.avif',
];

const transformStyles = [
	'rotate(8deg) translate(-280px)',
	'rotate(5deg) translate(-150px)',
	'rotate(0deg) translate(-70px)',
	'rotate(-5deg)',
	'rotate(5deg) translate(70px)',
	'rotate(-5deg) translate(150px)',
	'rotate(-8deg) translate(280px)',
];

const GeleDesigns = () => {
	return (
		<section id="designs" className="section-wrapper section-spacer">
			<div className="py-8 max-w-[80ch] mx-auto text-center">
				<h2 className="font-semibold text-[32px] pb-3">Our Gele Designs</h2>
				<p>
					Every Gele tells a story — of grace, strength, and heritage. Explore our collection of
					beautifully crafted Gele styles, each tied with precision and passion to complement every
					woman’s unique beauty. From bold statement pieces to subtle, elegant wraps, each design
					celebrates culture through creativity.
				</p>
			</div>
			<section>
				<div className="hidden lg:flex mt-24 justify-center">
					<BounceCards
						className="custom-bounceCards"
						images={images}
						containerWidth={500}
						containerHeight={250}
						animationDelay={1}
						animationStagger={0.08}
						easeType="elastic.out(1, 0.5)"
						transformStyles={transformStyles}
						enableHover={true}
					/>
				</div>
				<div className="flex flex-wrap justify-center gap-5 mt-16 lg:hidden">
					{images.map((src, index) => {
						return (
							<TiltedCard
								key={index}
								imageSrc={src}
								altText="Gele Design"
								captionText="Gele"
								containerHeight="300px"
								containerWidth="300px"
								imageHeight="300px"
								imageWidth="300px"
								rotateAmplitude={12}
								scaleOnHover={1.2}
								showMobileWarning={false}
								showTooltip={true}
								displayOverlayContent={true}
							/>
						);
					})}
				</div>
			</section>
		</section>
	);
};

export default GeleDesigns;
