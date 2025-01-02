import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from "../components/Navbar";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductFeatures from "@/components/product/ProductFeatures";
import ProductDescription from "@/components/product/ProductDescription";
import Footer from "../components/Footer";
import { products } from "@/data/products";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const product = products.find(p => p.id === Number(id));

  useEffect(() => {
    if (!product) {
      navigate('/marketplace');
    }
  }, [product, navigate]);

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-7xl mx-auto">
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
              description={product.description}
              features={product.features}
              paymentLink={product.paymentLink}
            />
          </div>

          <div className="mt-16 space-y-12">
            <ProductFeatures features={product.features} />
            <ProductDescription description={product.description} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;