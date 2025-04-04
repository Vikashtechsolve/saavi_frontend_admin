import React, { useState, useEffect } from 'react';
import { Calendar, Mail, Users, Building2, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import BookingDetailsModal from './BookingDetailsModal';

interface Booking {
  firstName: string;
  lastName: string;
  email: string;
  checkIn: string;
  checkOut: string;
  userId: string;
  cost: number;
  destination: string;
  hotelId: string;
  rooms: number;
  guests: number;
  bookingDate: string;
  type: string;
  promoCode?: string;
}

const LIMIT = 10;

const UserBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true); // If there's another page

  useEffect(() => {
    fetchBookings();
  }, [page]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/bookings?limit=${LIMIT}&page=${page}`,
        {
          headers: { 'ngrok-skip-browser-warning': '6941' },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const bookingData = await response.json();
      setBookings(bookingData.data || []);
      setHasMore((bookingData.data || []).length === LIMIT); // If less than LIMIT, no more pages
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (hasMore) setPage((prev) => prev + 1);
  };

  if (loading) return <div className="text-center py-8">Loading bookings...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Bookings</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className={`p-1 rounded-full ${page === 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm text-gray-600">Page {page}</span>
          <button
            onClick={handleNext}
            disabled={!hasMore}
            className={`p-1 rounded-full ${!hasMore ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={`${booking.userId}-${booking.bookingDate}`}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium">{`${booking.firstName} ${booking.lastName}`}</span>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Mail className="h-4 w-4 mr-1" />
                        {booking.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Users className="h-4 w-4 mr-1" />
                        {booking.guests} guests
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center text-sm">
                        <Building2 className="h-4 w-4 mr-1 text-gray-500" />
                        {booking.destination}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">Type: {booking.type}</div>
                      {booking.promoCode && (
                        <div className="text-sm text-green-600 mt-1">Promo: {booking.promoCode}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      <div>
                        <div>{new Date(booking.checkIn).toLocaleDateString()}</div>
                        <div className="text-gray-500">to</div>
                        <div>{new Date(booking.checkOut).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div>{booking.rooms} {booking.rooms === 1 ? 'room' : 'rooms'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium">₹{booking.cost.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      <span>Open</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
};

export default UserBookings;
