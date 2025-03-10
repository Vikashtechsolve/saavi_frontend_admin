import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import AddHotel from './AddHotel';
import EditHotel from './EditHotel';  
import QuickPriceEdit from './QuickPriceEdit';

const HotelList = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<HotelType | null>(null);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/hotels/`, {
        headers: {
          'ngrok-skip-browser-warning': '6941',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch hotels');
      }
      const data = await response.json();
      setHotels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hotel: any) => {
    setSelectedHotel(hotel);
    setShowEditModal(true);
  };

  const handleDelete = async(hotel: any) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/hotels/${hotel.id}`, {
        method: 'DELETE',
        headers: {
          'ngrok-skip-browser-warning': '6941',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete hotel');
      }
      
      // setHotels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }


    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/hotels/`, {
        headers: {
          'ngrok-skip-browser-warning': '6941',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch hotels');
      }
      const data = await response.json();
      setHotels(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEditComplete = () => {
    setShowEditModal(false);
    setSelectedHotel(null);
    fetchHotels(); // Refresh the list after edit
  };

  if (loading) {
    return <div className="text-center py-8">Loading hotels...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hotels Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-900"
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
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {hotels.map((hotel: any) => (
              <tr key={hotel.hotelId || hotel._id || `hotel-${Math.random()}`}>
                <td className="px-6 py-4 whitespace-nowrap">{hotel.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{hotel.city}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <QuickPriceEdit
                      hotelId={hotel.id}
                      currentPrice={hotel.pricePerNight}
                      onComplete={fetchHotels}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{hotel.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(hotel)}
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(hotel)}>
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && <AddHotel onClose={() => setShowAddModal(false)} onComplete={fetchHotels} />}
      {showEditModal && selectedHotel && (
        <EditHotel 
          hotel={selectedHotel} 
          onClose={() => setShowEditModal(false)}
          onComplete={handleEditComplete}
        />
      )}
    </div>
  );
};

export default HotelList;