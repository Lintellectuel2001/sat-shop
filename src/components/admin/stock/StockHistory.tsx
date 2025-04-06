
import React from 'react';
import StockHistoryFilters from './StockHistoryFilters';
import StockHistoryTable from './StockHistoryTable';
import { useStockHistory } from './useStockHistory';

const StockHistory = () => {
  const {
    history,
    isLoading,
    products,
    selectedProduct,
    setSelectedProduct,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    resetFilters
  } = useStockHistory();

  return (
    <div className="space-y-4">
      <StockHistoryFilters 
        products={products}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        resetFilters={resetFilters}
      />

      <StockHistoryTable 
        history={history} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default StockHistory;
