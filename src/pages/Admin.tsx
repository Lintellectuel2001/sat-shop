import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      setIsLoading(true);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      if (!session) {
        toast({
          title: "Accès refusé",
          description: "Veuillez vous connecter d'abord",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      const { data, error: adminError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle();

      if (adminError) {
        console.error("Erreur lors de la vérification des droits admin:", adminError);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification des droits",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      if (!data) {
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
      console.error('Erreur lors de la vérification des droits admin:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification des droits",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <p className="text-lg text-muted-foreground">
              Vérification des droits d'accès...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
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