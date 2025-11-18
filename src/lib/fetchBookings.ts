export const fetchBookings = async () => {
  try {
    const response = await fetch('http://localhost:5000/bookings');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}