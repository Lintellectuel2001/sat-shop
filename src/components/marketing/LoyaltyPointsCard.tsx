
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLoyaltyPoints } from '@/hooks/useLoyaltyPoints';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface LoyaltyPointsCardProps {
  userId: string;
}

const LoyaltyPointsCard = ({ userId }: LoyaltyPointsCardProps) => {
  const { points, transactions, isLoading } = useLoyaltyPoints(userId);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex justify-center items-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Mes points de fidélité</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-secondary rounded-lg">
            <div className="text-2xl font-bold">{points?.points || 0}</div>
            <div className="text-sm text-muted-foreground">Points disponibles</div>
          </div>
          <div className="text-center p-4 bg-secondary rounded-lg">
            <div className="text-2xl font-bold">{points?.lifetime_points || 0}</div>
            <div className="text-sm text-muted-foreground">Points cumulés</div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Historique des transactions</h3>
          <ScrollArea className="h-[200px] rounded-md border p-4">
            {transactions.map((transaction) => (
              <div 
                key={transaction.created_at}
                className="flex justify-between items-center py-2 border-b last:border-0"
              >
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className={transaction.points > 0 ? "text-green-600" : "text-red-600"}>
                  {transaction.points > 0 ? '+' : ''}{transaction.points} pts
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoyaltyPointsCard;
