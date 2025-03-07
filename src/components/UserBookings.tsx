import React from 'react';
import { Calendar, Phone, Mail } from 'lucide-react';

const UserBookings = () => {
  const bookings = [
    {
      id: 1,
      userName: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      hotelName: 'Grand Hotel',
      checkIn: '2024-03-15',
      checkOut: '2024-03-20',
      roomType: 'Deluxe Suite',
      status: 'Confirmed',
    },
    // Add more sample bookings
  ];

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
                  Hotel
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Type
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium">{booking.userName}</span>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Mail className="h-4 w-4 mr-1" />
                        {booking.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Phone className="h-4 w-4 mr-1" />
                        {booking.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{booking.hotelName}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      <div>
                        <div>{booking.checkIn}</div>
                        <div className="text-gray-500">to</div>
                        <div>{booking.checkOut}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{booking.roomType}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserBookings;