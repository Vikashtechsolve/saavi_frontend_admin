import React from 'react';
import { X, Calendar, Mail, Users, Building2, CreditCard, Tag } from 'lucide-react';

interface BookingDetailsModalProps {
  booking: {
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
  };
  onClose: () => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ booking, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Guest Information */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Guest Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Name</label>
                <p className="font-medium">{`${booking.firstName} ${booking.lastName}`}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1 text-gray-400" />
                  <p>{booking.email}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">User ID</label>
                <p className="font-mono text-sm">{booking.userId}</p>
              </div>
            </div>
          </div>

          {/* Booking Information */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Booking Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Destination</label>
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-1 text-gray-400" />
                  <p>{booking.destination}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">Hotel ID</label>
                <p className="font-mono text-sm">{booking.hotelId}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Room Type</label>
                <p>{booking.type}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Booking Date</label>
                <p>{new Date(booking.bookingDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Stay Details */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-3">Stay Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Check-in</label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  <p>{new Date(booking.checkIn).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">Check-out</label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  <p>{new Date(booking.checkOut).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">Rooms & Guests</label>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-gray-400" />
                  <p>{`${booking.rooms} ${booking.rooms === 1 ? 'room' : 'rooms'} • ${booking.guests} ${booking.guests === 1 ? 'guest' : 'guests'}`}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Payment Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Total Cost</label>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-1 text-gray-400" />
                  <p className="font-semibold">₹{booking.cost.toLocaleString()}</p>
                </div>
              </div>
              {booking.promoCode && (
                <div>
                  <label className="text-sm text-gray-500">Promo Code</label>
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-1 text-green-500" />
                    <p className="text-green-600">{booking.promoCode}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal; 