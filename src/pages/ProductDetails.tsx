import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import ProductHeader from "@/components/product/ProductHeader";
import ProductFeatures from "@/components/product/ProductFeatures";
import ProductDescription from "@/components/product/ProductDescription";

const products = {
  1: {
    name: "IRON TV PRO",
    price: "3500 DA",
    rating: 5,
    reviews: 124,
    description: "IRON IPTV is one of the best online TV you can rely on,\n\nSubscription Period: 2-day test code\n\nItalian, Spain, Portugal, USA, Germany, Arabic OSN – MBC – ROTANA – ART, Poland, Indi, Latino, African, Albanian, Hungarian, Sweden, Norway, Denmark, Serbia, Croatia, Bosnia, India, and more.\n\nIncluded Packs C-sat – RMC – Bei*n Sports channels …DS*TV) latest films and series with box office channels",
    features: [
      "Accès à plus de 10000 chaînes TV",
      "Bibliothèque VOD extensive",
      "Haute qualité HD/4K",
      "Support technique 24/7",
      "Compatible avec tous les appareils"
    ],
    downloadInfo: {
      ironTvPro: {
        directLinks: ["https://ironiptv.net/iron-pro.apk", "aftv.news/272540"],
        downloaderCodes: ["272540", "635983"]
      },
      ironTvMax: {
        directLinks: ["aftv.news/486041", "aftv.news/557293"],
        downloaderCodes: ["486041", "965085", "557293"]
      },
      noxPro: {
        directLink: "aftv.news/542064",
        downloaderCode: "542064"
      }
    },
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
  },
  4: {
    name: "GOGO IPTV",
    price: "3000 DA",
    rating: 5,
    reviews: 0,
    description: "Service IPTV haute performance avec une vaste sélection de contenus.",
    features: [
      "Grande variété de chaînes internationales",
      "Interface utilisateur intuitive",
      "Qualité d'image supérieure",
      "Support client dédié",
      "Mises à jour régulières"
    ],
    image: "/lovable-uploads/ac2683f4-4da0-488c-ba1f-4d0478e9a991.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9ymxw0sg2szb0a987dhx9y1",
    category: "iptv"
  },
  5: {
    name: "MY HD",
    price: "2000 DA",
    rating: 5,
    reviews: 0,
    description: "Solution IPTV complète pour tous vos besoins de divertissement.",
    features: [
      "Chaînes HD premium",
      "Service stable et fiable",
      "Interface conviviale",
      "Support technique disponible",
      "Prix attractif"
    ],
    image: "/lovable-uploads/6e4a8cf4-1a86-41dd-88ba-6f5ca84ba7fe.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9yn1angy3xsk301b98e56v1",
    category: "iptv"
  },
  6: {
    name: "ORCA PRO",
    price: "3500 DA",
    rating: 5,
    reviews: 0,
    description: "Service IPTV professionnel avec des fonctionnalités avancées.",
    features: [
      "Contenu premium en HD/4K",
      "Large sélection de chaînes",
      "Service stable et rapide",
      "Support technique 24/7",
      "Compatible multi-appareils"
    ],
    image: "/lovable-uploads/66304b90-e140-4a42-b75d-d8938d8d11c6.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9ymyx1ev9sh162mj67qa59q",
    category: "iptv"
  },
  7: {
    name: "POP IPTV",
    price: "3000 DA",
    rating: 5,
    reviews: 0,
    description: "Service IPTV populaire avec une excellente qualité de streaming.",
    features: [
      "Chaînes internationales",
      "Contenu VOD varié",
      "Haute qualité de streaming",
      "Support réactif",
      "Installation simple"
    ],
    image: "/lovable-uploads/96c11b10-32d5-42e0-8182-4b7a9ba2154d.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9yn026m076hjmhd1mev9rjs",
    category: "iptv"
  },
  8: {
    name: "DREAM IPTV",
    price: "3000 DA",
    rating: 5,
    reviews: 0,
    description: "Réalisez vos rêves de divertissement avec notre service IPTV premium.",
    features: [
      "Vaste bibliothèque de contenus",
      "Qualité HD garantie",
      "Interface utilisateur moderne",
      "Support client premium",
      "Mises à jour fréquentes"
    ],
    image: "/lovable-uploads/5ff839f5-dc44-4d86-98da-9b6d5b041e81.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9ymsckhqd8qqcgr35tyr4gc",
    category: "iptv"
  },
  9: {
    name: "IRON TV",
    price: "3000 DA",
    rating: 5,
    reviews: 0,
    description: "Service IPTV fiable avec une qualité de diffusion exceptionnelle.",
    features: [
      "Large choix de chaînes",
      "Streaming haute qualité",
      "Service stable",
      "Support technique disponible",
      "Prix compétitif"
    ],
    image: "/lovable-uploads/1c875639-253e-4953-b461-1dba3e5aa8c4.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9ymwapfq0y9kjcsjway9xh9",
    category: "iptv"
  },
  10: {
    name: "ES-PRO",
    price: "3000 DA",
    rating: 5,
    reviews: 0,
    description: "Solution IPTV professionnelle pour une expérience TV incomparable.",
    features: [
      "Chaînes premium en HD",
      "Service professionnel",
      "Performance optimale",
      "Support dédié",
      "Mise à jour continue"
    ],
    image: "/lovable-uploads/515ea47f-412f-4b76-9df3-d7d0a5d62378.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9ymtvhx6xam5dk7vksej0yw",
    category: "iptv"
  },
  11: {
    name: "VANNILLA",
    price: "1200 DA",
    rating: 5,
    reviews: 0,
    description: "Service de sharing simple et efficace à prix attractif.",
    features: [
      "Service sharing stable",
      "Configuration facile",
      "Support basique inclus",
      "Prix accessible",
      "Bon rapport qualité-prix"
    ],
    image: "/lovable-uploads/9e1bdf86-f879-4165-a2ac-ec025ed3d82c.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9xj2mgn28nnajwa5jbm1yhe",
    category: "sharing"
  },
  12: {
    name: "G-SHAIRE",
    price: "2500 DA",
    rating: 5,
    reviews: 0,
    description: "Service de sharing premium avec une excellente stabilité.",
    features: [
      "Sharing haute performance",
      "Installation guidée",
      "Support technique inclus",
      "Service fiable",
      "Mises à jour régulières"
    ],
    image: "/lovable-uploads/4eb70ddd-f939-43e6-a24f-4a9228a2bd9a.png",
    paymentLink: "https://pay.chargily.dz/checkouts/01jg1gfmfhcrd5krhq41b24352/pay",
    category: "sharing"
  }
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!products[Number(id)]) {
      navigate('/');
    }
  }, [id, navigate]);

  const product = products[Number(id)];

  if (!product) {
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
            <ProductHeader
              name={product.name}
              price={product.price}
              rating={product.rating}
              reviews={product.reviews}
            />

            <ProductDescription 
              description={product.description}
              downloadInfo={product.downloadInfo}
            />

            <ProductFeatures features={product.features} />

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