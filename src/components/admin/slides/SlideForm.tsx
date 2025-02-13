
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
    text_color?: string;
    order: number;
  };
  onSlideChange: (field: string, value: string | number) => void;
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

const colorOptions = [
  { value: 'from-purple-500', label: 'Violet' },
  { value: 'from-blue-500', label: 'Bleu' },
  { value: 'from-green-500', label: 'Vert' },
  { value: 'from-red-500', label: 'Rouge' },
  { value: 'from-yellow-500', label: 'Jaune' },
  { value: 'from-pink-500', label: 'Rose' },
  { value: 'from-accent', label: 'Accent' },
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
        <Label htmlFor="order">Ordre d'affichage *</Label>
        <Input
          id="order"
          type="number"
          min="0"
          placeholder="Ordre d'affichage"
          value={slide.order}
          onChange={(e) => onSlideChange('order', parseInt(e.target.value) || 0)}
          disabled={isLoading}
          required
        />
        <p className="text-sm text-gray-500">L'ordre détermine la position du slide (0 = premier)</p>
      </div>

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
        <Label>Couleur du texte *</Label>
        <RadioGroup
          value={slide.text_color || 'text-white'}
          onValueChange={(value) => onSlideChange('text_color', value)}
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
        <Label>Couleur du fond *</Label>
        <RadioGroup
          value={slide.color}
          onValueChange={(value) => onSlideChange('color', value)}
          className="flex flex-wrap gap-4"
        >
          {colorOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label 
                htmlFor={option.value} 
                className={`px-2 py-1 rounded ${option.value} to-transparent bg-gradient-to-r text-white`}
              >
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
        <div className="mt-4 relative">
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} to-transparent opacity-60 rounded-lg`} />
          <div className={`relative z-10 p-4 ${slide.text_color || 'text-white'}`}>
            <h3 className="text-xl font-semibold">{slide.title}</h3>
            {slide.description && <p className="mt-2">{slide.description}</p>}
          </div>
          <img 
            src={imagePreview} 
            alt="Aperçu" 
            className="w-full h-48 object-cover rounded-lg -z-10"
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
