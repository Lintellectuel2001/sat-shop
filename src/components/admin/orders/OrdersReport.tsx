
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { saveAs } from 'file-saver';
import { DownloadCloud, Printer } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const OrdersReport = ({ open, onOpenChange, orders }) => {
  const [activeTab, setActiveTab] = useState('summary');

  // Préparation des données pour les graphiques
  const prepareSalesData = () => {
    const salesByDate = {};
    orders.forEach(order => {
      const date = new Date(order.created_at).toLocaleDateString('fr-FR');
      if (!salesByDate[date]) {
        salesByDate[date] = 0;
      }
      salesByDate[date] += parseFloat(order.amount);
    });
    
    return Object.keys(salesByDate).map(date => ({
      date,
      amount: salesByDate[date]
    }));
  };

  const prepareStatusData = () => {
    const statusCount = {};
    orders.forEach(order => {
      if (!statusCount[order.status]) {
        statusCount[order.status] = 0;
      }
      statusCount[order.status]++;
    });
    
    return Object.keys(statusCount).map(status => ({
      name: status,
      value: statusCount[status]
    }));
  };

  const salesData = prepareSalesData();
  const statusData = prepareStatusData();

  // Calcul des statistiques
  const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.amount), 0);
  const averageOrderValue = totalSales / (orders.length || 1);

  // Fonction pour exporter le rapport en CSV
  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Date,Client,Téléphone,Adresse,Produit,Montant,Statut\n";
    
    orders.forEach(order => {
      const date = new Date(order.created_at).toLocaleDateString('fr-FR');
      const productName = order.products ? order.products.name : 'N/A';
      
      const row = [
        order.id,
        date,
        order.customer_name,
        order.customer_phone,
        order.customer_address,
        productName,
        order.amount,
        order.status
      ].join(',');
      
      csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rapport_commandes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fonction pour imprimer le rapport
  const printReport = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rapport des commandes</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Résumé</TabsTrigger>
            <TabsTrigger value="sales">Ventes</TabsTrigger>
            <TabsTrigger value="status">Statuts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow border">
                <h3 className="text-sm font-medium text-muted-foreground">Total des commandes</h3>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border">
                <h3 className="text-sm font-medium text-muted-foreground">Chiffre d'affaires</h3>
                <p className="text-2xl font-bold">{totalSales.toLocaleString('fr-FR')} DA</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border">
                <h3 className="text-sm font-medium text-muted-foreground">Valeur moyenne</h3>
                <p className="text-2xl font-bold">{averageOrderValue.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} DA</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-sm font-medium mb-4">Distribution par statut</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sales">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-sm font-medium mb-4">Évolution des ventes</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salesData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <XAxis 
                      dataKey="date" 
                      angle={-45} 
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString('fr-FR')} DA`} />
                    <Bar 
                      dataKey="amount" 
                      fill="#8884d8" 
                      name="Montant (DA)" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="status">
            <div className="bg-white p-4 rounded-lg shadow border">
              <h3 className="text-sm font-medium mb-4">Répartition par statut</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={statusData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                  >
                    <XAxis type="number" />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={80}
                    />
                    <Tooltip />
                    <Bar 
                      dataKey="value" 
                      fill="#82ca9d" 
                      name="Nombre de commandes"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={exportCSV}>
              <DownloadCloud className="mr-2 h-4 w-4" />
              Exporter CSV
            </Button>
            <Button variant="outline" onClick={printReport}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
          </div>
          <Button variant="default" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrdersReport;
