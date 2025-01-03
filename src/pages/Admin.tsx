import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Accès refusé",
          description: "Veuillez vous connecter d'abord",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', session.user.id)
        .single();

      if (adminError || !adminData) {
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'administration",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin status:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification des droits",
        variant: "destructive",
      });
      navigate('/');
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Panel Administrateur</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-elegant">
            <h2 className="text-xl font-semibold mb-4">Gestion des Produits</h2>
            <p className="text-muted-foreground mb-4">
              Gérez les produits disponibles sur la marketplace
            </p>
            <button
              onClick={() => navigate('/admin/products')}
              className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent/80 transition-colors"
            >
              Gérer les produits
            </button>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-elegant">
            <h2 className="text-xl font-semibold mb-4">Gestion des Slides</h2>
            <p className="text-muted-foreground mb-4">
              Gérez les slides du carrousel sur la page d'accueil
            </p>
            <button
              onClick={() => navigate('/admin/slides')}
              className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent/80 transition-colors"
            >
              Gérer les slides
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;