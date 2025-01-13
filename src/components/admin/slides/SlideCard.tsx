import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
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
}

interface SlideCardProps {
  slide: Slide;
  onEdit: (slide: Slide) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const SlideCard = ({ slide, onEdit, onDelete, isLoading }: SlideCardProps) => {
  const [editingSlide, setEditingSlide] = React.useState<Slide>(slide);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const handleEdit = () => {
    onEdit(editingSlide);
    setIsEditDialogOpen(false);
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-video">
        <img 
          src={slide.image} 
          alt={slide.title} 
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} to-transparent opacity-60`} />
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{slide.title}</h3>
          {slide.description && (
            <p className="text-sm text-gray-600 mt-1">{slide.description}</p>
          )}
        </div>

        <div className="flex gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" disabled={isLoading}>
                <Pencil className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier le Slide</DialogTitle>
                <DialogDescription>
                  Modifiez les informations du slide.
                </DialogDescription>
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
              <Button variant="destructive" size="icon" disabled={isLoading}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer le slide</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer ce slide ? Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(slide.id)} disabled={isLoading}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default SlideCard;