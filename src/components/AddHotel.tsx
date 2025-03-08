import React, { useState } from 'react';
import { X } from 'lucide-react';

interface HotelType {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerNight: number;
  facilities: string[];
  imageUrls: string[];
  lastUpdated?: Date;
  userId?: string;
}

interface AddHotelProps {
  onClose: () => void;
}

const AddHotel: React.FC<AddHotelProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<HotelType>({
    name: '',
    city: '',
    country: '',
    description: '',
    type: 'luxury',
    pricePerNight: 0,
    facilities: [],
    imageUrls: [],
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const facilityOptions = [
    'Free WiFi',
    'Parking',
    'Swimming Pool',
    'Gym',
    'Restaurant',
    'Room Service',
    'Spa',
    'Business Center',
    'Conference Room',
    'Bar/Lounge'
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imageFiles.length > 6) {
      setError('Maximum 6 images allowed');
      return;
    }
    
    setImageFiles(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleFacilityChange = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      // Generate a unique hotelId using timestamp + random string
      const timestamp = new Date().getTime().toString(36);
      const randomPart = Array(8)
        .fill(0)
        .map(() => Math.random().toString(36).substring(2, 3))
        .join('');
      const uniqueHotelId = `${timestamp}-${randomPart}`;
      
      // Add hotelId to formData
      formDataToSend.append('hotelId', uniqueHotelId);
      
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'facilities') {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value.toString());
        }
      });

      imageFiles.forEach(file => {
        formDataToSend.append('imageFiles', file);
      });

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/my-hotels/add-hotel`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add hotel');
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add hotel');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Hotel</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Hotel Name *</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">City *</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Country *</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type *</label>
            <select
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="luxury">Luxury</option>
              <option value="business">Business</option>
              <option value="resort">Resort</option>
              <option value="boutique">Boutique</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price per Night (₹) *</label>
            <input
              type="number"
              required
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.pricePerNight || ''}
              onChange={(e) => setFormData({ ...formData, pricePerNight: Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Facilities *</label>
            <div className="grid grid-cols-2 gap-2">
              {facilityOptions.map((facility) => (
                <label key={facility} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={formData.facilities.includes(facility)}
                    onChange={() => handleFacilityChange(facility)}
                  />
                  <span className="text-sm text-gray-700">{facility}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description *</label>
            <textarea
              required
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images * (Max 6 images)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <div className="mt-4 grid grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isSubmitting ? 'Adding...' : 'Add Hotel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHotel;