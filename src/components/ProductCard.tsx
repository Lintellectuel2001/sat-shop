
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WishlistButton from "./wishlist/WishlistButton";

interface ProductCardProps {
  id?: string;
  name: string;
  price: string;
  image: string;
  rating: number;
  reviews: number;
  paymentLink?: string;
}

const ProductCard = ({ id = "1", name, price, image, rating, reviews, paymentLink }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (id) {
      navigate(`/product/${id}`);
    }
  };

  return (
    <div 
      className="group bg-white rounded-2xl overflow-hidden shadow-elegant hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onClick={handleClick}
    >
      <div className="aspect-square overflow-hidden bg-muted p-6 relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <WishlistButton 
            productId={id} 
            className="bg-white/80 hover:bg-white"
          />
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-primary">{name}</h3>
        <p className="text-accent font-medium mt-2">{price}</p>
        <div className="flex items-center gap-1 mt-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rating ? "fill-[#8B5CF6] text-[#8B5CF6]" : "text-gray-200"
              }`}
            />
          ))}
          <span className="text-sm text-primary/60 ml-2">({reviews})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
