
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/calendar";

interface PromoCode {
  id: string;
  code: string;
  discount_percentage?: number;
  discount_amount?: number;
  minimum_purchase?: number;
  start_date?: string;
  end_date?: string;
  max_uses?: number;
  current_uses: number;
  is_active: boolean;
}

const PromoCodeManager = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const [newCode, setNewCode] = useState({
    code: '',
    discount_percentage: '',
    discount_amount: '',
    minimum_purchase: '',
    start_date: '',
    end_date: '',
    max_uses: '',
    is_active: true
  });

  const fetchPromoCodes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromoCodes(data || []);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les codes promo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('promo_codes')
        .insert([{
          code: newCode.code.toUpperCase(),
          discount_percentage: newCode.discount_percentage ? Number(newCode.discount_percentage) : null,
          discount_amount: newCode.discount_amount ? Number(newCode.discount_amount) : null,
          minimum_purchase: newCode.minimum_purchase ? Number(newCode.minimum_purchase) : null,
          start_date: newCode.start_date || null,
          end_date: newCode.end_date || null,
          max_uses: newCode.max_uses ? Number(newCode.max_uses) : null,
          is_active: newCode.is_active
        }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Code promo créé avec succès",
      });
      
      setIsDialogOpen(false);
      setNewCode({
        code: '',
        discount_percentage: '',
        discount_amount: '',
        minimum_purchase: '',
        start_date: '',
        end_date: '',
        max_uses: '',
        is_active: true
      });
      fetchPromoCodes();
    } catch (error) {
      console.error('Error creating promo code:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le code promo",
        variant: "destructive",
      });
    }
  };

  const togglePromoCodeStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('promo_codes')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Statut du code promo mis à jour",
      });
      
      fetchPromoCodes();
    } catch (error) {
      console.error('Error updating promo code:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le code promo",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Codes Promo</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Créer un code promo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau Code Promo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={newCode.code}
                  onChange={(e) => setNewCode(prev => ({ ...prev, code: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="discount_percentage">Réduction (%)</Label>
                <Input
                  id="discount_percentage"
                  type="number"
                  value={newCode.discount_percentage}
                  onChange={(e) => setNewCode(prev => ({ ...prev, discount_percentage: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="discount_amount">Réduction (montant)</Label>
                <Input
                  id="discount_amount"
                  type="number"
                  value={newCode.discount_amount}
                  onChange={(e) => setNewCode(prev => ({ ...prev, discount_amount: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="minimum_purchase">Montant minimum d'achat</Label>
                <Input
                  id="minimum_purchase"
                  type="number"
                  value={newCode.minimum_purchase}
                  onChange={(e) => setNewCode(prev => ({ ...prev, minimum_purchase: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="max_uses">Nombre maximum d'utilisations</Label>
                <Input
                  id="max_uses"
                  type="number"
                  value={newCode.max_uses}
                  onChange={(e) => setNewCode(prev => ({ ...prev, max_uses: e.target.value }))}
                />
              </div>
              <Button type="submit">Créer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Réduction</TableHead>
            <TableHead>Utilisations</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promoCodes.map((code) => (
            <TableRow key={code.id}>
              <TableCell className="font-medium">{code.code}</TableCell>
              <TableCell>
                {code.discount_percentage ? `${code.discount_percentage}%` : ''}
                {code.discount_amount ? `${code.discount_amount}€` : ''}
              </TableCell>
              <TableCell>
                {code.current_uses}
                {code.max_uses ? `/${code.max_uses}` : ''}
              </TableCell>
              <TableCell>{code.is_active ? 'Actif' : 'Inactif'}</TableCell>
              <TableCell>
                <Button
                  variant={code.is_active ? "destructive" : "default"}
                  onClick={() => togglePromoCodeStatus(code.id, code.is_active)}
                >
                  {code.is_active ? 'Désactiver' : 'Activer'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PromoCodeManager;
