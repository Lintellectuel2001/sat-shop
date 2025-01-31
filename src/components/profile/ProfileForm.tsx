import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
}

interface ProfileFormProps {
  profile: Profile;
  setProfile: (profile: Profile) => void;
}

export const ProfileForm = ({ profile, setProfile }: ProfileFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/login');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          email: profile.email?.toLowerCase().trim(),
          phone: profile.phone,
          address: profile.address,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du profil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={updateProfile} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="fullName" className="text-sm font-medium text-primary">
          Nom complet
        </label>
        <Input
          id="fullName"
          type="text"
          value={profile.full_name || ''}
          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-primary">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={profile.email || ''}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium text-primary">
          Téléphone
        </label>
        <Input
          id="phone"
          type="tel"
          value={profile.phone || ''}
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-medium text-primary">
          Adresse
        </label>
        <Input
          id="address"
          type="text"
          value={profile.address || ''}
          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
          className="w-full"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-accent hover:bg-accent/90 text-white"
        disabled={loading}
      >
        {loading ? "Mise à jour..." : "Mettre à jour le profil"}
      </Button>
    </form>
  );
};