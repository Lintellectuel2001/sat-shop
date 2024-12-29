import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import { products } from '@/data/products';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const product = products.find(p => p.id === Number(id));

  if (!product) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductGallery 
            image={product.image}
            name={product.name}
          />

          <ProductInfo
            name={product.name}
            price={product.price}
            rating={product.rating}
            reviews={product.reviews}
            description={product.description || ""}
            features={product.features || []}
            downloadInfo={product.downloadInfo}
            onOrder={() => {}}
            paymentLink={product.paymentLink}
            paypalLink={product.paypalLink}
          />
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;