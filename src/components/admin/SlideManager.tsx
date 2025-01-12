import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { useSlides } from "@/hooks/useSlides";
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
  color: string;
}

const SlideManager = () => {
  const [newSlide, setNewSlide] = useState<Slide>({
    id: '',
    title: '',
    color: '',
    image: '',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { slides, invalidateSlides } = useSlides();

  const handleSlideCreate = async () => {
    if (!newSlide.title || !newSlide.color || !newSlide.image) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Tous les champs obligatoires doivent être remplis",
      });
      return;
    }

    const { error } = await supabase
      .from('slides')
      .insert([newSlide]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le slide",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Slide créé avec succès",
    });
    
    invalidateSlides();
    setNewSlide({
      id: '',
      title: '',
      color: '',
      image: '',
    });
    setIsDialogOpen(false);
  };

  const handleSlideUpdate = async (updatedSlide: Slide) => {
    if (!updatedSlide.title || !updatedSlide.color || !updatedSlide.image) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Tous les champs obligatoires doivent être remplis",
      });
      return;
    }

    const { error } = await supabase
      .from('slides')
      .update(updatedSlide)
      .eq('id', updatedSlide.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le slide",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Slide mis à jour avec succès",
    });
    
    invalidateSlides();
  };

  const handleSlideDelete = async (id: string) => {
    const { error } = await supabase
      .from('slides')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le slide",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Slide supprimé avec succès",
    });
    
    invalidateSlides();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Gestion des Slides</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map((slide) => (
          <SlideCard
            key={slide.id}
            slide={slide}
            onEdit={handleSlideUpdate}
            onDelete={handleSlideDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default SlideManager;