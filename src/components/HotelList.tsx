import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import AddHotel from './AddHotel';

const HotelList = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [hotels, setHotels] = useState([
    {
      id: 1,
      name: 'Grand Hotel',
      location: 'New York',
      pricePerNight: 299,
      suites: 50,
      rating: 4.5,
    },
    // Add more sample hotels here
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hotels Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          <span>Add Hotel</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hotel Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price/Night
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Suites
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {hotels.map((hotel) => (
              <tr key={hotel.id}>
                <td className="px-6 py-4 whitespace-nowrap">{hotel.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{hotel.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">${hotel.pricePerNight}</td>
                <td className="px-6 py-4 whitespace-nowrap">{hotel.suites}</td>
                <td className="px-6 py-4 whitespace-nowrap">{hotel.rating}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && <AddHotel onClose={() => setShowAddModal(false)} />}
    </div>
  );
};

export default HotelList;