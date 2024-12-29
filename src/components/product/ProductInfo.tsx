import React from 'react';
import { Button } from "@/components/ui/button";
import ProductHeader from "./ProductHeader";
import ProductDescription from "./ProductDescription";
import ProductFeatures from "./ProductFeatures";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface ProductInfoProps {
  name: string;
  price: string;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  downloadInfo?: any;
  onOrder: () => void;
  paymentLink: string;
}

const ProductInfo = ({ 
  name, 
  price, 
  rating, 
  reviews, 
  description, 
  features, 
  downloadInfo,
  paymentLink 
}: ProductInfoProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"chargily" | "paypal">("chargily");

  const handlePayment = () => {
    if (paymentMethod === "chargily") {
      window.location.href = paymentLink;
    } else {
      // Replace with your PayPal payment link when available
      window.location.href = paymentLink.replace("chargily", "paypal");
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <ProductHeader
        name={name}
        price={price}
        rating={rating}
        reviews={reviews}
      />

      <ProductDescription 
        description={description}
        downloadInfo={downloadInfo}
      />

      <ProductFeatures features={features} />

      <Button 
        onClick={() => setIsDialogOpen(true)}
        className="w-full lg:w-auto text-lg py-6 bg-primary hover:bg-primary/90"
      >
        Commander Maintenant
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choisissez votre moyen de paiement</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <RadioGroup
              defaultValue="chargily"
              onValueChange={(value) => setPaymentMethod(value as "chargily" | "paypal")}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="chargily" id="chargily" />
                <Label htmlFor="chargily" className="cursor-pointer">
                  Paiement sécurisé via Chargily (edahabia)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="cursor-pointer">
                  Paiement via PayPal
                </Label>
              </div>
            </RadioGroup>
            <div className="flex justify-end">
              <Button onClick={handlePayment} className="bg-primary hover:bg-primary/90">
                Continuer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-muted p-4 rounded-lg mt-8">
        <h3 className="font-semibold mb-2">Paiement sécurisé</h3>
        <p className="text-sm text-accent">
          Paiement sécurisé via Chargily ou PayPal. Livraison immédiate après confirmation du paiement.
        </p>
      </div>
    </div>
  );
};

export default ProductInfo;