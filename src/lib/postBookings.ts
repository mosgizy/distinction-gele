import type { BookingData } from "./interface";

export const postBooking = async (bookingData: BookingData) => {
 	try {
 		const response = await fetch('http://localhost:5000/bookings', {
 			method: 'POST',
 			headers: {
 				'Content-Type': 'application/json',
 			},
 			body: JSON.stringify(bookingData),
 		});
 
 		if (!response.ok) {
 			throw new Error('Network response was not ok');
 		}
 
 		const data = await response.json();
 		return data;
 	} catch (error) {
 		console.error('Error posting booking:', error);
 		throw error;
 	}
 }