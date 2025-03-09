import React from 'react';
import { Building } from 'lucide-react';

interface SidebarProps {
  navigation: {
    name: string;
    icon: any;
    id: string;
  }[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navigation, activeTab, setActiveTab }) => {
  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <Building className="h-8 w-8 text-red-700" />
          <span className="text-xl font-bold">Hotel Admin</span>
        </div>
      </div>
      
      <nav className="mt-4">
        {navigation.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-2 px-4 py-3 text-gray-600 hover:bg-gray-50 ${
              activeTab === item.id ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;