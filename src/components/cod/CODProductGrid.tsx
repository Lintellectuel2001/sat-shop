
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star, Package, Truck } from "lucide-react";
import CODOrderForm from './CODOrderForm';

interface Product {
  id: string;
  name: string;
  price: string;
  description?: string;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
  is_available?: boolean;
}

interface CODProductGridProps {
  products: Product[];
  isLoading: boolean;
  preselectedProduct?: Product | null;
}

const CODProductGrid = ({ products, isLoading, preselectedProduct }: CODProductGridProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);

  // Ouvrir automatiquement le formulaire si un produit est présélectionné
  useEffect(() => {
    if (preselectedProduct) {
      setSelectedProduct(preselectedProduct);
      setShowOrderForm(true);
    }
  }, [preselectedProduct]);

  const handleOrderClick = (product: Product) => {
    console.log('Bouton commander cliqué pour le produit:', product.name);
    setSelectedProduct(product);
    setShowOrderForm(true);
  };

  const handleCloseForm = () => {
    console.log('Fermeture du formulaire de commande');
    setShowOrderForm(false);
    setSelectedProduct(null);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Chargement des produits...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
          Aucun produit disponible
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Les produits physiques seront bientôt disponibles pour la livraison
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 card-modern">
            <div className="aspect-square overflow-hidden bg-white dark:bg-gray-800 p-4 relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              />
              <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600">
                <Truck className="h-3 w-3 mr-1" />
                COD
              </Badge>
              {product.category && (
                <Badge className="absolute top-2 right-2 bg-primary hover:bg-primary/90">
                  {product.category.toUpperCase()}
                </Badge>
              )}
            </div>
            
            <div className="p-4 space-y-3">
              <h3 className="font-semibold text-lg dark:text-white line-clamp-2">
                {product.name}
              </h3>
              
              {product.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {product.description}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-primary dark:text-accent-400 font-bold text-xl">
                  {product.price}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {product.rating || 5} ({product.reviews || 0})
                  </span>
                </div>
              </div>
              
              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleOrderClick(product);
                }}
                className="w-full btn-modern"
                type="button"
              >
                Commander avec livraison
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showOrderForm} onOpenChange={setShowOrderForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Commande avec livraison</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <CODOrderForm
              product={selectedProduct}
              onClose={handleCloseForm}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CODProductGrid;
