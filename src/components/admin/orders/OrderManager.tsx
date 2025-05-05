
import React from 'react';
import OrderHeader from './OrderHeader';
import OrderTable from './OrderTable';
import { useOrderManagement } from './hooks/useOrderManagement';

const OrderManager = () => {
  const { orders, isLoading, stats, handleStatusChange, handleDeleteOrder } = useOrderManagement();

  return (
    <div className="space-y-6">
      <OrderHeader stats={stats} isLoading={isLoading} />
      <OrderTable 
        orders={orders} 
        isLoading={isLoading} 
        onStatusChange={handleStatusChange}
        onDeleteOrder={handleDeleteOrder}
      />
    </div>
  );
};

export default OrderManager;
