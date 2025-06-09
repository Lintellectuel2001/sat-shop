
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, LayoutDashboard } from 'lucide-react';

const AdminHeader = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div className="flex items-center">
        <div className="bg-accent/10 p-3 rounded-lg mr-4">
          <LayoutDashboard className="h-6 w-6 text-accent" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Administration
        </h1>
      </div>
      <Button variant="outline" asChild className="shadow-sm border-accent/20 hover:bg-accent/5">
        <Link to="/" className="flex items-center">
          <Home className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Link>
      </Button>
    </div>
  );
};

export default AdminHeader;
