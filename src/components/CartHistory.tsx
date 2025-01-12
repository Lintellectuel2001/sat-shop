import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ShoppingCart } from "lucide-react";

interface CartHistoryItem {
  id: string;
  action_type: string;
  product_id: string | null;
  created_at: string;
}

const CartHistory = () => {
  const [cartHistory, setCartHistory] = useState<CartHistoryItem[]>([]);

  useEffect(() => {
    const fetchCartHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('cart_history')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching cart history:', error);
          return;
        }

        setCartHistory(data || []);
      } catch (error) {
        console.error('Failed to fetch cart history:', error);
      }
    };

    fetchCartHistory();
  }, []);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="relative cursor-pointer">
          <ShoppingCart className="h-6 w-6" />
          {cartHistory.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {cartHistory.length}
            </span>
          )}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Recent Cart Activity</h4>
          {cartHistory.length > 0 ? (
            <ul className="space-y-2">
              {cartHistory.map((item) => (
                <li key={item.id} className="text-sm">
                  <span className="font-medium">{item.action_type}</span>
                  <span className="text-gray-500 text-xs ml-2">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No recent cart activity</p>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default CartHistory;