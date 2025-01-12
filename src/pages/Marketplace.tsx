import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import FilterBar from '@/components/marketplace/FilterBar';
import ProductGrid from '@/components/marketplace/ProductGrid';
import { products } from '@/data/products';

const Marketplace = () => {
  const [sortOrder, setSortOrder] = useState("newest");
  const [category, setCategory] = useState("all");

  const filteredProducts = products.filter(product => 
    category === "all" || product.category === category
  );

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