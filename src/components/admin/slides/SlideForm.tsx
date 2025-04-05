import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { handleImageUpload } from "@/utils/fileUpload";
import { Label } from "@/components/ui/label";
import { Loader2, Image, ImageOff, Wallpaper } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

interface SlideFormProps {
  slide: {
    title: string;
    description?: string;
    image: string;
    text_color?: string;
    order: number;
    blur_image?: boolean;
    is_4k_wallpaper?: boolean;
  };
  onSlideChange: (field: string, value: string | number | boolean) => void;
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
        <Label>Type d'image</Label>
        <div className="flex items-center space-x-2 py-2">
          <Switch
            checked={slide.blur_image}
            onCheckedChange={(checked) => onSlideChange('blur_image', checked)}
            id="blur-image"
          />
          <Label htmlFor="blur-image" className="cursor-pointer flex items-center">
            {slide.blur_image ? (
              <><ImageOff className="h-4 w-4 mr-2" /> Image floutée</>
            ) : (
              <><Image className="h-4 w-4 mr-2" /> Image normale</>
            )}
          </Label>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Fond d'écran 4K</Label>
        <div className="flex items-center space-x-2 py-2">
          <Switch
            checked={slide.is_4k_wallpaper}
            onCheckedChange={(checked) => onSlideChange('is_4k_wallpaper', checked)}
            id="is-4k"
          />
          <Label htmlFor="is-4k" className="cursor-pointer flex items-center">
            <Wallpaper className="h-4 w-4 mr-2" />
            {slide.is_4k_wallpaper ? 'Fond d\'écran 4K' : 'Image standard'}
          </Label>
        </div>
        {slide.is_4k_wallpaper && (
          <p className="text-sm text-gray-500">Chargez une image haute résolution (3840×2160 ou supérieure)</p>
        )}
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
        <p className="text-sm text-gray-500">Format accepté: JPG, PNG, GIF (max 8MB)</p>
      </div>

      {imagePreview && (
        <div className="mt-4 relative rounded-lg overflow-hidden">
          <div className="relative z-10 p-4 text-center bg-black/30 backdrop-blur-sm">
            <h3 className={`text-xl font-semibold ${slide.text_color || 'text-white'}`}>{slide.title}</h3>
            {slide.description && (
              <p className={`mt-2 ${slide.text_color || 'text-white'}`}>{slide.description}</p>
            )}
          </div>
          <img 
            src={imagePreview} 
            alt="Aperçu" 
            className={`w-full h-48 object-cover ${slide.blur_image ? 'blur-sm' : ''}`}
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
