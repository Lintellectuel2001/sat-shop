
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
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
import SlideForm from './SlideForm';

interface Slide {
  id: string;
  title: string;
  description?: string;
  image: string;
  color: string;
  text_color?: string;
  order: number;
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
        <div className="absolute top-2 right-2 z-10 bg-black/50 px-2 py-1 rounded text-white text-sm">
          Ordre: {slide.order}
        </div>
        <img 
          src={slide.image} 
          alt={slide.title} 
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} to-transparent opacity-60`} />
        <div className={`absolute inset-0 p-4 flex flex-col justify-end ${slide.text_color || 'text-white'}`}>
          <h3 className="font-semibold text-lg">{slide.title}</h3>
          {slide.description && (
            <p className="text-sm mt-1">{slide.description}</p>
          )}
        </div>
      </div>
      
      <div className="p-4 flex gap-2">
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
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
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
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
