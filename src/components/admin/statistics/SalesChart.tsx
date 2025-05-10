
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  ReferenceLine
} from "recharts";
import { 
  ChartContainer,
  ChartTooltip
} from "@/components/ui/chart";
import { SalesDataPoint } from './hooks/useStatisticsData';

interface SalesChartProps {
  salesData: SalesDataPoint[];
}

const SalesChart = ({ salesData }: SalesChartProps) => {
  // Calculate the average sales value to use for reference line
  const averageSales = salesData.length > 0 
    ? salesData.reduce((sum, item) => sum + item.sales, 0) / salesData.length 
    : 0;

  return (
    <div className="w-full">
      <ChartContainer 
        config={{
          sales: {
            color: "#8B5CF6"
          }
        }}
        className="h-[350px] w-full"
      >
        <BarChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F0FB" />
          <XAxis
            dataKey="name"
            stroke="#64748B"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            stroke="#64748B"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
            width={40}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-white p-3 shadow-md">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Période
                        </span>
                        <span className="font-bold text-sm">
                          {payload[0].payload.name}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Ventes
                        </span>
                        <span className="font-bold text-sm">
                          {payload[0].value}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <ReferenceLine 
            y={averageSales} 
            stroke="#E5DEFF" 
            strokeWidth={2} 
            strokeDasharray="3 3"
            label={{ 
              value: `Moyenne: ${averageSales.toFixed(1)}`,
              position: 'right',
              fill: '#8B5CF6',
              fontSize: 12
            }}
          />
          <Bar
            dataKey="sales"
            fill="url(#colorSales)"
            radius={[8, 8, 0, 0]}
            barSize={40}
            animationDuration={1500}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default SalesChart;
