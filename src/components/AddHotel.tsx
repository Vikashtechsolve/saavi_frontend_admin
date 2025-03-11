import React, { useState } from "react";
import { X } from "lucide-react";
import Select from "react-select";
import CustomRichTextEditor from "./CustomRichTextEditor";

interface HotelType {
  name: string;
  city: string;
  state: string;
  country: string;
  location: string;
  description: string;
  type: string[];
  pricePerNight: number;
  facilities: string[];
  imageFiles: File[];
  lastUpdated?: Date;
  userId?: string;
  address?: string;
  rating?: string;
  homeDescription?: string;
  homeImageUrl?: any;
}

interface AddHotelProps {
  onClose: () => void;
  onComplete?: () => Promise<void> | void;
}

const AddHotel: React.FC<AddHotelProps> = ({ onClose, onComplete }) => {
  const [formData, setFormData] = useState<HotelType>({
    name: "",
    city: "",
    state: "",
    country: "",
    location: "",
    description: "",
    type: [],
    pricePerNight: 0,
    facilities: [],
    imageFiles: [],
    address: "",
    rating: "",
    homeDescription: "",
    homeImageUrl: null,
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [facilityInput, setFacilityInput] = useState("");
  const [facilityOptions, setFacilityOptions] = useState<string[]>([
    "Free WiFi",
    "Parking",
    "Swimming Pool",
    "Gym",
    "Restaurant",
    "Room Service",
    "Spa",
    "Business Center",
    "Conference Room",
    "Bar/Lounge",
  ]);

  const suiteTypeOptions = [
    { value: "luxury", label: "Luxury" },
    { value: "business", label: "Business" },
    { value: "resort", label: "Resort" },
    { value: "boutique", label: "Boutique" },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imageFiles.length > 6) {
      setError("Maximum 6 images allowed");
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
    setFormData((prev) => ({
      ...prev,
      imageFiles: [...prev.imageFiles, ...files],
    }));
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFacilityChange = (facility: string) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const formDataToSend = new FormData();

      // Generate a unique hotelId using timestamp + random string
      const timestamp = new Date().getTime().toString(36);
      const randomPart = Array(8)
        .fill(0)
        .map(() => Math.random().toString(36).substring(2, 3))
        .join("");
      const uniqueHotelId = `${timestamp}-${randomPart}`;

      // Add hotelId to formData
      formDataToSend.append("hotelId", uniqueHotelId);

      Object.entries(formData).forEach(([key, value]) => {
        if ((key === "facilities" || key === "type")) {
          // Handle arrays properly
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          if (key === "homeImageUrl") {
            formDataToSend.append(key, value);
          } else {
            formDataToSend.append(key, value.toString());
          }
        }
      });

      imageFiles.forEach((file) => {
        formDataToSend.append("imageFiles", file);
      });

      console.log(formDataToSend);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/hotels/add-hotel`,
        {
          headers: {
            "ngrok-skip-browser-warning": "6941",
          },
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add hotel");
      }

      onClose();
      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add hotel");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 my-8 max-h-[700px] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Hotel</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hotel Name *
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-500 shadow p-2 focus:border-blue-500 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address *
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-500 shadow p-2 focus:border-blue-500 focus:ring-blue-500"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City *
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-500 shadow p-2 focus:border-blue-500 focus:ring-blue-500"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
            </div>
            {/* state */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State *
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-500 shadow p-2 focus:border-blue-500 focus:ring-blue-500"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country *
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-500 shadow p-2 focus:border-blue-500 focus:ring-blue-500"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location *
              </label>
              <input
                type="url"
                required
                className="mt-1 block w-full rounded-md border-gray-500 shadow p-2 focus:border-blue-500 focus:ring-blue-500"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            {/* RATING */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rating *
              </label>
              <input
                type="text"
                required
                min={0}
                max={5}
                className="mt-1 block w-full rounded-md border-gray-500 shadow p-2 focus:border-blue-500 focus:ring-blue-500"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: e.target.value })
                }
              />
              <span className="text-sm text-gray-700">(0-5)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Home Description *
            </label>
            <CustomRichTextEditor
              value={formData.homeDescription || ""}
              onChange={(value) =>
                setFormData({ ...formData, homeDescription: value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Home Image *
            </label>
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
            <label className="block text-sm font-medium text-gray-700">
              Suite Types *
            </label>
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
            <label className="block text-sm font-medium text-gray-700">
              Price per Night (₹) *
            </label>
            <input
              type="number"
              required
              min="0"
              className="mt-1 block w-full rounded-md border-gray-500 shadow p-2 focus:border-blue-500 focus:ring-blue-500"
              value={formData.pricePerNight || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pricePerNight: Number(e.target.value),
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facilities *
            </label>
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
                className="text-sm
                bg-blue-500 text-white px-4 py-2 rounded-md
                "
                onClick={() => {
                  setFacilityOptions([...facilityOptions, facilityInput]);
                  setFacilityInput("");
                }}
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <CustomRichTextEditor
              value={formData.description}
              onChange={(value) =>
                setFormData({ ...formData, description: value })
              }
              className="mt-1 block w-full rounded-md border-gray-500 shadow p-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images * (Min 5, Max 6 images)
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
              className="px-4 py-2 text-sm font-medium text-white bg-red-700 rounded-md hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300"
            >
              {isSubmitting ? "Adding..." : "Add Hotel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHotel;
