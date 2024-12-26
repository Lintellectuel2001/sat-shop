import ProductCard from "../ProductCard";
import { products } from "@/data/products";

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
              paymentLink={product.paymentLink}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;