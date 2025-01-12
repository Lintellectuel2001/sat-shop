import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { handleImageUpload } from "@/utils/fileUpload";
import { useToast } from "@/hooks/use-toast";

interface SlideFormProps {
  slide: {
    title: string;
    description?: string;
    image: string;
    color: string;
  };
  onSlideChange: (field: string, value: string) => void;
  onSubmit: () => void;
  submitLabel: string;
}

const SlideForm = ({ slide, onSlideChange, onSubmit, submitLabel }: SlideFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!slide.title || !slide.color || !slide.image) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit();
    } catch (error) {
      console.error('Error submitting slide:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du slide",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Titre"
        value={slide.title}
        onChange={(e) => onSlideChange('title', e.target.value)}
      />
      <Textarea
        placeholder="Description"
        value={slide.description || ''}
        onChange={(e) => onSlideChange('description', e.target.value)}
      />
      <Input
        placeholder="Couleur (ex: #000000)"
        value={slide.color}
        onChange={(e) => onSlideChange('color', e.target.value)}
      />
      <Input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          if (e.target.files?.[0]) {
            try {
              const url = await handleImageUpload(e.target.files[0]);
              onSlideChange('image', url);
              toast({
                title: "Succès",
                description: "Image téléchargée avec succès",
              });
            } catch (error) {
              console.error('Error uploading image:', error);
              toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de télécharger l'image",
              });
            }
          }
        }}
      />
      <Button 
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Création en cours..." : submitLabel}
      </Button>
    </div>
  );
};

export default SlideForm;