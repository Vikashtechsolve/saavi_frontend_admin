import React, { useState, useEffect } from 'react';
import { Calendar, Phone, Mail, Users, Building2, ExternalLink } from 'lucide-react';
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

const UserBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/bookings`, {
        headers: {
          'ngrok-skip-browser-warning': '6941',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const bookingData = await response.json();
      setBookings(bookingData.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading bookings...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">User Bookings</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest Details
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Details
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Info
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
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
                      <div className="text-sm text-gray-500 mt-1">
                        Type: {booking.type}
                      </div>
                      {booking.promoCode && (
                        <div className="text-sm text-green-600 mt-1">
                          Promo: {booking.promoCode}
                        </div>
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
                    <span className="font-medium">
                      ₹{booking.cost.toLocaleString()}
                    </span>
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

