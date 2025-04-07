
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import ProductImage from './ProductImage';
import CategoryBadge from './CategoryBadge';
import ProductAvailabilityToggle from './ProductAvailabilityToggle';
import ProductActions from './ProductActions';

interface Product {
  id: string;
  name: string;
  price: string;
  description?: string;
  image: string;
  category: string;
  features?: string[];
  payment_link: string;
  is_available?: boolean;
}

interface ProductRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDeleteClick: (id: string) => void;
  onToggleAvailability: (id: string, currentStatus: boolean) => void;
}

const ProductRow = ({ 
  product, 
  onEdit, 
  onDeleteClick, 
  onToggleAvailability 
}: ProductRowProps) => {
  return (
    <TableRow>
      <TableCell>
        <ProductImage 
          image={product.image} 
          name={product.name} 
          isAvailable={product.is_available} 
        />
      </TableCell>
      <TableCell className="font-medium max-w-[200px] truncate">
        {product.name}
      </TableCell>
      <TableCell>{product.price}</TableCell>
      <TableCell>
        <CategoryBadge category={product.category} />
      </TableCell>
      <TableCell className="max-w-[200px] truncate">
        {product.description || '-'}
      </TableCell>
      <TableCell className="max-w-[200px] truncate">
        {product.payment_link}
      </TableCell>
      <TableCell>
        <ProductAvailabilityToggle 
          isAvailable={!!product.is_available} 
          onToggle={() => onToggleAvailability(product.id, !!product.is_available)}
        />
      </TableCell>
      <TableCell className="text-right">
        <ProductActions 
          product={product} 
          onEdit={onEdit} 
          onDeleteClick={onDeleteClick} 
        />
      </TableCell>
    </TableRow>
  );
};

export default ProductRow;
