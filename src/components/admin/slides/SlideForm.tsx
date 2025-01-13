import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { handleImageUpload } from "@/utils/fileUpload";
import { Label } from "@/components/ui/label";

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
  const [imagePreview, setImagePreview] = React.useState<string>(slide.image);
  const [isUploading, setIsUploading] = React.useState(false);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          placeholder="Titre du slide"
          value={slide.title}
          onChange={(e) => onSlideChange('title', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description du slide"
          value={slide.description || ''}
          onChange={(e) => onSlideChange('description', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Couleur</Label>
        <Input
          id="color"
          placeholder="Couleur (ex: #000000 ou from-blue-500)"
          value={slide.color}
          onChange={(e) => onSlideChange('color', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          disabled={isUploading}
          onChange={async (e) => {
            if (e.target.files?.[0]) {
              setIsUploading(true);
              try {
                const url = await handleImageUpload(e.target.files[0]);
                onSlideChange('image', url);
                setImagePreview(url);
              } catch (error) {
                console.error('Error uploading image:', error);
              } finally {
                setIsUploading(false);
              }
            }
          }}
        />
      </div>

      {imagePreview && (
        <div className="mt-4">
          <img 
            src={imagePreview} 
            alt="Aperçu" 
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      <Button 
        onClick={onSubmit} 
        disabled={isUploading}
        className="w-full"
      >
        {isUploading ? "Chargement..." : submitLabel}
      </Button>
    </div>
  );
};

export default SlideForm;