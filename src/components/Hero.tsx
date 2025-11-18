import { useEffect, useState } from 'react';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi,
} from '@/components/ui/carousel';
import SplitText from './SplitText';

const Hero = () => {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		if (!api) {
			return;
		}

		setCurrent(api.selectedScrollSnap() + 1);
		api.on('select', () => {
			setCurrent(api.selectedScrollSnap() + 1);
		});
	}, [api]);

	return (
		<header id="home" className="section-wrapper section-spacer px-6 lg:px-10">
			<div className="flex flex-col items-center gap-6 ">
				<SplitText
					text="Crowning Beauty, One Gele at a Time"
					className="font-bold font-playfair text-primary text-4xl uppercase"
					delay={100}
					duration={0.3}
					ease="power3.out"
					splitType="chars"
					from={{ opacity: 0, y: 40 }}
					to={{ opacity: 1, y: 0 }}
					threshold={0.1}
					rootMargin="-100px"
					textAlign="center"
					tag="h1"
				/>
				<p className="max-w-xl mx-auto text-center text-sm">
					Elevate your look with Distinction Gele artistry that blends tradition, style, and
					confidence. Perfectly tied for weddings, photoshoots, and every special moment
				</p>
				<div className="w-full mt-6">
					<Carousel
						setApi={setApi}
						opts={{
							align: 'start',
						}}
					>
						<CarouselContent className="items-center h-[36rem]">
							{Array.from({ length: 8 }).map((_, index) => (
								<CarouselItem
									key={index}
									className={`${current + 1 === index && 'w-[368px] h-[544px]'} ${
										current === index && 'w-[221px] h-[300px]'
									} ${
										current + 2 === index && 'w-[221px] h-[300px]'
									} md:basis-1/3 lg:basis-1/5 pl-4 transition-all duration-600 ease-in-out`}
								>
									<div className="">
										<img
											src="/images/gele.avif"
											alt="gele1"
											className={`h-full w-full object-contain`}
										/>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className="hidden md:grid place-items-center" />
						<CarouselNext className="hidden md:grid place-items-center" />
					</Carousel>
				</div>
			</div>
		</header>
	);
};

export default Hero;
