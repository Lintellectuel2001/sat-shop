import React from 'react';

interface ProductFeaturesProps {
  features: string[];
}

const ProductFeatures = ({ features }: ProductFeaturesProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Caractéristiques:</h3>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="text-primary">•</span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductFeatures;