
import React from 'react';

interface OrderTrackingItem {
  status: string;
  notes?: string;
  created_at: string;
}

interface OrderTrackingProps {
  tracking: OrderTrackingItem[];
}

const OrderTracking = ({ tracking }: OrderTrackingProps) => {
  if (tracking.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Suivi de commande</h2>
      <div className="space-y-4">
        {tracking.map((track, index) => (
          <div 
            key={index}
            className="flex items-start gap-4 p-4 rounded-lg bg-gray-50"
          >
            <div className="flex-1">
              <p className="font-medium text-primary">{track.status}</p>
              {track.notes && (
                <p className="text-sm text-gray-600 mt-1">{track.notes}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {new Date(track.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTracking;
