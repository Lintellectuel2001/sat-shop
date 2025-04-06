
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Package, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Product {
  id: string;
  name: string;
  stock_quantity: number;
  stock_alert_threshold: number;
  price: string;
}

interface StockAlertsProps {
  products: Product[];
  onUpdateStock: (productId: string, newQuantity: number, notes?: string) => Promise<void>;
}

const StockAlerts = ({ products, onUpdateStock }: StockAlertsProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addQuantity, setAddQuantity] = useState<number>(1);
  const [restockNotes, setRestockNotes] = useState<string>('');
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false);

  const handleRestock = () => {
    if (selectedProduct && addQuantity > 0) {
      const newQuantity = selectedProduct.stock_quantity + addQuantity;
      onUpdateStock(
        selectedProduct.id, 
        newQuantity, 
        restockNotes || `Réapprovisionnement de ${addQuantity} unités`
      );
      setIsRestockDialogOpen(false);
      setAddQuantity(1);
      setRestockNotes('');
    }
  };

  if (products.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <Package className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-medium">Aucune alerte de stock</h3>
        <p className="text-muted-foreground mt-2">
          Tous les produits ont des niveaux de stock supérieurs aux seuils d'alerte.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="border-red-200 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{product.name}</CardTitle>
                <div className="bg-red-100 p-1.5 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <CardDescription>
                Prix: {product.price}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center mt-1">
                <Package className="mr-2 h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-red-600">{product.stock_quantity}</span>
                <span className="text-muted-foreground text-sm ml-2">
                  / {product.stock_alert_threshold} (seuil)
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full border-red-200 hover:bg-red-50 hover:text-red-600"
                onClick={() => {
                  setSelectedProduct(product);
                  setAddQuantity(1);
                  setIsRestockDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Réapprovisionner
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Restock Dialog */}
      <Dialog open={isRestockDialogOpen} onOpenChange={setIsRestockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réapprovisionner le produit</DialogTitle>
            <DialogDescription>
              {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="addQuantity">Quantité à ajouter</Label>
              <Input
                id="addQuantity"
                type="number"
                min="1"
                value={addQuantity}
                onChange={(e) => setAddQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="restockNotes">Notes (optionnel)</Label>
              <Textarea
                id="restockNotes"
                placeholder="Informations sur le réapprovisionnement"
                value={restockNotes}
                onChange={(e) => setRestockNotes(e.target.value)}
              />
            </div>
            
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm">
                Stock actuel : <span className="font-medium">{selectedProduct?.stock_quantity}</span>
              </p>
              <p className="text-sm">
                Nouveau stock : <span className="font-medium">{selectedProduct ? selectedProduct.stock_quantity + addQuantity : 0}</span>
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestockDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleRestock}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockAlerts;
