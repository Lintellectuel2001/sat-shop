import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { handleImageUpload } from "@/utils/fileUpload";

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
            } catch (error) {
              console.error('Error uploading image:', error);
            }
          }
        }}
      />
      <Button onClick={onSubmit}>{submitLabel}</Button>
    </div>
  );
};

export default SlideForm;