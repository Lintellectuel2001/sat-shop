import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import FilterBar from '@/components/marketplace/FilterBar';
import ProductGrid from '@/components/marketplace/ProductGrid';
import { useProducts } from '@/hooks/useProducts';

const Marketplace = () => {
  const [sortOrder, setSortOrder] = useState("newest");
  const [category, setCategory] = useState("all");
  const { products, isLoading } = useProducts();

  const filteredProducts = products.filter(product => 
    category === "all" || product.category === category
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8]">
        <Navbar />
        <main className="container mx-auto px-4 pt-32 pb-16">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Chargement des produits...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-16">
        <MarketplaceHeader />
        <FilterBar 
          productsCount={filteredProducts.length}
          category={category}
          setCategory={setCategory}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
        <ProductGrid products={filteredProducts} />
      </main>
    </div>
  );
};

export default Marketplace;