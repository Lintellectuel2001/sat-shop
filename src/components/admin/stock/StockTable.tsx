import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronDown, 
  ChevronUp, 
  Package, 
  AlertTriangle,
  Plus,
  Minus,
  DollarSign
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Product } from './useStockManager';

interface StockTableProps {
  products: Product[];
  isLoading: boolean;
  onUpdateStock: (productId: string, newQuantity: number, notes?: string) => Promise<void>;
  onUpdateStockAlert: (productId: string, threshold: number) => Promise<void>;
  onUpdatePurchasePrice: (productId: string, purchasePrice: number) => Promise<void>;
}

const StockTable: React.FC<StockTableProps> = ({ products, isLoading, onUpdateStock, onUpdateStockAlert, onUpdatePurchasePrice }) => {
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState<number>(0);
  const [adjustmentNotes, setAdjustmentNotes] = useState<string>('');
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [isThresholdDialogOpen, setIsThresholdDialogOpen] = useState(false);
  const [newThreshold, setNewThreshold] = useState<number>(0);
  const [isPurchasePriceDialogOpen, setIsPurchasePriceDialogOpen] = useState(false);
  const [newPurchasePrice, setNewPurchasePrice] = useState<number>(0);

  const handleSort = (field: keyof Product) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    let valueA = a[sortField];
    let valueB = b[sortField];
    
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    } else {
      valueA = String(valueA).toLowerCase();
      valueB = String(valueB).toLowerCase();
      return sortDirection === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
  });

  const handleAdjustStock = () => {
    if (selectedProduct) {
      const newQuantity = selectedProduct.stock_quantity + adjustmentQuantity;
      if (newQuantity < 0) {
        alert("Le stock ne peut pas être négatif");
        return;
      }
      onUpdateStock(selectedProduct.id, newQuantity, adjustmentNotes);
      setIsAdjustDialogOpen(false);
      setAdjustmentQuantity(0);
      setAdjustmentNotes('');
    }
  };

  const handleUpdateThreshold = () => {
    if (selectedProduct && newThreshold >= 0) {
      onUpdateStockAlert(selectedProduct.id, newThreshold);
      setIsThresholdDialogOpen(false);
    }
  };

  const handleUpdatePurchasePrice = () => {
    if (selectedProduct && newPurchasePrice >= 0) {
      onUpdatePurchasePrice(selectedProduct.id, newPurchasePrice);
      setIsPurchasePriceDialogOpen(false);
    }
  };

  const calculateProfit = (sellingPrice: string, purchasePrice: number) => {
    const selling = parseFloat(sellingPrice);
    if (isNaN(selling) || purchasePrice <= 0) return '-';
    
    const profit = selling - purchasePrice;
    const marginPercent = (profit / purchasePrice) * 100;
    
    return `${profit.toFixed(2)} (${marginPercent.toFixed(0)}%)`;
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div></div>;
  }

  return (
    <div>
      <Table className="border rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
              <div className="flex items-center">
                Produit
                {sortField === 'name' && (
                  sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead onClick={() => handleSort('stock_quantity')} className="cursor-pointer">
              <div className="flex items-center">
                Stock
                {sortField === 'stock_quantity' && (
                  sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead onClick={() => handleSort('stock_alert_threshold')} className="cursor-pointer">
              <div className="flex items-center">
                Seuil d'alerte
                {sortField === 'stock_alert_threshold' && (
                  sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead onClick={() => handleSort('price')} className="cursor-pointer">
              <div className="flex items-center">
                Prix de vente
                {sortField === 'price' && (
                  sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead onClick={() => handleSort('purchase_price')} className="cursor-pointer">
              <div className="flex items-center">
                Prix d'achat
                {sortField === 'purchase_price' && (
                  sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead>Marge</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className={`font-medium ${product.stock_quantity <= product.stock_alert_threshold ? 'text-red-500' : ''}`}>
                  <div className="flex items-center">
                    <Package className="mr-2 h-4 w-4" />
                    {product.stock_quantity}
                    {product.stock_quantity <= product.stock_alert_threshold && (
                      <AlertTriangle className="ml-2 h-4 w-4 text-red-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>{product.stock_alert_threshold}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.purchase_price.toFixed(2)}</TableCell>
                <TableCell>{calculateProfit(product.price, product.purchase_price)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedProduct(product);
                        setAdjustmentQuantity(0);
                        setIsAdjustDialogOpen(true);
                      }}
                    >
                      Ajuster
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedProduct(product);
                        setNewThreshold(product.stock_alert_threshold);
                        setIsThresholdDialogOpen(true);
                      }}
                    >
                      Seuil
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedProduct(product);
                        setNewPurchasePrice(product.purchase_price);
                        setIsPurchasePriceDialogOpen(true);
                      }}
                    >
                      <DollarSign className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Aucun produit physique trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Stock Adjustment Dialog */}
      <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajuster le stock</DialogTitle>
            <DialogDescription>
              {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center space-x-4">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setAdjustmentQuantity(adjustmentQuantity - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <Input
                type="number"
                value={adjustmentQuantity}
                onChange={(e) => setAdjustmentQuantity(parseInt(e.target.value) || 0)}
                className="w-24 text-center"
              />
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setAdjustmentQuantity(adjustmentQuantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea
                id="notes"
                placeholder="Raison de l'ajustement"
                value={adjustmentNotes}
                onChange={(e) => setAdjustmentNotes(e.target.value)}
              />
            </div>
            
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm">
                Stock actuel : <span className="font-medium">{selectedProduct?.stock_quantity}</span>
              </p>
              <p className="text-sm">
                Nouveau stock : <span className="font-medium">{selectedProduct ? selectedProduct.stock_quantity + adjustmentQuantity : 0}</span>
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdjustDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleAdjustStock}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Threshold Dialog */}
      <Dialog open={isThresholdDialogOpen} onOpenChange={setIsThresholdDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le seuil d'alerte</DialogTitle>
            <DialogDescription>
              {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="threshold">Seuil d'alerte</Label>
              <Input
                id="threshold"
                type="number"
                min="0"
                value={newThreshold}
                onChange={(e) => setNewThreshold(parseInt(e.target.value) || 0)}
              />
              <p className="text-sm text-muted-foreground">
                Une alerte sera générée lorsque le stock sera inférieur ou égal à cette valeur.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsThresholdDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleUpdateThreshold}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Purchase Price Dialog */}
      <Dialog open={isPurchasePriceDialogOpen} onOpenChange={setIsPurchasePriceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le prix d'achat</DialogTitle>
            <DialogDescription>
              {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Prix d'achat</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="purchasePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newPurchasePrice}
                  onChange={(e) => setNewPurchasePrice(parseFloat(e.target.value) || 0)}
                  className="pl-10"
                />
              </div>
              {selectedProduct && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="text-sm">Prix de vente: {selectedProduct.price}</p>
                  <p className="text-sm">
                    Marge: {calculateProfit(selectedProduct.price, newPurchasePrice)}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPurchasePriceDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleUpdatePurchasePrice}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockTable;
