
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Package, MapPin, Phone, User } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
}

interface CODOrderFormProps {
  product: Product;
  onClose: () => void;
}

const ALGERIAN_WILAYAS = [
  "01 - Adrar", "02 - Chlef", "03 - Laghouat", "04 - Oum El Bouaghi",
  "05 - Batna", "06 - Béjaïa", "07 - Biskra", "08 - Béchar",
  "09 - Blida", "10 - Bouira", "11 - Tamanrasset", "12 - Tébessa",
  "13 - Tlemcen", "14 - Tiaret", "15 - Tizi Ouzou", "16 - Alger",
  "17 - Djelfa", "18 - Jijel", "19 - Sétif", "20 - Saïda",
  "21 - Skikda", "22 - Sidi Bel Abbès", "23 - Annaba", "24 - Guelma",
  "25 - Constantine", "26 - Médéa", "27 - Mostaganem", "28 - M'Sila",
  "29 - Mascara", "30 - Ouargla", "31 - Oran", "32 - El Bayadh",
  "33 - Illizi", "34 - Bordj Bou Arréridj", "35 - Boumerdès", "36 - El Tarf",
  "37 - Tindouf", "38 - Tissemsilt", "39 - El Oued", "40 - Khenchela",
  "41 - Souk Ahras", "42 - Tipaza", "43 - Mila", "44 - Aïn Defla",
  "45 - Naâma", "46 - Aïn Témouchent", "47 - Ghardaïa", "48 - Relizane"
];

const CODOrderForm = ({ product, onClose }: CODOrderFormProps) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    wilaya: '',
    commune: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerPhone || !formData.customerAddress || !formData.wilaya) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
      });
      return;
    }

    setLoading(true);
    
    try {
      const fullAddress = `${formData.customerAddress}, ${formData.commune ? formData.commune + ', ' : ''}${formData.wilaya}`;
      
      // Créer la commande de livraison
      const { data: orderData, error: orderError } = await supabase
        .from('delivery_orders')
        .insert([{
          product_id: product.id,
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone,
          customer_address: fullAddress,
          amount: product.price,
          status: 'pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Enregistrer dans l'historique des achats
      await supabase
        .from('cart_history')
        .insert([{
          product_id: product.id,
          action_type: 'cod_order'
        }]);

      toast({
        title: "Commande confirmée !",
        description: "Votre commande a été enregistrée. Nous vous contacterons pour confirmer la livraison.",
      });

      onClose();
    } catch (error) {
      console.error('Error creating delivery order:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la commande",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Résumé du produit */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-16 h-16 object-contain rounded-lg bg-gray-50 dark:bg-gray-800 p-2"
            />
            <div className="flex-1">
              <h3 className="font-semibold dark:text-white">{product.name}</h3>
              <p className="text-primary dark:text-accent-400 font-bold text-lg">{product.price}</p>
            </div>
            <Package className="w-8 h-8 text-accent-500" />
          </div>
        </CardContent>
      </Card>

      {/* Formulaire de commande */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customerName" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Nom complet *
            </Label>
            <Input
              id="customerName"
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({...formData, customerName: e.target.value})}
              placeholder="Votre nom complet"
              required
              className="input-modern"
            />
          </div>
          
          <div>
            <Label htmlFor="customerPhone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Téléphone *
            </Label>
            <Input
              id="customerPhone"
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
              placeholder="05XX XX XX XX"
              required
              className="input-modern"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="wilaya" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Wilaya *
          </Label>
          <Select value={formData.wilaya} onValueChange={(value) => setFormData({...formData, wilaya: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez votre wilaya" />
            </SelectTrigger>
            <SelectContent>
              {ALGERIAN_WILAYAS.map((wilaya) => (
                <SelectItem key={wilaya} value={wilaya}>
                  {wilaya}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="commune">Commune (optionnel)</Label>
          <Input
            id="commune"
            type="text"
            value={formData.commune}
            onChange={(e) => setFormData({...formData, commune: e.target.value})}
            placeholder="Votre commune"
            className="input-modern"
          />
        </div>

        <div>
          <Label htmlFor="customerAddress">Adresse complète *</Label>
          <Textarea
            id="customerAddress"
            value={formData.customerAddress}
            onChange={(e) => setFormData({...formData, customerAddress: e.target.value})}
            placeholder="Adresse détaillée (rue, numéro, étage, etc.)"
            required
            className="min-h-[80px] input-modern"
          />
        </div>

        <div>
          <Label htmlFor="notes">Notes supplémentaires (optionnel)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Instructions spéciales pour la livraison"
            className="min-h-[60px] input-modern"
          />
        </div>

        <div className="bg-accent-50 dark:bg-accent-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-accent-700 dark:text-accent-300 mb-2">
            Informations importantes :
          </h4>
          <ul className="text-sm text-accent-600 dark:text-accent-400 space-y-1">
            <li>• Livraison sous 2-5 jours ouvrables</li>
            <li>• Paiement en espèces à la livraison</li>
            <li>• Frais de livraison selon la wilaya</li>
            <li>• Nous vous contacterons pour confirmer</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 btn-modern"
          >
            {loading ? "Commande en cours..." : "Confirmer la commande"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CODOrderForm;
