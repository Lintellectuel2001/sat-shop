
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, Trash2, RefreshCw, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Backup {
  id: string;
  created_at: string;
  name: string;
  description?: string;
  data: any;
  size?: number;
}

const BackupManager = () => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
  const [backupToDelete, setBackupToDelete] = useState<Backup | null>(null);
  const [backupName, setBackupName] = useState(`Sauvegarde du ${format(new Date(), 'dd MMMM yyyy', { locale: fr })}`);
  const [backupDescription, setBackupDescription] = useState('');
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('backups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBackups(data || []);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des sauvegardes:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de récupérer les sauvegardes",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createBackup = async () => {
    if (!backupName.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom de la sauvegarde est requis",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Récupérer les données à sauvegarder (produits, slides, settings)
      const [productsResult, slidesResult, settingsResult] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('slides').select('*'),
        supabase.from('site_settings').select('*')
      ]);

      if (productsResult.error) throw productsResult.error;
      if (slidesResult.error) throw slidesResult.error;
      if (settingsResult.error) throw settingsResult.error;

      const backupData = {
        products: productsResult.data || [],
        slides: slidesResult.data || [],
        settings: settingsResult.data || [],
        timestamp: new Date().toISOString(),
        version: '1.0'
      };

      // Calculer la taille approximative des données en Ko
      const size = Math.round(JSON.stringify(backupData).length / 1024);

      // Sauvegarder dans la table de backups
      const { error } = await supabase
        .from('backups')
        .insert([{
          name: backupName,
          description: backupDescription,
          data: backupData,
          size: size
        }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Sauvegarde créée avec succès",
      });
      
      setIsBackupDialogOpen(false);
      setBackupName(`Sauvegarde du ${format(new Date(), 'dd MMMM yyyy', { locale: fr })}`);
      setBackupDescription('');
      fetchBackups();
    } catch (error: any) {
      console.error('Erreur lors de la création de la sauvegarde:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de créer la sauvegarde",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const restoreBackup = async () => {
    if (!selectedBackup) return;

    setIsLoading(true);
    try {
      const backupData = selectedBackup.data;
      
      // Confirmation pour la restauration
      const confirmRestore = window.confirm(
        "Attention: La restauration remplacera toutes les données actuelles. Êtes-vous sûr de vouloir continuer?"
      );
      
      if (!confirmRestore) {
        setIsLoading(false);
        setIsRestoreDialogOpen(false);
        return;
      }

      // Restaurer les paramètres du site
      if (backupData.settings && backupData.settings.length > 0) {
        const firstSetting = backupData.settings[0];
        const { error: deleteSettingsError } = await supabase
          .from('site_settings')
          .delete()
          .not('id', 'is', null);
          
        if (deleteSettingsError) throw deleteSettingsError;

        const { error: insertSettingsError } = await supabase
          .from('site_settings')
          .insert(backupData.settings);
          
        if (insertSettingsError) throw insertSettingsError;
      }

      // Restaurer les slides (supprimer puis insérer)
      if (backupData.slides && backupData.slides.length > 0) {
        const { error: deleteSlidesError } = await supabase
          .from('slides')
          .delete()
          .not('id', 'is', null);
          
        if (deleteSlidesError) throw deleteSlidesError;
          
        const { error: insertSlidesError } = await supabase
          .from('slides')
          .insert(backupData.slides);
          
        if (insertSlidesError) throw insertSlidesError;
      }

      // Restaurer les produits (supprimer puis insérer)
      if (backupData.products && backupData.products.length > 0) {
        const { error: deleteProductsError } = await supabase
          .from('products')
          .delete()
          .not('id', 'is', null);
          
        if (deleteProductsError) throw deleteProductsError;
          
        const { error: insertProductsError } = await supabase
          .from('products')
          .insert(backupData.products);
          
        if (insertProductsError) throw insertProductsError;
      }

      toast({
        title: "Succès",
        description: "Restauration effectuée avec succès",
      });
      
      setIsRestoreDialogOpen(false);
      setSelectedBackup(null);
    } catch (error: any) {
      console.error('Erreur lors de la restauration:', error);
      toast({
        variant: "destructive",
        title: "Erreur de restauration",
        description: error.message || "Impossible de restaurer les données",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBackup = async () => {
    if (!backupToDelete) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('backups')
        .delete()
        .eq('id', backupToDelete.id);

      if (error) throw error;

      toast({
        title: "Suppression réussie",
        description: "La sauvegarde a été supprimée",
      });
      
      setBackupToDelete(null);
      fetchBackups();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de supprimer la sauvegarde",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadBackup = (backup: Backup) => {
    try {
      // Créer un blob avec les données de la sauvegarde
      const backupBlob = new Blob([JSON.stringify(backup.data, null, 2)], {
        type: 'application/json'
      });
      
      // Créer un URL pour le blob
      const url = URL.createObjectURL(backupBlob);
      
      // Créer un lien pour le téléchargement
      const link = document.createElement('a');
      link.href = url;
      link.download = `${backup.name.replace(/\s+/g, '_')}.json`;
      
      // Simuler un clic sur le lien pour démarrer le téléchargement
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Téléchargement démarré",
        description: "La sauvegarde est en cours de téléchargement",
      });
    } catch (error: any) {
      console.error('Erreur lors du téléchargement:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de télécharger la sauvegarde",
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  const formatSize = (sizeInKb?: number) => {
    if (!sizeInKb) return 'N/A';
    if (sizeInKb < 1024) return `${sizeInKb} Ko`;
    return `${(sizeInKb / 1024).toFixed(2)} Mo`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Gestion des Sauvegardes</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={fetchBackups}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button 
            onClick={() => setIsBackupDialogOpen(true)}
            disabled={isLoading}
          >
            <Download className="mr-2 h-4 w-4" />
            Nouvelle Sauvegarde
          </Button>
        </div>
      </div>

      {backups.length === 0 ? (
        <div className="bg-secondary/20 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Aucune sauvegarde disponible</h3>
          <p className="text-muted-foreground mb-4">
            Créez votre première sauvegarde pour protéger vos données
          </p>
          <Button 
            onClick={() => setIsBackupDialogOpen(true)}
            disabled={isLoading}
          >
            <Download className="mr-2 h-4 w-4" />
            Créer une sauvegarde
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {backups.map(backup => (
            <Card key={backup.id} className="border border-accent/10 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium truncate" title={backup.name}>
                  {backup.name}
                </CardTitle>
                <CardDescription className="flex items-center text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDate(backup.created_at)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                  {backup.description || "Aucune description"}
                </p>
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>Taille: {formatSize(backup.size)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 pt-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => downloadBackup(backup)}
                  title="Télécharger"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSelectedBackup(backup);
                    setIsRestoreDialogOpen(true);
                  }}
                  title="Restaurer"
                  className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setBackupToDelete(backup)}
                  title="Supprimer"
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Dialogue de création de sauvegarde */}
      <Dialog open={isBackupDialogOpen} onOpenChange={setIsBackupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer une nouvelle sauvegarde</DialogTitle>
            <DialogDescription>
              Sauvegardez les produits, diaporamas, et paramètres du site.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="backup-name" className="text-sm font-medium">
                Nom de la sauvegarde
              </label>
              <input
                id="backup-name"
                type="text"
                className="w-full p-2 border rounded-md"
                value={backupName}
                onChange={(e) => setBackupName(e.target.value)}
                placeholder="Nom de la sauvegarde"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="backup-description" className="text-sm font-medium">
                Description (optionnelle)
              </label>
              <textarea
                id="backup-description"
                className="w-full p-2 border rounded-md"
                value={backupDescription}
                onChange={(e) => setBackupDescription(e.target.value)}
                placeholder="Description de la sauvegarde"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsBackupDialogOpen(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button 
              onClick={createBackup}
              disabled={isLoading}
            >
              {isLoading ? 'Création...' : 'Créer la sauvegarde'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue de restauration */}
      <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Restaurer une sauvegarde</DialogTitle>
            <DialogDescription>
              Attention: Cette action remplacera toutes les données existantes par celles de la sauvegarde.
            </DialogDescription>
          </DialogHeader>
          
          {selectedBackup && (
            <div className="py-4">
              <h3 className="font-medium">{selectedBackup.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Créée le {formatDate(selectedBackup.created_at)}
              </p>
              <p className="text-sm mb-4">
                {selectedBackup.description || "Aucune description"}
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800">
                <strong>Attention:</strong> Toutes les données actuelles seront remplacées. Cette action ne peut pas être annulée.
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsRestoreDialogOpen(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button 
              variant="destructive"
              onClick={restoreBackup}
              disabled={isLoading}
            >
              {isLoading ? 'Restauration...' : 'Confirmer la restauration'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue de suppression */}
      <AlertDialog open={!!backupToDelete} onOpenChange={(open) => !open && setBackupToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette sauvegarde ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La sauvegarde
              {backupToDelete && <strong className="mx-1">{backupToDelete.name}</strong>}
              sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                deleteBackup();
              }}
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoading ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BackupManager;
