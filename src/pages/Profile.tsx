import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Profile = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
};

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
          <CardHeader>
            <CardTitle>Profil non trouvé</CardTitle>
            <CardDescription>
              Nous n'avons pas pu trouver votre profil. Veuillez vous connecter.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/login")} className="w-full">
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Mon Profil</CardTitle>
          <CardDescription>
            Gérez vos informations personnelles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-sm">Nom complet</h3>
            <p className="text-gray-600">{profile.full_name}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm">Email</h3>
            <p className="text-gray-600">{profile.email}</p>
          </div>
          {profile.phone && (
            <div>
              <h3 className="font-medium text-sm">Téléphone</h3>
              <p className="text-gray-600">{profile.phone}</p>
            </div>
          )}
          {profile.address && (
            <div>
              <h3 className="font-medium text-sm">Adresse</h3>
              <p className="text-gray-600">{profile.address}</p>
            </div>
          )}
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => navigate("/edit-profile")}
          >
            Modifier le profil
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}