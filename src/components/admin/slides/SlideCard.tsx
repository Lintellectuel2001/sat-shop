
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Image, ImageOff, Wallpaper } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import SlideForm from './SlideForm';

interface Slide {
  id: string;
  title: string;
  description?: string;
  image: string;
  color?: string;
  text_color?: string;
  order: number;
  blur_image?: boolean;
  is_4k_wallpaper?: boolean;
}

interface SlideCardProps {
  slide: Slide;
  onEdit: (slide: Slide) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const SlideCard = ({ slide, onEdit, onDelete, isLoading }: SlideCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide>(slide);

  const handleEdit = () => {
    onEdit(editingSlide);
    setIsEditDialogOpen(false);
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-500 card-modern hover-lift perspective-container">
      <div className="relative aspect-video overflow-hidden">
        <div className="absolute top-2 right-2 z-10 bg-black/50 px-2 py-1 rounded text-white text-xs sm:text-sm backdrop-blur-sm hover-lift">
          Ordre: {slide.order}
        </div>
        
        <div className="absolute top-2 left-2 z-10 flex gap-1">
          {slide.blur_image && (
            <Badge variant="secondary" className="flex items-center gap-1 bg-black/50 text-white hover-lift neon-glow">
              <ImageOff className="h-3 w-3 animate-pulse" />
              <span className="text-xs">Floutée</span>
            </Badge>
          )}
          
          {slide.is_4k_wallpaper && (
            <Badge variant="secondary" className="flex items-center gap-1 bg-black/50 text-white hover-lift pulse-3d">
              <Wallpaper className="h-3 w-3 animate-pulse" />
              <span className="text-xs">4K</span>
            </Badge>
          )}
        </div>
        
        <img 
          src={slide.image} 
          alt={slide.title} 
          className={`w-full h-full object-cover hover-lift transform-gpu ${slide.blur_image ? 'blur-sm' : ''}`}
          style={{ 
            filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.1))',
            transformStyle: 'preserve-3d'
          }}
        />
        
        {/* Effet holographique */}
        <div className="absolute inset-0 holographic opacity-20"></div>
        
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
        <div className={`absolute inset-0 p-2 sm:p-4 flex flex-col justify-end ${slide.text_color || 'text-white'} hover-lift`}>
          <h3 className="font-semibold text-base sm:text-lg line-clamp-2 gradient-text animate-fade-in">{slide.title}</h3>
          {slide.description && (
            <p className="text-xs sm:text-sm mt-1 line-clamp-2 opacity-90 animate-fade-in" style={{ animationDelay: '0.2s' }}>{slide.description}</p>
          )}
        </div>

        {/* Particules flottantes */}
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-accent-400 rounded-full animate-parallax opacity-50"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-purple-400 rounded-full animate-parallax opacity-30" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="p-2 sm:p-4 flex gap-2 justify-end bg-gradient-to-r from-white to-primary-50">
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hover-lift ripple-effect neon-glow">
              <Pencil className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] card-modern">
            <DialogHeader>
              <DialogTitle className="gradient-text">Modifier le Slide</DialogTitle>
            </DialogHeader>
            <SlideForm
              slide={editingSlide}
              onSlideChange={(field, value) => 
                setEditingSlide({ ...editingSlide, [field]: value })
              }
              onSubmit={handleEdit}
              submitLabel="Mettre à jour"
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 hover-lift ripple-effect pulse-3d">
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="card-modern">
            <AlertDialogHeader>
              <AlertDialogTitle className="gradient-text">Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription className="hover-lift">
                Cette action est irréversible. Le slide sera définitivement supprimé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="hover-lift">Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(slide.id)} className="hover-lift ripple-effect">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default SlideCard;
