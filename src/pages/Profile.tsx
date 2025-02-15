
import { ProfileManager } from "@/components/profile/ProfileManager";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoyaltyPointsCard from "@/components/marketing/LoyaltyPointsCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUserId(user.id);
    };

    checkAuth();
  }, [navigate]);

  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-secondary">
      <Navbar />
      <div className="container mx-auto pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white rounded-2xl shadow-elegant p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">Mon Profil</h1>
              <p className="text-primary/60">
                Gérez vos informations personnelles
              </p>
            </div>
            <ProfileManager />
          </div>

          {/* Points de fidélité */}
          <div className="bg-white rounded-2xl shadow-elegant p-8">
            <LoyaltyPointsCard userId={userId} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
