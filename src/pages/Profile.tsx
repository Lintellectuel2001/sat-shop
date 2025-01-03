import { ProfileManager } from "@/components/profile/ProfileManager";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', user.id)
        .single();
      
      setIsAdmin(!!adminData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-secondary">
      <Navbar />
      <div className="container mx-auto max-w-md pt-32 pb-16 px-4">
        {isAdmin && (
          <div className="mb-8">
            <Button 
              asChild
              variant="default"
              size="lg"
              className="w-full bg-accent hover:bg-accent/90 text-lg font-semibold shadow-elegant"
            >
              <Link 
                to="/admin" 
                className="inline-flex items-center justify-center gap-2 py-6"
              >
                Panel Administrateur
                <ArrowRight className="w-6 h-6" />
              </Link>
            </Button>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-elegant p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Mon Profil</h1>
            <p className="text-primary/60">
              Gérez vos informations personnelles
            </p>
          </div>
          <ProfileManager />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;