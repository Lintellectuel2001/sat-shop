import ProductCard from "../ProductCard";

const products = [
  {
    id: 1,
    name: "IRON TV PRO",
    price: "3500 DA",
    rating: 5,
    reviews: 124,
    image: "/lovable-uploads/c5a3c89d-432f-4cef-a538-75a6da43c7e0.png",
    paymentLink: "https://pay.chargily.com/payment-links/01j9xhxpv4k98rp4mhbpbcrk6z"
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