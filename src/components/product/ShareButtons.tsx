import React from 'react';
import { Facebook, Twitter, Linkedin, Mail, Copy, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
interface ShareButtonsProps {
  productName: string;
  productId: string;
  className?: string;
}
const ShareButtons = ({
  productName,
  productId,
  className
}: ShareButtonsProps) => {
  const {
    toast
  } = useToast();
  const shareUrl = `${window.location.origin}/product/${productId}`;
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Lien copié",
        description: "Le lien a été copié dans le presse-papier"
      });
    }).catch(() => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de copier le lien"
      });
    });
  };
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };
  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Découvrez ${productName}`)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };
  const shareOnLinkedin = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };
  const shareByEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(`Découvrez ce produit : ${productName}`)}&body=${encodeURIComponent(`Salut, je pense que ce produit pourrait t'intéresser : ${shareUrl}`)}`, '_blank');
  };
  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: productName,
        text: `Découvrez ${productName}`,
        url: shareUrl
      }).catch(error => console.log('Erreur de partage', error));
    } else {
      toast({
        variant: "destructive",
        title: "Non supporté",
        description: "Le partage natif n'est pas supporté par votre navigateur"
      });
    }
  };
  return <div className={cn("space-y-4 bg-muted p-6 rounded-lg", className)}>
      <h3 className="font-semibold text-lg">Partager ce produit</h3>
      <div className="flex flex-wrap gap-2">
        <Button onClick={shareOnFacebook} variant="outline" size="sm" className="flex items-center gap-2">
          <Facebook size={18} className="text-[#4267B2]" />
          <span className="hidden sm:inline">Facebook</span>
        </Button>
        
        <Button onClick={shareOnTwitter} variant="outline" size="sm" className="flex items-center gap-2">
          <Twitter size={18} className="text-[#1DA1F2] bg-gray-100" />
          <span className="hidden sm:inline">Twitter</span>
        </Button>
        
        <Button onClick={shareOnLinkedin} variant="outline" size="sm" className="flex items-center gap-2">
          <Linkedin size={18} className="text-[#0077B5]" />
          <span className="hidden sm:inline">LinkedIn</span>
        </Button>
        
        <Button onClick={shareByEmail} variant="outline" size="sm" className="flex items-center gap-2">
          <Mail size={18} className="text-muted-foreground bg-muted" />
          <span className="hidden sm:inline">Email</span>
        </Button>
        
        <Button onClick={handleCopyLink} variant="outline" size="sm" className="flex items-center gap-2">
          <Copy size={18} className="text-muted-foreground" />
          <span className="hidden sm:inline">Copier le lien</span>
        </Button>
        
        {navigator.share && <Button onClick={handleNativeShare} variant="outline" size="sm" className="flex items-center gap-2">
            <Share2 size={18} className="text-accent" />
            <span className="hidden sm:inline">Partager</span>
          </Button>}
      </div>
    </div>;
};
export default ShareButtons;