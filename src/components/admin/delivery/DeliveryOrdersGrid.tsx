import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DeliveryOrder {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  status: string;
  amount: string;
  created_at: string;
}

interface DeliveryOrdersGridProps {
  orders: DeliveryOrder[];
  onStatusUpdate: (orderId: string, newStatus: string) => void;
}

const DeliveryOrdersGrid = ({ orders, onStatusUpdate }: DeliveryOrdersGridProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Adresse</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.customer_name}</TableCell>
              <TableCell>{order.customer_phone}</TableCell>
              <TableCell>{order.customer_address}</TableCell>
              <TableCell>{order.amount} DA</TableCell>
              <TableCell>
                {new Date(order.created_at).toLocaleDateString('fr-FR')}
              </TableCell>
              <TableCell>
                <Select
                  defaultValue={order.status}
                  onValueChange={(value) => onStatusUpdate(order.id, value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="processing">En cours</SelectItem>
                    <SelectItem value="delivered">Livré</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DeliveryOrdersGrid;