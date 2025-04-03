
import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Crown, 
  Shield, 
  CalendarDays,
  Clock,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { UserData } from './UserManager';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserTableProps {
  users: UserData[];
  onToggleAdmin: (userId: string, isCurrentlyAdmin: boolean) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const UserTable = ({ users, onToggleAdmin, refreshUsers }: UserTableProps) => {
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const { toast } = useToast();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Jamais';
    return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr });
  };

  const getInitials = (user: UserData) => {
    if (user.profile?.full_name) {
      return user.profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
    } else if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
    } else if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.")) {
        return;
      }

      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;
      
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès",
      });
      
      await refreshUsers();
    } catch (error: any) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de supprimer l'utilisateur",
      });
    }
  };

  return (
    <>
      <Table>
        <TableCaption>Liste des utilisateurs inscrits ({users.length})</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Inscrit le</TableHead>
            <TableHead>Dernière connexion</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8 bg-primary/10">
                    <AvatarFallback className="text-xs">{getInitials(user)}</AvatarFallback>
                  </Avatar>
                  <span>{user.profile?.full_name || user.user_metadata?.full_name || 'Utilisateur'}</span>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{formatDate(user.created_at)}</TableCell>
              <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
              <TableCell>
                {user.is_admin ? (
                  <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                    <Crown className="mr-1 h-3 w-3" /> Admin
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    <Shield className="mr-1 h-3 w-3" /> Utilisateur
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedUser(user)}
                  >
                    Détails
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Détails de l'utilisateur</DialogTitle>
              <DialogDescription>
                Informations détaillées et gestion des droits.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center gap-4 mb-6">
                <Avatar className="h-20 w-20 bg-primary/10">
                  <AvatarFallback className="text-2xl">{getInitials(selectedUser)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-medium">
                  {selectedUser.profile?.full_name || selectedUser.user_metadata?.full_name || 'Utilisateur'}
                </h3>
              </div>
              
              <div className="grid gap-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedUser.email}</span>
                </div>
                
                {selectedUser.profile?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedUser.profile.phone}</span>
                  </div>
                )}
                
                {selectedUser.profile?.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedUser.profile.address}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>Inscrit le {formatDate(selectedUser.created_at)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Dernière connexion: {formatDate(selectedUser.last_sign_in_at)}</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Droits d'administration</h4>
                    <p className="text-sm text-muted-foreground">
                      Activer/désactiver les droits d'administration pour cet utilisateur
                    </p>
                  </div>
                  <Switch 
                    checked={selectedUser.is_admin}
                    onCheckedChange={async (checked) => {
                      await onToggleAdmin(selectedUser.id, selectedUser.is_admin);
                      setSelectedUser(null);
                    }}
                  />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default UserTable;
