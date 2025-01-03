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
}

const SlideCard = ({ slide, onEdit, onDelete }: SlideCardProps) => {
  const [editingSlide, setEditingSlide] = React.useState<Slide>(slide);

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <img src={slide.image} alt={slide.title} className="w-full h-48 object-cover rounded" />
      <h3 className="font-semibold">{slide.title}</h3>
      <p>{slide.description}</p>
      <div className="flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
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
              onSubmit={() => onEdit(editingSlide)}
              submitLabel="Mettre à jour"
            />
          </DialogContent>
        </Dialog>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(slide.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SlideCard;