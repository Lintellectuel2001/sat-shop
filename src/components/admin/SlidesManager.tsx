import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Slide {
  id: string;
  title: string;
  description?: string;
  image: string;
  color: string;
}

const SlidesManager = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const fetchSlides = async () => {
    const { data, error } = await supabase
      .from('slides')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les slides",
        variant: "destructive",
      });
      return;
    }

    setSlides(data || []);
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const slideData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      image: formData.get('image') as string,
      color: formData.get('color') as string,
    };

    if (editingSlide) {
      const { error } = await supabase
        .from('slides')
        .update(slideData)
        .eq('id', editingSlide.id);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le slide",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Slide mis à jour avec succès",
      });
    } else {
      const { error } = await supabase
        .from('slides')
        .insert([slideData]);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter le slide",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Slide ajouté avec succès",
      });
    }

    setEditingSlide(null);
    setIsAdding(false);
    fetchSlides();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('slides')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le slide",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Slide supprimé avec succès",
    });
    fetchSlides();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Gestion des Slides</h2>
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un slide
        </Button>
      </div>

      {(isAdding || editingSlide) && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <Input
            name="title"
            placeholder="Titre"
            defaultValue={editingSlide?.title || ''}
            required
          />
          <Textarea
            name="description"
            placeholder="Description"
            defaultValue={editingSlide?.description || ''}
          />
          <Input
            name="image"
            placeholder="URL de l'image"
            defaultValue={editingSlide?.image || ''}
            required
          />
          <Input
            name="color"
            type="color"
            defaultValue={editingSlide?.color || '#000000'}
            required
          />
          <div className="flex gap-4">
            <Button type="submit">
              {editingSlide ? 'Mettre à jour' : 'Ajouter'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                setEditingSlide(null);
                setIsAdding(false);
              }}
            >
              Annuler
            </Button>
          </div>
        </form>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Titre</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Couleur</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {slides.map((slide) => (
            <TableRow key={slide.id}>
              <TableCell>
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className="w-16 h-16 object-cover"
                />
              </TableCell>
              <TableCell>{slide.title}</TableCell>
              <TableCell>{slide.description}</TableCell>
              <TableCell>
                <div 
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: slide.color }}
                />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingSlide(slide)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(slide.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SlidesManager;