import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { handleImageUpload } from "@/utils/fileUpload";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SlideFormProps {
  slide: {
    title: string;
    description?: string;
    image: string;
    color: string;
    textColor?: string;
  };
  onSlideChange: (field: string, value: string) => void;
  onSubmit: () => void;
  submitLabel: string;
  isLoading: boolean;
}

const textColorOptions = [
  { value: 'text-white', label: 'Blanc' },
  { value: 'text-black', label: 'Noir' },
  { value: 'text-primary', label: 'Principal' },
  { value: 'text-accent', label: 'Accent' },
  { value: 'text-muted-foreground', label: 'Gris' },
];

const SlideForm = ({ slide, onSlideChange, onSubmit, submitLabel, isLoading }: SlideFormProps) => {
  const [imagePreview, setImagePreview] = React.useState<string>(slide.image);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Titre *</Label>
        <Input
          id="title"
          placeholder="Titre du slide"
          value={slide.title}
          onChange={(e) => onSlideChange('title', e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description du slide"
          value={slide.description || ''}
          onChange={(e) => onSlideChange('description', e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Couleur de fond *</Label>
        <Input
          id="color"
          placeholder="Couleur (ex: from-blue-500)"
          value={slide.color}
          onChange={(e) => onSlideChange('color', e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Couleur du texte *</Label>
        <RadioGroup
          value={slide.textColor || 'text-white'}
          onValueChange={(value) => onSlideChange('textColor', value)}
          className="flex flex-wrap gap-4"
        >
          {textColorOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className={option.value}>
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image *</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          disabled={isLoading || isUploading}
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
        <p className="text-sm text-gray-500">Format accepté: JPG, PNG, GIF (max 5MB)</p>
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
        type="submit"
        disabled={isLoading || isUploading}
        className="w-full"
      >
        {isLoading || isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Chargement...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
};

export default SlideForm;