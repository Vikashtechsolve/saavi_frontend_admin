import { useState } from 'react';
import { Pencil, X, Check } from 'lucide-react';

interface QuickPriceEditProps {
  hotelId: string;
  currentPrice: number;
  onComplete: () => void;
}

const QuickPriceEdit: React.FC<QuickPriceEditProps> = ({ hotelId, currentPrice, onComplete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [price, setPrice] = useState(currentPrice);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('hotelId', hotelId);
      formData.append('pricePerNight', price.toString());

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/hotels/update-hotel/${hotelId}`, {
        method: 'PUT',
        body: formData,
        headers: {
          'ngrok-skip-browser-warning': '6941',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update price');
      }

      setIsEditing(false);
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update price');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <span>Rs. {currentPrice}</span>
        <button
          onClick={() => setIsEditing(true)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="w-24 px-2 py-1 border rounded"
        min="0"
      />
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="p-1 hover:bg-green-100 rounded text-green-600"
      >
        <Check className="h-4 w-4" />
      </button>
      <button
        onClick={() => {
          setIsEditing(false);
          setPrice(currentPrice);
          setError('');
        }}
        className="p-1 hover:bg-red-100 rounded text-red-600"
      >
        <X className="h-4 w-4" />
      </button>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default QuickPriceEdit; 