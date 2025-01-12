import ProductCard from "../ProductCard";
import { useProducts } from "@/hooks/useProducts";

const ProductsSection = () => {
  const { products, isLoading } = useProducts();

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 px-4">Nos Services</h2>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Chargement des produits...</div>
          </div>
        </div>
      </section>
    );
  }

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
              rating={product.rating || 5}
              reviews={product.reviews || 0}
              paymentLink={product.payment_link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;