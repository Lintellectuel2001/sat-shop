
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface CategoryBadgeProps {
  category: string;
}

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  // Get the badge class based on category
  const getCategoryBadgeClass = (category: string) => {
    const lowerCategory = category.toLowerCase();
    switch (lowerCategory) {
      case 'iptv':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'sharing':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'vod':
        return 'bg-green-500 hover:bg-green-600';
      case 'code digital':
        return 'bg-amber-500 hover:bg-amber-600';
      case 'divers':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <Badge className={getCategoryBadgeClass(category)}>
      {category.toUpperCase()}
    </Badge>
  );
};

export default CategoryBadge;
