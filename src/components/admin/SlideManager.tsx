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
  color: string;
}

interface SlideManagerProps {
  slides: Slide[];
  onSlidesChange: () => void;
}

const SlideManager = ({ slides, onSlidesChange }: SlideManagerProps) => {
  const [newSlide, setNewSlide] = useState<Slide>({
    id: '',
    title: '',
    color: '',
    image: '',
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSlideCreate = async () => {
    if (!newSlide.title || !newSlide.color || !newSlide.image) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Tous les champs obligatoires doivent être remplis",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('slides')
        .insert([newSlide]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Slide créé avec succès",
      });
      
      onSlidesChange();
      setNewSlide({
        id: '',
        title: '',
        color: '',
        image: '',
      });
      setIsCreateDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de créer le slide",
      });
    }
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

    try {
      const { error } = await supabase
        .from('slides')
        .update(updatedSlide)
        .eq('id', updatedSlide.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Slide mis à jour avec succès",
      });
      
      onSlidesChange();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le slide",
      });
    }
  };

  const handleSlideDelete = async (id: string) => {
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
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de supprimer le slide",
      });
    }
  };

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