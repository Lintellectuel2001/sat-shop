
import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip 
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface CategoryData {
  name: string;
  value: number;
}

interface CategoryComparisonChartProps {
  categoriesData: CategoryData[];
}

const COLORS = ['#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95', '#6366F1', '#4F46E5', '#4338CA'];

const CategoryComparisonChart = ({ categoriesData }: CategoryComparisonChartProps) => {
  // Add a check for empty data
  if (!categoriesData || categoriesData.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">Aucune donnée de catégorie disponible</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ChartContainer 
        config={{
          category: {
            color: "#8B5CF6"
          }
        }}
        className="h-full w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoriesData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {categoriesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [value, 'Produits']}
              labelFormatter={(label) => `Catégorie: ${label}`}
            />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default CategoryComparisonChart;
