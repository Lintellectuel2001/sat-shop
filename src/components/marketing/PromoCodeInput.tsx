
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePromoCode } from '@/hooks/usePromoCode';
import { Loader2 } from 'lucide-react';

interface PromoCodeInputProps {
  onApply?: (promoCode: any) => void;
}

const PromoCodeInput = ({ onApply }: PromoCodeInputProps) => {
  const [code, setCode] = useState('');
  const { validatePromoCode, isLoading } = usePromoCode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await validatePromoCode(code);
    if (result && onApply) {
      onApply(result);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="Code promo"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full"
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading || !code}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          'Appliquer'
        )}
      </Button>
    </form>
  );
};

export default PromoCodeInput;
