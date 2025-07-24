import React from 'react';
import { Tv, Share2, Film, Package, ShoppingBag } from 'lucide-react';

const categories = [
  { name: "Tous", icon: ShoppingBag, value: "all", color: "bg-gradient-to-br from-accent-500 to-accent-600" },
  { name: "IPTV", icon: Tv, value: "iptv", color: "bg-gradient-to-br from-blue-500 to-blue-600" },
  { name: "Sharing", icon: Share2, value: "sharing", color: "bg-gradient-to-br from-green-500 to-green-600" },
  { name: "VOD", icon: Film, value: "vod", color: "bg-gradient-to-br from-purple-500 to-purple-600" },
  { name: "Divers", icon: Package, value: "divers", color: "bg-gradient-to-br from-orange-500 to-orange-600" },
];

interface ModernCategoryNavProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const ModernCategoryNav = ({ selectedCategory, onCategoryChange }: ModernCategoryNavProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected = selectedCategory === category.value;
        
        return (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`group relative p-6 rounded-2xl transition-all duration-300 border-2 ${
              isSelected 
                ? 'border-accent-300 bg-accent-50 shadow-lg scale-105' 
                : 'border-border/50 bg-card hover:border-accent-200 hover:shadow-md hover:scale-102'
            }`}
          >
            {/* Icon container */}
            <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            
            {/* Category name */}
            <div className="text-center">
              <span className={`font-medium text-sm ${
                isSelected ? 'text-accent-700' : 'text-foreground group-hover:text-accent-600'
              }`}>
                {category.name}
              </span>
            </div>

            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full border-2 border-background" />
            )}

            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-accent-100/50 to-transparent pointer-events-none" />
          </button>
        );
      })}
    </div>
  );
};

export default ModernCategoryNav;