
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface GuestOrderFormProps {
  productName: string;
  productPrice: string;
  onSubmit: (guestInfo: GuestOrderInfo) => void;
  isLoading?: boolean;
}

export interface GuestOrderInfo {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

const GuestOrderForm = ({ productName, productPrice, onSubmit, isLoading }: GuestOrderFormProps) => {
  const [guestInfo, setGuestInfo] = useState<GuestOrderInfo>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guestInfo.name || !guestInfo.email || !guestInfo.phone) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestInfo.email)) {
      toast({
        variant: "destructive",
        title: "Email invalide",
        description: "Veuillez entrer une adresse email valide",
      });
      return;
    }

    onSubmit(guestInfo);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Informations de commande</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="font-medium">{productName}</p>
          <p className="text-primary font-bold">{productPrice}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom complet *</Label>
            <Input
              id="name"
              type="text"
              value={guestInfo.name}
              onChange={(e) => setGuestInfo({...guestInfo, name: e.target.value})}
              placeholder="Votre nom complet"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={guestInfo.email}
              onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
              placeholder="votre@email.com"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Téléphone *</Label>
            <Input
              id="phone"
              type="tel"
              value={guestInfo.phone}
              onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})}
              placeholder="Votre numéro de téléphone"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="address">Adresse (optionnel)</Label>
            <Input
              id="address"
              type="text"
              value={guestInfo.address}
              onChange={(e) => setGuestInfo({...guestInfo, address: e.target.value})}
              placeholder="Votre adresse"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Traitement..." : "Confirmer la commande"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GuestOrderForm;
