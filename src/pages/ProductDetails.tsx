import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const products = {
  1: {
    name: "IRON TV PRO",
    price: "3500 DA",
    rating: 5,
    reviews: 124,
    description: "Service IPTV premium avec accès à des milliers de chaînes et contenus VOD.",
    features: [
      "Accès à plus de 10000 chaînes TV",
      "Bibliothèque VOD extensive",
      "Haute qualité HD/4K",
      "Support technique 24/7",
      "Compatible avec tous les appareils"
    ],
    image: "/lovable-uploads/c5a3c89d-432f-4cef-a538-75a6da43c7e0.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9xhxpv4k98rp4mhbpbcrk6z",
    category: "iptv"
  },
  2: {
    name: "ATLAS PRO",
    price: "3000 DA",
    rating: 5,
    reviews: 98,
    description: "Service IPTV premium avec une expérience de visionnage exceptionnelle.",
    features: [
      "Large sélection de chaînes TV",
      "Contenu VOD varié",
      "Qualité HD/4K",
      "Support client réactif",
      "Multi-plateformes"
    ],
    image: "/lovable-uploads/36762d97-5db1-4e2c-9796-0de62a32cfde.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9ymqj9fbpggyvfjdcwxhfjq",
    category: "iptv"
  },
  3: {
    name: "FUNCAM",
    price: "1800 DA",
    rating: 5,
    reviews: 0,
    description: "Service de sharing premium pour une expérience de visionnage optimale.",
    features: [
      "Service de sharing fiable",
      "Installation facile",
      "Support technique disponible",
      "Mise à jour régulière",
      "Prix compétitif"
    ],
    image: "/lovable-uploads/ad1e441d-a579-4cf0-8c19-cf22e405d74b.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9ymfmt12rezgtbqt7abyftt",
    category: "sharing"
  }
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const product = products[Number(id)];

  if (!product) {
    navigate('/');
    return null;
  }

  const handleOrder = () => {
    window.location.href = product.paymentLink;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-white p-8">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-semibold text-primary">{product.price}</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-[#ffd700] text-[#ffd700]"
                  />
                ))}
                <span className="text-sm text-accent ml-2">
                  ({product.reviews} avis)
                </span>
              </div>
            </div>

            <p className="text-lg text-accent">{product.description}</p>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Caractéristiques:</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <Button 
              onClick={handleOrder}
              className="w-full lg:w-auto text-lg py-6 bg-primary hover:bg-primary/90"
            >
              Commander Maintenant
            </Button>

            <div className="bg-muted p-4 rounded-lg mt-8">
              <h3 className="font-semibold mb-2">Paiement sécurisé</h3>
              <p className="text-sm text-accent">
                Paiement sécurisé via Chargily. Livraison immédiate après confirmation du paiement.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;