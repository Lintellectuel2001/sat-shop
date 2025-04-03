
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterBarProps {
  productsCount: number;
  category: string;
  setCategory: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
}

const FilterBar = ({ productsCount, category, setCategory, sortOrder, setSortOrder }: FilterBarProps) => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between mb-8 bg-white p-6 rounded-lg shadow-sm">
      <div className="flex gap-4 items-center">
        <div className="text-sm text-accent">{productsCount} produit(s)</div>
        
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Catégories" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">Toutes les catégories</SelectItem>
            <SelectItem value="iptv">IPTV</SelectItem>
            <SelectItem value="sharing">Sharing</SelectItem>
            <SelectItem value="vod">VOD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Select value={sortOrder} onValueChange={setSortOrder}>
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="Trier par" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="newest">Plus récents</SelectItem>
          <SelectItem value="price-asc">Prix croissant</SelectItem>
          <SelectItem value="price-desc">Prix décroissant</SelectItem>
          <SelectItem value="rating">Avis clients</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterBar;
