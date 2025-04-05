
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import SlideForm from './slides/SlideForm';
import SlideCard from './slides/SlideCard';

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

interface SlideManagerProps {
  slides: Slide[];
  onSlidesChange: () => void;
}

const SlideManager = ({ slides, onSlidesChange }: SlideManagerProps) => {
  const [newSlide, setNewSlide] = useState<Slide>({
    id: '',
    title: '',
    description: '',
    image: '',
    text_color: 'text-white',
    order: 0,
    blur_image: false,
    is_4k_wallpaper: false,
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSlideCreate = async () => {
    if (!newSlide.title || !newSlide.image) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Tous les champs obligatoires doivent être remplis",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('slides')
        .insert([{
          title: newSlide.title,
          description: newSlide.description,
          image: newSlide.image,
          text_color: newSlide.text_color,
          order: newSlide.order,
          blur_image: newSlide.blur_image,
          is_4k_wallpaper: newSlide.is_4k_wallpaper
        }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Slide créé avec succès",
      });
      
      onSlidesChange();
      setNewSlide({
        id: '',
        title: '',
        description: '',
        image: '',
        text_color: 'text-white',
        order: 0,
        blur_image: false,
        is_4k_wallpaper: false,
      });
      setIsCreateDialogOpen(false);
    } catch (error: any) {
      console.error('Error creating slide:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de créer le slide",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlideUpdate = async (updatedSlide: Slide) => {
    if (!updatedSlide.title || !updatedSlide.image) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Tous les champs obligatoires doivent être remplis",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('slides')
        .update({
          title: updatedSlide.title,
          description: updatedSlide.description,
          image: updatedSlide.image,
          text_color: updatedSlide.text_color,
          order: updatedSlide.order,
          blur_image: updatedSlide.blur_image,
          is_4k_wallpaper: updatedSlide.is_4k_wallpaper
        })
        .eq('id', updatedSlide.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Slide mis à jour avec succès",
      });
      
      onSlidesChange();
    } catch (error: any) {
      console.error('Error updating slide:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le slide",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlideDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('slides')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Slide supprimé avec succès",
      });
      
      onSlidesChange();
    } catch (error: any) {
      console.error('Error deleting slide:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de supprimer le slide",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sortedSlides = [...slides].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Gestion des Slides</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Slide
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un Slide</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer un nouveau slide.
              </DialogDescription>
            </DialogHeader>
            <SlideForm
              slide={newSlide}
              onSlideChange={(field, value) => 
                setNewSlide({ ...newSlide, [field]: value })
              }
              onSubmit={handleSlideCreate}
              submitLabel="Créer"
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedSlides.map((slide) => (
          <SlideCard
            key={slide.id}
            slide={slide}
            onEdit={handleSlideUpdate}
            onDelete={handleSlideDelete}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default SlideManager;
