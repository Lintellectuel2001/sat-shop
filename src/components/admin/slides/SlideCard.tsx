
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
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-video">
        <div className="absolute top-2 right-2 z-10 bg-black/50 px-2 py-1 rounded text-white text-xs sm:text-sm">
          Ordre: {slide.order}
        </div>
        
        <div className="absolute top-2 left-2 z-10 flex gap-1">
          {slide.blur_image && (
            <Badge variant="secondary" className="flex items-center gap-1 bg-black/50 text-white">
              <ImageOff className="h-3 w-3" />
              <span className="text-xs">Floutée</span>
            </Badge>
          )}
          
          {slide.is_4k_wallpaper && (
            <Badge variant="secondary" className="flex items-center gap-1 bg-black/50 text-white">
              <Wallpaper className="h-3 w-3" />
              <span className="text-xs">4K</span>
            </Badge>
          )}
        </div>
        
        <img 
          src={slide.image} 
          alt={slide.title} 
          className={`w-full h-full object-cover ${slide.blur_image ? 'blur-sm' : ''}`}
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm opacity-60"></div>
        <div className={`absolute inset-0 p-2 sm:p-4 flex flex-col justify-end ${slide.text_color || 'text-white'}`}>
          <h3 className="font-semibold text-base sm:text-lg line-clamp-2">{slide.title}</h3>
          {slide.description && (
            <p className="text-xs sm:text-sm mt-1 line-clamp-2 opacity-90">{slide.description}</p>
          )}
        </div>
      </div>
      
      <div className="p-2 sm:p-4 flex gap-2 justify-end">
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
              <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Modifier le Slide</DialogTitle>
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
            <Button variant="destructive" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Le slide sera définitivement supprimé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(slide.id)}>
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
