
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrderManager from "@/components/orders/OrderManager";

const Orders = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-16">
        <OrderManager />
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
