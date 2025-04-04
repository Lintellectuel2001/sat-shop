
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import UserTable from './UserTable';
import UserHeader from './UserHeader';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
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
        last_sign_in_at: user.last_sign_at || user.last_sign_in_at,
        user_metadata: user.user_metadata,
        is_admin: adminSet.has(user.id),
        profile: profileMap.get(user.id)
      })) || [];

      setUsers(formattedUsers);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      setError(error.message || "Impossible de charger les utilisateurs");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Supprimer l'utilisateur via l'API Supabase Admin
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;
      
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès",
      });
      
      // Rafraîchir la liste après suppression
      await fetchUsers();
    } catch (error: any) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de supprimer l'utilisateur",
      });
    }
  };

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

  useEffect(() => {
    fetchUsers();
    
    // Setup pour les évènements en temps réel afin de mettre à jour la liste quand les profils changent
    const channel = supabase
      .channel('table-db-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles',
      }, () => {
        fetchUsers();
      })
      .on('postgres_changes', {
        event: '*', 
        schema: 'public',
        table: 'admin_users',
      }, () => {
        fetchUsers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-6">
      <UserHeader refreshUsers={fetchUsers} />
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <span className="ml-3 text-lg font-medium">Chargement des utilisateurs...</span>
        </div>
      ) : (
        <UserTable 
          users={users} 
          onToggleAdmin={toggleAdminStatus}
          onDeleteUser={deleteUser}
          refreshUsers={fetchUsers}
        />
      )}

      {!isLoading && users.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
        </div>
      )}
    </div>
  );
};

export default UserManager;
