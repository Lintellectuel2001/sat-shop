import { ProfileManager } from "@/components/profile/ProfileManager";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
        <div className="bg-white rounded-2xl shadow-elegant p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Mon Profil</h1>
            <p className="text-primary/60">
              Gérez vos informations personnelles
            </p>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="inline-flex items-center gap-2 mt-4 text-accent hover:text-accent/80 transition-colors"
              >
                Accéder au Panel Admin
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
          <ProfileManager />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;