import ProductCard from "../ProductCard";

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

const ProductsSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 px-4">Nos Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              rating={product.rating}
              reviews={product.reviews}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
