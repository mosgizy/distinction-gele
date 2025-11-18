import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';

const Reviews = () => {
	return (
		<section id="reviews" className="section-wrapper section-spacer">
			<div className="py-8 max-w-[80ch] mx-auto text-center">
				<h2 className="font-semibold text-[32px] text-center pb-3">Reviews From Our Queens</h2>
				<p>
					Our greatest joy comes from seeing our clients radiate confidence and beauty in their
					Gele. Here’s what some of our amazing clients have to say about their experience with
					<span className="font-bold"> Distinction Gele</span>.
				</p>
			</div>
			<div className="mt-6">
				<Carousel
					opts={{
						align: 'start',
						// loop: true,
						containScroll: 'trimSnaps',
						slidesToScroll: 1,
						skipSnaps: false,
					}}
				>
					<CarouselContent className="items-center">
						{Array.from({ length: 8 }).map((_, index) => (
							<CarouselItem
								key={index}
								className={`${
									index % 2 === 0 && 'bg-primary-100 !text-white'
								} text-primary-100 md:basis-1/3 lg:basis-1/4 2xl:basis-1/5 pl-4 transition-all duration-600 ease-in-out rounded-lg shadow-xl py-4 px-6`}
							>
								<div className="h-full flex flex-col justify-center">
									<span className="font-secular text-5xl">{'"'}</span>
									<p className="text-sm mb-4">
										&quot;Distinction Gele made my special day unforgettable! The Gele was tied
										perfectly, and I received countless compliments. Highly recommend their
										services!&quot;
									</p>
									<h3 className="font-semibold">Amina S.</h3>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition">
						&#8592;
					</CarouselPrevious>
					<CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition">
						&#8594;
					</CarouselNext>
				</Carousel>
			</div>
		</section>
	);
};

export default Reviews;
