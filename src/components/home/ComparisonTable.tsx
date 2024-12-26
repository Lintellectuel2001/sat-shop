import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X } from "lucide-react";

const ComparisonTable = () => {
  const features = [
    { name: "Prix", basic: "1800 DA", standard: "3000 DA", premium: "3500 DA" },
    { name: "Chaînes TV en direct", basic: "✓", standard: "✓", premium: "✓" },
    { name: "Qualité HD", basic: "✓", standard: "✓", premium: "✓" },
    { name: "Qualité 4K", basic: "×", standard: "✓", premium: "✓" },
    { name: "VOD (Films & Séries)", basic: "×", standard: "✓", premium: "✓" },
    { name: "Multi-écrans", basic: "×", standard: "×", premium: "✓" },
    { name: "Support premium", basic: "×", standard: "✓", premium: "✓" },
    { name: "Mise à jour automatique", basic: "×", standard: "✓", premium: "✓" },
  ];

  const renderCheckOrX = (value: string) => {
    if (value === "✓") {
      return <Check className="h-4 w-4 text-green-500" />;
    } else if (value === "×") {
      return <X className="h-4 w-4 text-red-500" />;
    }
    return value;
  };

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Comparaison des Offres</h2>
        <div className="overflow-x-auto">
          <Table className="w-full bg-white rounded-lg shadow-lg">
            <TableHeader>
              <TableRow className="bg-secondary">
                <TableHead className="w-1/4">Caractéristiques</TableHead>
                <TableHead className="w-1/4 text-center">Basic</TableHead>
                <TableHead className="w-1/4 text-center">Standard</TableHead>
                <TableHead className="w-1/4 text-center">Premium</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature, index) => (
                <TableRow key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-muted/30'}>
                  <TableCell className="font-medium">{feature.name}</TableCell>
                  <TableCell className="text-center">
                    {renderCheckOrX(feature.basic)}
                  </TableCell>
                  <TableCell className="text-center">
                    {renderCheckOrX(feature.standard)}
                  </TableCell>
                  <TableCell className="text-center">
                    {renderCheckOrX(feature.premium)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;