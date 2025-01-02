export interface Product {
  id: number;
  name: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  paymentLink: string;
  category: "iptv" | "sharing" | "vod";
  features: string[];
  description: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "IRON TV PRO",
    price: "3500 DA",
    rating: 5,
    reviews: 124,
    image: "/lovable-uploads/c5a3c89d-432f-4cef-a538-75a6da43c7e0.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9xhxpv4k98rp4mhbpbcrk6z",
    category: "iptv",
    features: ["Feature 1", "Feature 2"],
    description: "Description for IRON TV PRO"
  },
  {
    id: 2,
    name: "ATLAS PRO",
    price: "3000 DA",
    rating: 5,
    reviews: 98,
    image: "/lovable-uploads/36762d97-5db1-4e2c-9796-0de62a32cfde.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9ymqj9fbpggyvfjdcwxhfjq",
    category: "iptv",
    features: ["Feature 1", "Feature 2"],
    description: "Description for ATLAS PRO"
  },
  {
    id: 3,
    name: "FUNCAM",
    price: "1800 DA",
    rating: 5,
    reviews: 0,
    image: "/lovable-uploads/5d30c694-4d3d-4a18-a1ac-f2ee345c63e7.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9ymfmt12rezgtbqt7abyftt",
    category: "sharing",
    features: ["Feature 1", "Feature 2"],
    description: "Description for FUNCAM"
  },
  {
    id: 4,
    name: "GOGO IPTV",
    price: "3000 DA",
    rating: 5,
    reviews: 0,
    image: "/lovable-uploads/ac2683f4-4da0-488c-ba1f-4d0478e9a991.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9ymxw0sg2szb0a987dhx9y1",
    category: "iptv",
    features: ["Feature 1", "Feature 2"],
    description: "Description for GOGO IPTV"
  },
  {
    id: 5,
    name: "MY HD",
    price: "2000 DA",
    rating: 5,
    reviews: 0,
    image: "/lovable-uploads/6e4a8cf4-1a86-41dd-88ba-6f5ca84ba7fe.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9yn1angy3xsk301b98e56v1",
    category: "iptv",
    features: ["Feature 1", "Feature 2"],
    description: "Description for MY HD"
  },
  {
    id: 6,
    name: "ORCA PRO",
    price: "3500 DA",
    rating: 5,
    reviews: 0,
    image: "/lovable-uploads/66304b90-e140-4a42-b75d-d8938d8d11c6.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9ymyx1ev9sh162mj67qa59q",
    category: "iptv",
    features: ["Feature 1", "Feature 2"],
    description: "Description for ORCA PRO"
  },
  {
    id: 7,
    name: "POP IPTV",
    price: "3000 DA",
    rating: 5,
    reviews: 0,
    image: "/lovable-uploads/96c11b10-32d5-42e0-8182-4b7a9ba2154d.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9yn026m076hjmhd1mev9rjs",
    category: "iptv",
    features: ["Feature 1", "Feature 2"],
    description: "Description for POP IPTV"
  },
  {
    id: 8,
    name: "DREAM IPTV",
    price: "3000 DA",
    rating: 5,
    reviews: 0,
    image: "/lovable-uploads/5ff839f5-dc44-4d86-98da-9b6d5b041e81.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9ymsckhqd8qqcgr35tyr4gc",
    category: "iptv",
    features: ["Feature 1", "Feature 2"],
    description: "Description for DREAM IPTV"
  },
  {
    id: 9,
    name: "IRON TV",
    price: "3000 DA",
    rating: 5,
    reviews: 0,
    image: "/lovable-uploads/1c875639-253e-4953-b461-1dba3e5aa8c4.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9ymwapfq0y9kjcsjway9xh9",
    category: "iptv",
    features: ["Feature 1", "Feature 2"],
    description: "Description for IRON TV"
  },
  {
    id: 10,
    name: "ES-PRO",
    price: "3000 DA",
    rating: 5,
    reviews: 0,
    image: "/lovable-uploads/515ea47f-412f-4b76-9df3-d7d0a5d62378.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9ymtvhx6xam5dk7vksej0yw",
    category: "iptv",
    features: ["Feature 1", "Feature 2"],
    description: "Description for ES-PRO"
  },
  {
    id: 11,
    name: "VANNILLA",
    price: "1200 DA",
    rating: 5,
    reviews: 0,
    image: "/lovable-uploads/693e9dff-74bd-44ee-9d23-ab487242037a.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9xj2mgn28nnajwa5jbm1yhe",
    category: "sharing",
    features: ["Feature 1", "Feature 2"],
    description: "Description for VANNILLA"
  },
  {
    id: 12,
    name: "AROMA VOD",
    price: "3500 DA",
    rating: 5,
    reviews: 0,
    image: "/lovable-uploads/e5afcd08-509b-4908-a29d-4b17c15cc78f.png",
    paymentLink: "https://pay.chargily.com/payment-links/01jg3njrh0zgahz0b18ht7t1fr",
    category: "vod",
    features: ["Feature 1", "Feature 2"],
    description: "Description for AROMA VOD"
  },
  {
    id: 13,
    name: "KDMAX VOD",
    price: "5000 DA",
    rating: 5,
    reviews: 0,
    image: "/lovable-uploads/17e06898-b337-4bcf-9a97-0b7d8470131b.png",
    paymentLink: "https://pay.chargily.com/payment-links/01jg3nn6q4ntympfp7fjcfrvqe",
    category: "vod",
    features: ["Feature 1", "Feature 2"],
    description: "Description for KDMAX VOD"
  },
  {
    id: 14,
    name: "STRONG",
    price: "7000 DA",
    rating: 5,
    reviews: 0,
    image: "/lovable-uploads/fac26b9d-f35d-48b9-80a9-52532bfd2b7d.png",
    paymentLink: "https://pay.chargily.com/payment-links/01jg3nrvgvj0866k3nrkgeeqtk",
    category: "iptv",
    features: ["Feature 1", "Feature 2"],
    description: "Description for STRONG"
  },
  {
    id: 15,
    name: "FOREVER",
    price: "3800 DA",
    rating: 5,
    reviews: 0,
    image: "/lovable-uploads/4cc51239-9c88-4de2-a963-9ef404192fbd.png",
    paymentLink: "https://pay.chargily.com/payment-links/01jg3rgcvpyz45gjt6pccdqg4b",
    category: "sharing",
    features: ["Feature 1", "Feature 2"],
    description: "Description for FOREVER"
  },
  {
    id: 16,
    name: "DAR IPTV",
    price: "3500 DA",
    rating: 5,
    reviews: 0,
    image: "/lovable-uploads/12c93610-15eb-477e-9b8f-34182fdedaae.png",
    paymentLink: "https://pay.chargily.com/payment-links/01jg3ry0bth7g4qs6381gdzc22",
    category: "iptv",
    features: ["Feature 1", "Feature 2"],
    description: "Description for DAR IPTV"
  }
];
