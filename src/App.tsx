import React, { useState } from 'react';
import { Hotel, Building2, Users, Settings } from 'lucide-react';
import Sidebar from './components/Sidebar';
import HotelList from './components/HotelList';
import UserBookings from './components/UserBookings';
import AddHotel from './components/AddHotel';

function App() {
  const [activeTab, setActiveTab] = useState('hotels');

  const navigation = [
    { name: 'Hotels', icon: Building2, id: 'hotels' },
    { name: 'Bookings', icon: Hotel, id: 'bookings' },
    // { name: 'Users', icon: Users, id: 'users' },
    // { name: 'Settings', icon: Settings, id: 'settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar navigation={navigation} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'hotels' && <HotelList />}
            {activeTab === 'bookings' && <UserBookings />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;