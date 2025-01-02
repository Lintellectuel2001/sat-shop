import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileView } from "@/components/profile/ProfileView";

type Profile = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  subscription_status: string | null;
  subscription_type: string | null;
};

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function getProfile() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session?.user) {
          navigate("/login", { replace: true });
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;

        if (mounted) {
          setProfile(data);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Erreur lors du chargement du profil");
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    getProfile();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const onSubmit = async (data: Omit<Profile, 'id' | 'subscription_start_date' | 'subscription_end_date' | 'subscription_status' | 'subscription_type'>) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile?.id);

      if (error) throw error;

      toast.success("Profil mis à jour avec succès");
      setIsEditing(false);
      setProfile({ ...profile!, ...data });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container max-w-md mx-auto py-10">
        <Card>
          <ProfileHeader isEditing={false} />
          <CardContent>
            <p className="text-center text-gray-600 mb-4">
              Nous n'avons pas pu trouver votre profil. Veuillez vous connecter.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
            >
              Se connecter
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <ProfileHeader isEditing={isEditing} />
        <CardContent className="space-y-4">
          {isEditing ? (
            <ProfileForm
              initialData={{
                full_name: profile.full_name,
                email: profile.email,
                phone: profile.phone,
                address: profile.address,
              }}
              onSubmit={onSubmit}
              isLoading={isLoading}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <ProfileView
              profile={profile}
              onEdit={() => setIsEditing(true)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}