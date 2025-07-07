import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ChargilyPaymentButton from './ChargilyPaymentButton';
import { useAuthState } from '@/hooks/useAuthState';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaymentDialogProps {
  productId: string;
  productName: string;
  price: string;
  children: React.ReactNode;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  productId,
  productName,
  price,
  children
}) => {
  const [open, setOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const { user } = useAuthState();
  const { toast } = useToast();

  React.useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email, phone')
            .eq('id', user.id)
            .single();

          if (profile) {
            setCustomerInfo({
              name: profile.full_name || '',
              email: profile.email || user.email || '',
              phone: profile.phone || ''
            });
          } else {
            setCustomerInfo(prev => ({
              ...prev,
              email: user.email || ''
            }));
          }
        } catch (error) {
          console.error('Error loading profile:', error);
          setCustomerInfo(prev => ({
            ...prev,
            email: user.email || ''
          }));
        }
      }
    };

    if (open && user) {
      loadUserProfile();
    }
  }, [open, user]);

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = Boolean(customerInfo.name.trim() && customerInfo.email.trim());
  const numericPrice = parseFloat(price) || 0;

  console.log("PaymentDialog state:", { 
    customerInfo, 
    isFormValid, 
    numericPrice,
    open 
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Informations de paiement</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold">{productName}</h3>
            <p className="text-lg text-primary">{price} DZD</p>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                value={customerInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Votre nom complet"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={customerInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Téléphone (optionnel)</Label>
              <Input
                id="phone"
                value={customerInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+213..."
              />
            </div>
          </div>

          <div className="pt-4">
            <div className="mb-2 text-sm text-muted-foreground">
              {!isFormValid && (
                <span className="text-destructive">
                  ⚠️ Nom et email sont obligatoires
                </span>
              )}
            </div>
            {isFormValid ? (
              <ChargilyPaymentButton
                productId={productId}
                productName={productName}
                amount={numericPrice}
                customerEmail={customerInfo.email}
                customerName={customerInfo.name}
                customerPhone={customerInfo.phone}
                className="w-full"
              >
                Procéder au paiement
              </ChargilyPaymentButton>
            ) : (
              <Button disabled className="w-full">
                Veuillez remplir les champs obligatoires
              </Button>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            <p>• Paiement sécurisé via Chargily Pay</p>
            <p>• Méthodes: Edahabia, CIB</p>
            <p>• Livraison automatique après paiement</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;