import { ProfileManager } from "@/components/profile/ProfileManager";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserCog } from "lucide-react";

const Profile = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }

      const { data: adminData } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', session.user.id)
        .single();

      setIsAdmin(!!adminData);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-secondary">
      <Navbar />
      <div className="container mx-auto max-w-md pt-32 pb-16 px-4">
        {isAdmin && (
          <Button
            onClick={() => navigate('/admin')}
            className="w-full mb-8 py-6 text-lg bg-accent hover:bg-accent/90 shadow-lg"
          >
            <UserCog className="w-6 h-6 mr-2" />
            Accéder au Panel Administrateur
          </Button>
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