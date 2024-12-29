import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";

const productDetails = {
  1: {
    name: "IRON TV PRO",
    price: "3500 DA",
    rating: 5,
    reviews: 124,
    description: "IRON IPTV est l'un des meilleurs services de TV en ligne sur lequel vous pouvez compter.\n\nPériode d'abonnement : code test de 2 jours\n\nChaînes disponibles : Italie, Espagne, Portugal, USA, Allemagne, Arabes OSN – MBC – ROTANA – ART, Pologne, Inde, Latino, Afrique, Albanie, Hongrie, Suède, Norvège, Danemark, Serbie, Croatie, Bosnie, et plus encore.\n\nPacks inclus : C-sat – RMC – Bei*n Sports ... DS*TV, derniers films et séries avec chaînes box-office",
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
      }
    },
    image: "/lovable-uploads/c5a3c89d-432f-4cef-a538-75a6da43c7e0.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9xhxpv4k98rp4mhbpbcrk6z"
  },
  2: {
    name: "ATLAS PRO",
    price: "3000 DA",
    rating: 5,
    reviews: 98,
    description: "ABONNEMENT IPTV ATLAS PRO ONTV\n\nATLAS PRO ONTV à travers son application officielle vous offre l'accès à la TV et à la VOD (séries et films) ainsi qu'au replay (rediffusion)\n\nABONNEMENT IPTV, STABLE ET RAPIDE\n\nL'abonnement IPTV Atlas iptv pro ontv vous offre :\n\nChaînes disponibles : France, Belgique, Suisse, Algérie, Maroc, Tunisie.\nAutres pays : Espagne, Portugal, Italie, Allemagne, Pays-Bas, Arabe, UK, Latino, Turquie, USA, Canada, Afrique, etc.",
    features: [
      "Plus de 7000 chaînes TV",
      "30000 films et 563 séries",
      "107 chaînes en replay (15 jours)",
      "188 canaux français en FHD/UHD/HD/SD",
      "VOD en Full HD et multilingue",
      "Reprise automatique de la lecture"
    ],
    downloadInfo: {
      atlasPro: {
        directLink: "https://atlaspro.tv/soft/ATLAS%20PRO%20ONTV%283.0%29.apk",
        downloaderCode: "727750"
      }
    },
    image: "/lovable-uploads/36762d97-5db1-4e2c-9796-0de62a32cfde.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9ymqj9fbpggyvfjdcwxhfjq"
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
    name: "AROMA VOD",
    price: "3500 DA",
    rating: 5,
    reviews: 0,
    description: "AROMA VOD est votre destination ultime pour le divertissement à la demande.\n\nDécouvrez une expérience de streaming exceptionnelle avec :\n\n- Une vaste collection de films et séries\n- Des contenus en haute qualité\n- Des mises à jour régulières\n- Une interface simple et intuitive\n- Un accès illimité à tout moment",
    features: [
      "Plus de 30,000 films et séries",
      "Qualité HD/4K disponible",
      "Mise à jour quotidienne",
      "Support multilingue",
      "Compatible avec tous les appareils",
      "Sans publicité",
      "Support technique disponible"
    ],
    image: "/lovable-uploads/44e8e9d8-54b5-4a66-bd3a-3532ba01ba4a.png",
    paymentLink: "https://pay.chargily.com/payment-links/01jg3njrh0zgahz0b18ht7t1fr"
  },
  13: {
    name: "KDMAX VOD",
    price: "5000 DA",
    rating: 5,
    reviews: 0,
    description: "KDMAX VOD est votre passerelle vers un univers de divertissement illimité.\n\nProfitez d'une expérience de streaming exceptionnelle avec notre service VOD premium qui vous donne accès à :\n\n- Une bibliothèque massive de films et séries\n- Des contenus en qualité HD/4K\n- Des mises à jour régulières avec les dernières sorties\n- Une interface utilisateur intuitive et facile à naviguer",
    features: [
      "Plus de 50,000 films et séries",
      "Qualité HD/4K garantie",
      "Mise à jour hebdomadaire",
      "Support multilingue",
      "Compatible avec tous les appareils",
      "Pas de publicité",
      "Support technique 24/7"
    ],
    image: "/lovable-uploads/17e06898-b337-4bcf-9a97-0b7d8470131b.png",
    paymentLink: "https://pay.chargily.com/payment-links/01jg3nn6q4ntympfp7fjcfrvqe"
  },
  14: {
    name: "STRONG",
    price: "7000 DA",
    rating: 5,
    reviews: 0,
    description: "STRONG IPTV offre une solution premium pour tous vos besoins en streaming.\n\nNotre service se distingue par :\n\n- Une stabilité exceptionnelle\n- Une qualité d'image supérieure\n- Un large choix de chaînes internationales\n- Des fonctionnalités avancées pour une expérience utilisateur optimale",
    features: [
      "Plus de 15,000 chaînes en direct",
      "Bibliothèque VOD extensive",
      "Qualité HD/4K",
      "Support EPG complet",
      "Compatibilité multi-appareils",
      "Bande passante illimitée",
      "Support technique premium"
    ],
    image: "/lovable-uploads/fac26b9d-f35d-48b9-80a9-52532bfd2b7d.png",
    paymentLink: "https://pay.chargily.com/payment-links/01jg3nrvgvj0866k3nrkgeeqtk"
  },
  15: {
    name: "FOREVER",
    price: "3800 DA",
    rating: 5,
    reviews: 0,
    description: "FOREVER est votre solution de partage premium pour un accès illimité au divertissement.\n\nNos services incluent :\n\n- Accès à des chaînes premium\n- Service de partage stable et fiable\n- Support technique réactif\n- Mise à jour régulière des contenus",
    features: [
      "Service de partage haute performance",
      "Installation simple et rapide",
      "Support technique disponible",
      "Accès aux chaînes premium",
      "Stabilité garantie",
      "Prix compétitif",
      "Mises à jour régulières"
    ],
    image: "/lovable-uploads/4cc51239-9c88-4de2-a963-9ef404192fbd.png",
    paymentLink: "https://pay.chargily.com/payment-links/01jg3rgcvpyz45gjt6pccdqg4b"
  },
  16: {
    name: "DAR IPTV",
    price: "3500 DA",
    rating: 5,
    reviews: 0,
    description: "DAR IPTV vous offre une expérience de streaming complète et personnalisée.\n\nDécouvrez :\n\n- Une sélection premium de chaînes TV\n- Des contenus VOD régulièrement mis à jour\n- Une interface utilisateur intuitive\n- Un service client attentif à vos besoins",
    features: [
      "Plus de 12,000 chaînes en direct",
      "Bibliothèque VOD riche",
      "Qualité HD/FHD/4K",
      "Guide des programmes électronique",
      "Compatible avec tous les appareils",
      "Support technique réactif",
      "Mises à jour continues"
    ],
    image: "/lovable-uploads/12c93610-15eb-477e-9b8f-34182fdedaae.png",
    paymentLink: "https://pay.chargily.com/payment-links/01jg3ry0bth7g4qs6381gdzc22"
  }
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!productDetails[Number(id)]) {
      navigate('/');
    }
  }, [id, navigate]);

  const product = productDetails[Number(id)];

  if (!product) {
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
            description={product.description}
            features={product.features}
            downloadInfo={product.downloadInfo}
            onOrder={() => {}}
            paymentLink={product.paymentLink}
          />
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
