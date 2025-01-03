import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Pencil, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

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
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [newSlide, setNewSlide] = useState<Slide>({
    id: '',
    title: '',
    color: '',
    image: '',
  });
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'uploader l'image",
        });
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error in handleImageUpload:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'upload",
      });
      return null;
    }
  };

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
    
    onSlidesChange();
    setNewSlide({
      id: '',
      title: '',
      color: '',
      image: '',
    });
  };

  const handleSlideUpdate = async (id: string) => {
    if (!editingSlide) return;

    if (!editingSlide.title || !editingSlide.color || !editingSlide.image) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Tous les champs obligatoires doivent être remplis",
      });
      return;
    }

    const { error } = await supabase
      .from('slides')
      .update(editingSlide)
      .eq('id', id);

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
    
    onSlidesChange();
    setEditingSlide(null);
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
    
    onSlidesChange();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Gestion des Slides</h2>
        <Dialog>
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
            <div className="space-y-4">
              <Input
                placeholder="Titre"
                value={newSlide.title}
                onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
              />
              <Textarea
                placeholder="Description"
                value={newSlide.description || ''}
                onChange={(e) => setNewSlide({ ...newSlide, description: e.target.value })}
              />
              <Input
                placeholder="Couleur (ex: #000000)"
                value={newSlide.color}
                onChange={(e) => setNewSlide({ ...newSlide, color: e.target.value })}
              />
              <Input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  if (e.target.files?.[0]) {
                    const url = await handleImageUpload(e.target.files[0]);
                    if (url) {
                      setNewSlide({ ...newSlide, image: url });
                    }
                  }
                }}
              />
              <Button onClick={handleSlideCreate}>Créer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map((slide) => (
          <div key={slide.id} className="border rounded-lg p-4 space-y-4">
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
                  <div className="space-y-4">
                    <Input
                      placeholder="Titre"
                      value={editingSlide?.title || slide.title}
                      onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                    />
                    <Textarea
                      placeholder="Description"
                      value={editingSlide?.description || slide.description}
                      onChange={(e) => setEditingSlide({ ...editingSlide, description: e.target.value })}
                    />
                    <Input
                      placeholder="Couleur (ex: #000000)"
                      value={editingSlide?.color || slide.color}
                      onChange={(e) => setEditingSlide({ ...editingSlide, color: e.target.value })}
                    />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          const url = await handleImageUpload(e.target.files[0]);
                          if (url) {
                            setEditingSlide({ ...editingSlide, image: url });
                          }
                        }
                      }}
                    />
                    <Button onClick={() => handleSlideUpdate(slide.id)}>Mettre à jour</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleSlideDelete(slide.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlideManager;
