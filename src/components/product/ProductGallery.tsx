import React from 'react';

interface ProductGalleryProps {
  image: string;
  name: string;
}

const ProductGallery = ({ image, name }: ProductGalleryProps) => {
  return (
    <div className="space-y-4">
      <div className="aspect-square overflow-hidden rounded-lg bg-white p-8">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default ProductGallery;