
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
import { UserData } from './UserManager';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from '@/components/ui/switch';
import { Mail, Phone, MapPin, CalendarDays, Clock, Shield, UserCog, Trash2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserTableProps {
  users: UserData[];
  onToggleAdmin: (userId: string, isCurrentlyAdmin: boolean) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const UserTable = ({ users, onToggleAdmin, onDeleteUser, refreshUsers }: UserTableProps) => {
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Jamais';
    try {
      return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr });
    } catch (error) {
      console.error("Erreur de formatage de date:", error);
      return 'Date invalide';
    }
  };

  const getInitials = (user: UserData) => {
    if (user.profile?.full_name) {
      return user.profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
    } else if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsLoading(true);
    try {
      await onDeleteUser(userToDelete.id);
      setUserToDelete(null);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAdmin = async (userId: string, isAdmin: boolean) => {
    setIsLoading(true);
    try {
      await onToggleAdmin(userId, isAdmin);
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
    } finally {
      setIsLoading(false);
      setSelectedUser(null);
    }
  };

  const userName = (user: UserData) => {
    return user.profile?.full_name || 'Utilisateur';
  };

  return (
    <>
      <Table>
        <TableCaption>{users.length} utilisateurs enregistrés</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="hidden md:table-cell">Inscrit le</TableHead>
            <TableHead className="hidden md:table-cell">Dernière connexion</TableHead>
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
                  <span className="hidden md:inline">{userName(user)}</span>
                </div>
              </TableCell>
              <TableCell className="max-w-[160px] truncate" title={user.email}>
                {user.email}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {formatDate(user.created_at)}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {formatDate(user.last_sign_in_at)}
              </TableCell>
              <TableCell>
                {user.is_admin ? (
                  <Badge className="bg-amber-500 hover:bg-amber-600">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    <User className="h-3 w-3 mr-1" />
                    Utilisateur
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setSelectedUser(user)}
                    title="Détails"
                  >
                    <UserCog className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setUserToDelete(user)}
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Aucun utilisateur trouvé
              </TableCell>
            </TableRow>
          )}
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
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-20 w-20 bg-primary/10">
                  <AvatarFallback className="text-2xl">{getInitials(selectedUser)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-medium">
                  {userName(selectedUser)}
                </h3>
              </div>
              
              <div className="grid gap-3 mt-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="break-all">{selectedUser.email}</span>
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
                      {selectedUser.is_admin 
                        ? "Retirer les droits d'administration"
                        : "Donner les droits d'administration"}
                    </p>
                  </div>
                  <Switch 
                    checked={selectedUser.is_admin}
                    disabled={isLoading}
                    onCheckedChange={(checked) => {
                      handleToggleAdmin(selectedUser.id, selectedUser.is_admin);
                    }}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter className="sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setSelectedUser(null)}
              >
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement le compte
              {userToDelete && <strong className="mx-1">{userToDelete.email}</strong>}
              et toutes ses données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteUser();
              }}
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoading ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserTable;
