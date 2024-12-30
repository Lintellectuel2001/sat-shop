import React from 'react';
import ProductCard from '../ProductCard';
import { products } from '@/data/products';

const MarketplaceHeader = () => {
  // Find the specific products for top sales
  const ironTvPro = products.find(p => p.name === "IRON TV PRO");
  const atlasPro = products.find(p => p.name === "ATLAS PRO");
  const gogoIptv = products.find(p => p.name === "GOGO IPTV");

  const topSalesProducts = [ironTvPro, atlasPro, gogoIptv].filter(Boolean);

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-primary">Nos Services Premium</h1>
        <p className="text-accent text-lg">
          Découvrez notre sélection exclusive de services de streaming et de divertissement, 
          soigneusement choisis pour votre satisfaction.
        </p>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Top des Ventes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topSalesProducts.map((product) => (
            product && (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                rating={product.rating}
                reviews={product.reviews}
                paymentLink={product.paymentLink}
              />
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHeader;