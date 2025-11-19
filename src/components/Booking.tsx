import React, { useState, useEffect } from 'react';
import { Clock, User, Mail, Phone, CheckCircle, LocateIcon } from 'lucide-react';
import { fetchBookings } from '@/lib/fetchBookings';
import type { Booking, BookingData, BusinessHours, Service, TimeSlot } from '@/lib/interface';
import { postBooking } from '@/lib/postBookings';
import emailjs from '@emailjs/browser';

type Step = 'datetime' | 'details' | 'confirmation';

export default function Booking(): React.JSX.Element {
	const [currentStep, setCurrentStep] = useState<Step>('datetime');
	const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
	const [bookings, setBookings] = useState<Booking[]>([]);

	const [bookingData, setBookingData] = useState<BookingData>({
		date: '',
		timeSlot: '',
		name: '',
		email: '',
		phone: '',
		notes: '',
		address: '',
	});

	const service: Service = {
		id: 'gele-session',
		name: 'gele session',
		duration: 180,
		price: 'negotiable',
	};

	const businessHours: BusinessHours = {
		start: 6,
		end: 22,
		interval: 60,
	};

	useEffect(() => {
		if (bookingData.date) {
			generateAvailableSlots();
		}
	}, [bookingData.date]);

	useEffect(() => {
		const loadBookings = async () => {
			const fetchedBookings: Booking[] = await fetchBookings();
			setBookings(fetchedBookings);
		};
		loadBookings();
	}, []);

	const generateAvailableSlots = (): void => {
		const slots: TimeSlot[] = [];
		const selectedDate = new Date(bookingData.date);

		for (let hour = businessHours.start; hour < businessHours.end; hour++) {
			for (let min = 0; min < 60; min += businessHours.interval) {
				const slotTime = new Date(selectedDate);
				slotTime.setHours(hour, min, 0, 0);

				const endTime = new Date(slotTime);
				endTime.setMinutes(endTime.getMinutes() + service.duration);

				if (endTime.getHours() <= businessHours.end) {
					const isBooked = bookings.some((booking: Booking) => {
						const bookingStart = new Date(booking.startTime);
						return bookingStart.getTime() === slotTime.getTime();
					});

					slots.push({
						time: slotTime.toISOString(),
						label: slotTime.toLocaleTimeString('en-US', {
							hour: 'numeric',
							minute: '2-digit',
							hour12: true,
						}),
						available: !isBooked,
					});
				}
			}
		}
		setAvailableSlots(slots);
	};

	const handleDateSelect = (date: string): void => {
		setBookingData({ ...bookingData, date, timeSlot: '' });
	};

	const handleTimeSelect = (timeSlot: string): void => {
		setBookingData({ ...bookingData, timeSlot });
		setCurrentStep('details');
	};

	const handleBookingSubmit = async () => {
		const startTime = new Date(bookingData.timeSlot);
		const endTime = new Date(startTime);
		endTime.setMinutes(endTime.getMinutes() + service.duration);

		const newBooking: Booking = {
			id: Date.now().toString(),
			...bookingData,
			serviceName: service.name,
			duration: service.duration,
			price: service.price,
			startTime: startTime.toISOString(),
			endTime: endTime.toISOString(),
			status: 'confirmed',
		};

		await postBooking(newBooking);
		setBookings([...bookings, newBooking]);
		sendBookingEmail();
		sendBookingEmail(bookingData.email);
		setCurrentStep('confirmation');
	};

	const resetBooking = (): void => {
		setBookingData({
			date: '',
			timeSlot: '',
			name: '',
			email: '',
			phone: '',
			notes: '',
			address: '',
		});
		setCurrentStep('datetime');
	};

	const sendBookingEmail = (email?: string) => {
		const bookingMailData = {
			from_name: bookingData.name,
			from_email: bookingData.email,
			phone_number: bookingData.phone,
			address: bookingData.address,
			notes: bookingData.notes,
			session_type: service.name,
			session_date: new Date(bookingData.date).toLocaleDateString('en-US', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			}),
			session_time: new Date(bookingData.timeSlot).toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: '2-digit',
				hour12: true,
			}),
			session_duration: service.duration,
			to_email: email || import.meta.env.VITE_TO_EMAIL,
		};

		emailjs
			.send(
				import.meta.env.VITE_SERVICE_ID,
				import.meta.env.VITE_TEMPLATE_ID,
				bookingMailData,
				import.meta.env.VITE_PUBLIC_KEY
			)
			.then(
				(result) => {
					console.log('SUCCESS:', result.text);
					console.log('Booking email sent successfully!');
				},
				(error) => {
					console.log('FAILED:', error.text);
					console.log('Error sending email');
				}
			);
	};

	const getTodayDate = (): string => {
		const today = new Date();
		return today.toISOString().split('T')[0];
	};

	const getMaxDate = (): string => {
		const maxDate = new Date();
		maxDate.setMonth(maxDate.getMonth() + 3);
		return maxDate.toISOString().split('T')[0];
	};

	const steps: Step[] = ['datetime', 'details', 'confirmation'];

	return (
		<section id="booking" className="section-wrapper section-spacer">
			<h2 className="font-semibold text-[32px] text-center pb-3">Schedule Your Crown Moment</h2>
			<div className="px-4 md:px-8 pt-8">
				<div className="max-w-4xl mx-auto">
					{/* Progress Steps */}
					<div className="bg-white rounded-xl shadow-lg p-6 mb-6">
						<div className="flex items-center justify-between">
							{steps.map((step, idx) => (
								<div key={step} className="flex items-center flex-1 last:max-w-max">
									<div
										className={`flex items-center justify-center w-10 h-10 rounded-full ${
											currentStep === step
												? 'bg-indigo-600 text-white'
												: idx < steps.indexOf(currentStep)
												? 'bg-green-500 text-white'
												: 'bg-gray-200 text-gray-500'
										}`}
									>
										{idx < steps.indexOf(currentStep) ? (
											<CheckCircle className="w-6 h-6" />
										) : (
											idx + 1
										)}
									</div>
									{idx < 2 && (
										<div
											className={`flex-1 h-1 mx-2 ${
												idx < steps.indexOf(currentStep) ? 'bg-green-500' : 'bg-gray-200'
											}`}
										/>
									)}
								</div>
							))}
						</div>
					</div>

					{/* Main Content */}
					<div className="bg-white rounded-xl shadow-xl p-8">
						{/* Step 1: Date & Time Selection */}
						{currentStep === 'datetime' && (
							<div>
								<h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Date & Time</h2>

								<div className="mb-6">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Select Date
									</label>
									<input
										type="date"
										min={getTodayDate()}
										max={getMaxDate()}
										value={bookingData.date}
										onChange={(e) => handleDateSelect(e.target.value)}
										className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
									/>
								</div>

								{bookingData.date && (
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-3">
											Available Time Slots
										</label>
										<div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
											{availableSlots.map((slot) => (
												<button
													key={slot.time}
													onClick={() => slot.available && handleTimeSelect(slot.time)}
													disabled={!slot.available}
													className={`p-3 rounded-lg border-2 font-medium transition-all ${
														slot.available
															? 'border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 text-gray-800'
															: 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
													}`}
												>
													{slot.label}
												</button>
											))}
										</div>
									</div>
								)}
							</div>
						)}

						{/* Step 2: Contact Details */}
						{currentStep === 'details' && (
							<div>
								<h2 className="text-2xl font-bold text-gray-800 mb-6">Your Information</h2>

								{/* Selected Time Display */}
								<div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4 mb-6">
									<div className="flex items-center justify-between">
										<div>
											<div className="text-sm text-gray-600 mb-1">Selected Date & Time</div>
											<div className="font-semibold text-gray-800">
												{new Date(bookingData.date).toLocaleDateString('en-US', {
													weekday: 'long',
													year: 'numeric',
													month: 'long',
													day: 'numeric',
												})}
											</div>
											<div className="text-indigo-600 font-medium">
												{new Date(bookingData.timeSlot).toLocaleTimeString('en-US', {
													hour: 'numeric',
													minute: '2-digit',
													hour12: true,
												})}
											</div>
										</div>
										<Clock className="w-8 h-8 text-indigo-600" />
									</div>
								</div>

								<div className="space-y-4">
									<div>
										<label className="flex items-center text-sm font-medium text-gray-700 mb-2">
											<User className="w-4 h-4 mr-2" />
											Full Name
										</label>
										<input
											type="text"
											value={bookingData.name}
											onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
											className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
											placeholder="John Doe"
										/>
									</div>

									<div>
										<label className="flex items-center text-sm font-medium text-gray-700 mb-2">
											<Mail className="w-4 h-4 mr-2" />
											Email Address
										</label>
										<input
											type="email"
											value={bookingData.email}
											onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
											className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
											placeholder="john@example.com"
										/>
									</div>

									<div>
										<label className="flex items-center text-sm font-medium text-gray-700 mb-2">
											<Phone className="w-4 h-4 mr-2" />
											Phone Number
										</label>
										<input
											type="tel"
											value={bookingData.phone}
											onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
											className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
											placeholder="+1 (555) 123-4567"
										/>
									</div>

									<div>
										<label className="flex items-center text-sm font-medium text-gray-700 mb-2">
											<LocateIcon className="w-4 h-4 mr-2" />
											Address
										</label>
										<input
											type="text"
											value={bookingData.address}
											onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
											className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
											placeholder="123 Main St, City, Country"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Additional Notes (Optional)
										</label>
										<textarea
											value={bookingData.notes}
											onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
											rows={4}
											className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
											placeholder="Any special requirements or questions..."
										/>
									</div>
								</div>

								<div className="flex gap-4 mt-6">
									<button
										onClick={() => setCurrentStep('datetime')}
										className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
									>
										Back
									</button>
									<button
										onClick={handleBookingSubmit}
										disabled={
											!bookingData.name ||
											!bookingData.email ||
											!bookingData.phone ||
											!bookingData.address
										}
										className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
									>
										Confirm Booking
									</button>
								</div>
							</div>
						)}

						{/* Step 3: Confirmation */}
						{currentStep === 'confirmation' && (
							<div className="text-center">
								<div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
									<CheckCircle className="w-12 h-12 text-green-600" />
								</div>

								<h2 className="text-3xl font-bold text-gray-800 mb-4">Booking Confirmed!</h2>
								<p className="text-gray-600 mb-8">
									Your consultation has been successfully scheduled
								</p>

								<div className="bg-gray-50 rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
									<h3 className="font-semibold text-gray-800 mb-4">Booking Details</h3>
									<div className="space-y-3 text-sm">
										<div className="flex justify-between">
											<span className="text-gray-600">Service:</span>
											<span className="font-medium">{service.name}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-600">Date:</span>
											<span className="font-medium">
												{new Date(bookingData.date).toLocaleDateString('en-US', {
													weekday: 'long',
													year: 'numeric',
													month: 'long',
													day: 'numeric',
												})}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-600">Time:</span>
											<span className="font-medium">
												{new Date(bookingData.timeSlot).toLocaleTimeString('en-US', {
													hour: 'numeric',
													minute: '2-digit',
													hour12: true,
												})}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-600">Duration:</span>
											<span className="font-medium">{service.duration} minutes</span>
										</div>
										<div className="flex justify-between pt-3 border-t">
											<span className="text-gray-600">Price:</span>
											<span className="font-bold text-indigo-600">{service.price}</span>
										</div>
									</div>

									<div className="mt-4 pt-4 border-t">
										<div className="text-xs text-gray-600 mb-2">Contact Information</div>
										<div className="text-sm space-y-1">
											<div>
												<span className="text-gray-600">Name:</span>{' '}
												<span className="font-medium">{bookingData.name}</span>
											</div>
											<div>
												<span className="text-gray-600">Email:</span>{' '}
												<span className="font-medium">{bookingData.email}</span>
											</div>
											<div>
												<span className="text-gray-600">Phone:</span>{' '}
												<span className="font-medium">{bookingData.phone}</span>
											</div>
											<div>
												<span className="text-gray-600">Address:</span>{' '}
												<span className="font-medium">{bookingData.address}</span>
											</div>
											<div>
												<span className="text-gray-600">Notes:</span>{' '}
												<span className="font-medium">{bookingData.notes}</span>
											</div>
										</div>
									</div>
								</div>

								<p className="text-sm text-gray-600 mb-6">
									A confirmation email has been sent to <strong>{bookingData.email}</strong>
								</p>

								<button
									onClick={resetBooking}
									className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
								>
									Book Another Appointment
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
