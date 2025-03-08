import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface HotelType {
  hotelId: string;
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

interface EditHotelProps {
  hotel: HotelType;
  onClose: () => void;
  onComplete: () => void;
}

const EditHotel: React.FC<EditHotelProps> = ({ hotel, onClose, onComplete }) => {
  const [formData, setFormData] = useState<HotelType>(hotel);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(hotel.imageUrls || []);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      // Append all hotel fields individually
      formDataToSend.append('hotelId', formData.hotelId);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('country', formData.country);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('pricePerNight', formData.pricePerNight.toString());
      formDataToSend.append('facilities', JSON.stringify(formData.facilities));
      
      // Handle imageUrls - only keep existing images that weren't deleted
      const remainingImageUrls = formData.imageUrls.filter(url => imagePreviews.includes(url));
      formDataToSend.append('imageUrls', JSON.stringify(remainingImageUrls));
      
      // Append new images
      imageFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/my-hotels/update-hotel/${hotel.hotelId}`, { 
        method: 'PUT',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to update hotel');
      }

      onClose();
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update hotel');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full my-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pt-2">
          <h2 className="text-2xl font-bold">Edit Hotel</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md">{error}</div>
          )}
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Hotel Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Hotel Type</label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Select type</option>
              <option value="Luxury">Luxury</option>
              <option value="Business">Business</option>
              <option value="Resort">Resort</option>
              <option value="Budget">Budget</option>
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price per Night</label>
            <input
              type="number"
              id="price"
              value={formData.pricePerNight}
              onChange={(e) => setFormData({ ...formData, pricePerNight: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Facilities</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {facilityOptions.map((facility) => (
                <label key={facility} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.facilities.includes(facility)}
                    onChange={(e) => {
                      const updatedFacilities = e.target.checked
                        ? [...formData.facilities, facility]
                        : formData.facilities.filter(f => f !== facility);
                      setFormData({ ...formData, facilities: updatedFacilities });
                    }}
                    className="rounded border-gray-300 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-600">{facility}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Images</label>
            <div className="mt-2 grid grid-cols-3 gap-4">
              {imagePreviews.map((url, index) => (
                <div key={index} className="relative">
                  <img src={url} alt={`Preview ${index + 1}`} className="h-24 w-full object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreviews(imagePreviews.filter((_, i) => i !== index));
                      setFormData({
                        ...formData,
                        imageUrls: formData.imageUrls.filter((_, i) => i !== index)
                      });
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full -mt-2 -mr-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setImageFiles(files);
                const newPreviews = files.map(file => URL.createObjectURL(file));
                setImagePreviews([...imagePreviews, ...newPreviews]);
              }}
              className="mt-2"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSubmitting ? 'Updating...' : 'Update Hotel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHotel; 