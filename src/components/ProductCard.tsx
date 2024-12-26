import { Star } from "lucide-react";

interface ProductCardProps {
  id?: number;
  name: string;
  price: string;
  image: string;
  rating: number;
  reviews: number;
  paymentLink?: string;
}

const ProductCard = ({ id = 1, name, price, image, rating, reviews, paymentLink }: ProductCardProps) => {
  const handleClick = () => {
    if (paymentLink) {
      window.location.href = paymentLink;
    }
  };

  return (
    <div 
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-primary">{name}</h3>
        <p className="text-accent mt-1">{price}</p>
        <div className="flex items-center gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rating ? "fill-[#ffd700] text-[#ffd700]" : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-sm text-accent ml-2">({reviews})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;