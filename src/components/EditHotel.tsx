import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Select from 'react-select';
import CustomRichTextEditor from './CustomRichTextEditor';

interface HotelType {
  hotelId: string;
  name: string;
  city: string;
  state: string;
  country: string;
  location: string;
  description: string;
  type: string[];
  pricePerNight: number;
  facilities: string[];
  imageUrls: string[];
  lastUpdated?: Date;
  userId?: string;
  address?: string;
  rating?: string;
  homeDescription?: string;
  homeImageUrl?: any;
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
  const [facilityInput, setFacilityInput] = useState('');
  const [facilityOptions, setFacilityOptions] = useState<string[]>([
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
  ]);

  const suiteTypeOptions = [
    { value: 'luxury', label: 'Luxury' },
    { value: 'business', label: 'Business' },
    { value: 'resort', label: 'Resort' },
    { value: 'boutique', label: 'Boutique' },
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
      formDataToSend.append('state', formData.state);
      formDataToSend.append('country', formData.country);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('type', JSON.stringify(formData.type));
      formDataToSend.append('pricePerNight', formData.pricePerNight.toString());
      formDataToSend.append('facilities', JSON.stringify(formData.facilities));
      formDataToSend.append('address', formData.address || '');
      formDataToSend.append('rating', formData.rating || '');
      formDataToSend.append('homeDescription', formData.homeDescription || '');
      
      // Handle imageUrls - only keep existing images that weren't deleted
      const remainingImageUrls = formData.imageUrls.filter(url => imagePreviews.includes(url));
      formDataToSend.append('imageUrls', JSON.stringify(remainingImageUrls));
      
      // Append new images
      imageFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      // Append home image if changed
      if (formData.homeImageUrl instanceof File) {
        formDataToSend.append('homeImageUrl', formData.homeImageUrl);
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/hotels/update-hotel/${formData.hotelId}`, { 
        method: 'PUT',
        body: formDataToSend,
        headers: {
          'ngrok-skip-browser-warning': '6941',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update hotel');
      }

      onClose();
      onComplete();
    } catch (err) {
      console.log(err);
      
      setError(err instanceof Error ? err.message : 'Failed to update hotel');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full my-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pt-2">
          <h2 className="text-2xl bg-white font-bold">Edit Hotel</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md">{error}</div>
          )}
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Hotel Name *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-500 shadow p-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address *</label>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-500 shadow p-2 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City *</label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-500 shadow p-2 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">State *</label>
              <input
                type="text"
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-500 shadow p-2 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country *</label>
              <input
                type="text"
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-500 shadow p-2 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location *</label>
              <input
                type="url"
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-500 shadow p-2 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating *</label>
              <input
                type="text"
                id="rating"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-500 shadow p-2 focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <span className="text-sm text-gray-700">(0-5)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Home Description *</label>
            <CustomRichTextEditor
              value={formData.homeDescription || ''}
              onChange={(value) => setFormData({ ...formData, homeDescription: value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Home Image</label>
            {formData.homeImageUrl && typeof formData.homeImageUrl === 'string' && (
              <img 
                src={formData.homeImageUrl} 
                alt="Current home" 
                className="h-24 w-full object-cover rounded-md mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFormData({
                    ...formData,
                    homeImageUrl: file,
                  });
                }
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Suite Types *</label>
            <Select
              isMulti
              required
              name="types"
              options={suiteTypeOptions}
              className="mt-1"
              classNamePrefix="select"
              value={suiteTypeOptions.filter((option) =>
                formData.type.includes(option.value)
              )}
              onChange={(selectedOptions: readonly { value: string; label: string }[]) => {
                const selectedTypes = selectedOptions
                  ? selectedOptions.map((option: { value: string; label: string }) => option.value)
                  : [];
                setFormData({ ...formData, type: selectedTypes });
              }}
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price per Night (₹) *</label>
            <input
              type="number"
              id="price"
              value={formData.pricePerNight}
              onChange={(e) => setFormData({ ...formData, pricePerNight: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-500 shadow p-2 focus:border-blue-500 focus:ring-blue-500"
              required
              min="0"
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
                    onChange={() => {
                      const updatedFacilities = formData.facilities.includes(facility)
                        ? formData.facilities.filter(f => f !== facility)
                        : [...formData.facilities, facility];
                      setFormData({ ...formData, facilities: updatedFacilities });
                    }}
                  />
                  <span className="text-sm text-gray-700">{facility}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={facilityInput}
                onChange={(e) => setFacilityInput(e.target.value)}
                placeholder="Enter facility"
                className="mt-2 block w-full rounded-md border-gray-500 shadow p-2 focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="button"
                className="text-sm bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={() => {
                  if (facilityInput.trim()) {
                    setFacilityOptions([...facilityOptions, facilityInput.trim()]);
                    setFacilityInput('');
                  }
                }}
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description *</label>
            <CustomRichTextEditor
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              className="mt-1 block w-full rounded-md border-gray-500 shadow p-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Images * (Min 5, Max 6 images)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length + imagePreviews.length > 6) {
                  setError('Maximum 6 images allowed');
                  return;
                }
                setImageFiles((prev) => [...prev, ...files]);
                files.forEach((file) => {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImagePreviews((prev) => [...prev, reader.result as string]);
                  };
                  reader.readAsDataURL(file);
                });
              }}
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
                    onClick={() => {
                      setImagePreviews(prev => prev.filter((_, i) => i !== index));
                      setImageFiles(prev => prev.filter((_, i) => i !== index));
                      if (preview.startsWith('data:')) {
                        // Remove from imageFiles if it's a new image
                        setImageFiles(prev => prev.filter((_, i) => i !== index));
                      } else {
                        // Remove from imageUrls if it's an existing image
                        setFormData(prev => ({
                          ...prev,
                          imageUrls: prev.imageUrls.filter(url => url !== preview)
                        }));
                      }
                    }}
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
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-700 rounded-md hover:bg-red-900 disabled:bg-red-300"
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