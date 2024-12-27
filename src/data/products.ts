export interface Product {
  id: number;
  name: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  paymentLink: string;
  category: "iptv" | "sharing" | "vod";
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
  },
  {
    id: 10,
    name: "ES-PRO",
    price: "3000 DA",
    rating: 5,
    reviews: 0,
    image: "/lovable-uploads/515ea47f-412f-4b76-9df3-d7d0a5d62378.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9ymtvhx6xam5dk7vksej0yw",
    category: "iptv"
  },
  {
    id: 11,
    name: "VANNILLA",
    price: "1200 DA",
    rating: 5,
    reviews: 0,
    image: "/lovable-uploads/9e1bdf86-f879-4165-a2ac-ec025ed3d82c.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9xj2mgn28nnajwa5jbm1yhe",
    category: "sharing"
  },
  {
    id: 12,
    name: "AROMA VOD",
    price: "3500 DA",
    rating: 5,
    reviews: 0,
    image: "/lovable-uploads/44e8e9d8-54b5-4a66-bd3a-3532ba01ba4a.png",
    paymentLink: "https://pay.chargily.com/payment-links/01jg3njrh0zgahz0b18ht7t1fr",
    category: "vod"
  }
];