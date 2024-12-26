import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star } from "lucide-react";

const products = [
  {
    id: 1,
    name: "IRON TV PRO",
    price: "3500 DA",
    rating: 5,
    reviews: 124,
    image: "/lovable-uploads/c5a3c89d-432f-4cef-a538-75a6da43c7e0.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9xhxpv4k98rp4mhbpbcrk6z",
    category: "iptv"
  },
  {
    id: 2,
    name: "ATLAS PRO",
    price: "3000 DA",
    rating: 5,
    reviews: 98,
    image: "/lovable-uploads/36762d97-5db1-4e2c-9796-0de62a32cfde.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9ymqj9fbpggyvfjdcwxhfjq",
    category: "iptv"
  },
  {
    id: 3,
    name: "FUNCAM",
    price: "1800 DA",
    rating: 5,
    reviews: 0,
    image: "/lovable-uploads/ad1e441d-a579-4cf0-8c19-cf22e405d74b.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9ymfmt12rezgtbqt7abyftt",
    category: "sharing"
  },
  {
    id: 4,
    name: "GOGO IPTV",
    price: "3000 DA",
    rating: 5,
    reviews: 0,
    image: "/lovable-uploads/ac2683f4-4da0-488c-ba1f-4d0478e9a991.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9ymxw0sg2szb0a987dhx9y1",
    category: "iptv"
  },
  {
    id: 5,
    name: "MY HD",
    price: "2000 DA",
    rating: 5,
    reviews: 0,
    image: "/lovable-uploads/6e4a8cf4-1a86-41dd-88ba-6f5ca84ba7fe.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9yn1angy3xsk301b98e56v1",
    category: "iptv"
  },
  {
    id: 6,
    name: "ORCA PRO",
    price: "3500 DA",
    rating: 5,
    reviews: 0,
    image: "/lovable-uploads/66304b90-e140-4a42-b75d-d8938d8d11c6.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9ymyx1ev9sh162mj67qa59q",
    category: "iptv"
  },
  {
    id: 7,
    name: "POP IPTV",
    price: "3000 DA",
    rating: 5,
    reviews: 0,
    image: "/lovable-uploads/96c11b10-32d5-42e0-8182-4b7a9ba2154d.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9yn026m076hjmhd1mev9rjs",
    category: "iptv"
  },
  {
    id: 8,
    name: "DREAM IPTV",
    price: "3000 DA",
    rating: 5,
    reviews: 0,
    image: "/lovable-uploads/5ff839f5-dc44-4d86-98da-9b6d5b041e81.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9ymsckhqd8qqcgr35tyr4gc",
    category: "iptv"
  },
  {
    id: 9,
    name: "IRON TV",
    price: "3000 DA",
    rating: 5,
    reviews: 0,
    image: "/lovable-uploads/1c875639-253e-4953-b461-1dba3e5aa8c4.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9ymwapfq0y9kjcsjway9xh9",
    category: "iptv"
  }
];

const Marketplace = () => {
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState("newest");
  const [category, setCategory] = useState("all");

  const handleProductClick = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product?.paymentLink) {
      window.location.href = product.paymentLink;
    } else {
      navigate(`/product/${productId}`);
    }
  };

  const filteredProducts = products.filter(product => 
    category === "all" || product.category === category
  );

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4 text-primary">Nos Services Premium</h1>
            <p className="text-accent text-lg">
              Découvrez notre sélection exclusive de services de streaming et de divertissement, 
              soigneusement choisis pour votre satisfaction.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-between mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex gap-4 items-center">
            <div className="text-sm text-accent">{filteredProducts.length} produit(s)</div>
            
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="iptv">IPTV</SelectItem>
                <SelectItem value="sharing">Sharing</SelectItem>
                <SelectItem value="vod">VOD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Plus récents</SelectItem>
              <SelectItem value="price-asc">Prix croissant</SelectItem>
              <SelectItem value="price-desc">Prix décroissant</SelectItem>
              <SelectItem value="rating">Avis clients</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="aspect-square overflow-hidden bg-white p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-medium">{product.price}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-accent">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Marketplace;
