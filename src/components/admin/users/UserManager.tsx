
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import UserTable from './UserTable';
import UserHeader from './UserHeader';
import { Loader2 } from 'lucide-react';

export interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  is_admin: boolean;
  user_metadata?: {
    full_name?: string;
  };
  profile?: {
    full_name: string | null;
    phone: string | null;
    address: string | null;
  };
}

const UserManager = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // Récupérer les utilisateurs depuis auth.users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        throw authError;
      }

      // Récupérer les profils depuis la table publique
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) {
        console.error("Erreur lors de la récupération des profils:", profilesError);
      }

      // Récupérer la liste des administrateurs
      const { data: adminUsers, error: adminError } = await supabase
        .from('admin_users')
        .select('id');
      
      if (adminError) {
        console.error("Erreur lors de la récupération des administrateurs:", adminError);
      }

      // Créer un map pour les profils pour faciliter l'accès
      const profileMap = new Map();
      profiles?.forEach(profile => {
        profileMap.set(profile.id, profile);
      });

      // Créer un set pour les administrateurs
      const adminSet = new Set();
      adminUsers?.forEach(admin => {
        adminSet.add(admin.id);
      });

      // Combiner les données
      const formattedUsers = authUsers?.users.map(user => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        user_metadata: user.user_metadata,
        is_admin: adminSet.has(user.id),
        profile: profileMap.get(user.id)
      })) || [];

      setUsers(formattedUsers);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleAdminStatus = async (userId: string, isCurrentlyAdmin: boolean) => {
    try {
      if (isCurrentlyAdmin) {
        // Supprimer l'utilisateur de la table des admins
        const { error } = await supabase
          .from('admin_users')
          .delete()
          .eq('id', userId);
        
        if (error) throw error;
        
        toast({
          title: "Droits modifiés",
          description: "L'utilisateur n'est plus administrateur",
        });
      } else {
        // Ajouter l'utilisateur à la table des admins
        const { error } = await supabase
          .from('admin_users')
          .insert([{ id: userId }]);
        
        if (error) throw error;
        
        toast({
          title: "Droits modifiés",
          description: "L'utilisateur est maintenant administrateur",
        });
      }
      
      // Mettre à jour la liste des utilisateurs
      await fetchUsers();
    } catch (error: any) {
      console.error("Erreur lors de la modification des droits:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier les droits de l'utilisateur",
      });
    }
  };

  return (
    <div className="space-y-6">
      <UserHeader refreshUsers={fetchUsers} />
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <span className="ml-2 text-accent">Chargement des utilisateurs...</span>
        </div>
      ) : (
        <UserTable 
          users={users} 
          onToggleAdmin={toggleAdminStatus}
          refreshUsers={fetchUsers}
        />
      )}
    </div>
  );
};

export default UserManager;
