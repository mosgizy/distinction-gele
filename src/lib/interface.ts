export interface BookingData {
	date: string;
	timeSlot: string;
	name: string;
	email: string;
	phone: string;
	notes: string;
	address: string;
}

export interface Service {
	id: string;
	name: string;
	duration: number;
	price: string;
}

export interface BusinessHours {
	start: number;
	end: number;
	interval: number;
}

export interface TimeSlot {
	time: string;
	label: string;
	available: boolean;
}

export interface Booking extends BookingData {
	id: string;
	serviceName: string;
	duration: number;
	price: string;
	startTime: string;
	endTime: string;
	status: string;
}