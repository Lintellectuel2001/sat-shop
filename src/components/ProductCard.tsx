
import { Star, Share2, Package, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WishlistButton from "./wishlist/WishlistButton";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id?: string;
  name: string;
  price: string;
  image: string;
  rating: number;
  reviews: number;
  paymentLink?: string;
  isAvailable?: boolean;
  isPhysical?: boolean;
  stockQuantity?: number;
}

const ProductCard = ({ 
  id = "1", 
  name, 
  price, 
  image, 
  rating, 
  reviews, 
  paymentLink,
  isAvailable = true,
  isPhysical = false,
  stockQuantity
}: ProductCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);

  const handleClick = () => {
    if (id) {
      navigate(`/product/${id}`);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation(); // Éviter de naviguer vers la page produit
    setIsSharing(true);
    
    const shareUrl = `${window.location.origin}/product/${id}`;
    
    if (navigator.share) {
      navigator.share({
        title: name,
        text: `Découvrez ${name}`,
        url: shareUrl,
      })
      .catch((error) => console.log('Erreur de partage', error))
      .finally(() => setIsSharing(false));
    } else {
      // Copier le lien si le partage natif n'est pas supporté
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          toast({
            title: "Lien copié",
            description: "Le lien du produit a été copié dans le presse-papier",
          });
        })
        .catch(() => {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de copier le lien",
          });
        })
        .finally(() => setIsSharing(false));
    }
  };

  const getStockBadge = () => {
    if (!isPhysical) return null;
    
    if (stockQuantity === 0) {
      return (
        <Badge variant="destructive" className="absolute top-2 left-2 flex items-center">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Épuisé
        </Badge>
      );
    } else if (stockQuantity && stockQuantity <= 5) {
      return (
        <Badge className="absolute top-2 left-2 bg-amber-500">
          <Package className="h-3 w-3 mr-1" />
          Stock limité
        </Badge>
      );
    }
    
    return null;
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
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={handleShare}
            className="bg-white/80 hover:bg-white p-2 rounded-full text-accent hover:text-accent/80 transition-colors"
            disabled={isSharing}
            aria-label="Partager ce produit"
          >
            <Share2 size={18} />
          </button>
          <WishlistButton 
            productId={id} 
            className="bg-white/80 hover:bg-white"
          />
        </div>
        {/* Availability badge */}
        <Badge 
          className={`absolute bottom-2 right-2 ${
            isAvailable 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {isAvailable ? 'Disponible' : 'Non Disponible'}
        </Badge>
        
        {/* Stock badge */}
        {getStockBadge()}
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
