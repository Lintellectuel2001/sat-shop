
import React from "react";
import { ChevronRight } from "lucide-react";

const categories = [
  { name: "IPTV", icon: "📺", value: "iptv" },
  { name: "Sharing", icon: "🔗", value: "sharing" },
  { name: "VOD", icon: "🎬", value: "vod" },
  { name: "Tous", icon: "🛒", value: "all" },
];

interface CategoryNavProps {
  initialCategory?: string;
  onCategoryChange: (category: string) => void;
}

const CategoryNav = ({ initialCategory = "all", onCategoryChange }: CategoryNavProps) => {
  const handleCategoryClick = (categoryValue: string) => {
    onCategoryChange(categoryValue);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
      {categories.map((category) => (
        <button
          key={category.name}
          onClick={() => handleCategoryClick(category.value)}
          className={`group p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center space-y-2 ${
            initialCategory === category.value 
              ? "bg-primary/10 border-2 border-primary" 
              : "bg-white"
          }`}
        >
          <span className="text-3xl">{category.icon}</span>
          <div className="flex items-center space-x-1">
            <span className="text-sm font-medium">{category.name}</span>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
          </div>
        </button>
      ))}
    </div>
  );
};

export default CategoryNav;
