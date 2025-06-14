
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MetaData {
  id: string;
  page_url: string;
  title: string;
  description: string;
  keywords: string;
  created_at: string;
}

const MetaDescriptionManager = () => {
  const [newMeta, setNewMeta] = useState({
    page_url: '',
    title: '',
    description: '',
    keywords: '',
  });
  const [editingMeta, setEditingMeta] = useState<MetaData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { data: metaData, refetch } = useQuery({
    queryKey: ['meta-descriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seo_meta_data')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MetaData[];
    },
  });

  const handleSave = async () => {
    if (!newMeta.page_url || !newMeta.title || !newMeta.description) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Tous les champs obligatoires doivent être remplis",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('seo_meta_data')
        .insert([newMeta]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Méta données ajoutées avec succès",
      });

      setNewMeta({ page_url: '', title: '', description: '', keywords: '' });
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error('Error saving meta data:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter les méta données",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingMeta) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('seo_meta_data')
        .update({
          title: editingMeta.title,
          description: editingMeta.description,
          keywords: editingMeta.keywords,
        })
        .eq('id', editingMeta.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Méta données mises à jour avec succès",
      });

      setEditingMeta(null);
      refetch();
    } catch (error: any) {
      console.error('Error updating meta data:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour les méta données",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('seo_meta_data')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Méta données supprimées avec succès",
      });

      refetch();
    } catch (error: any) {
      console.error('Error deleting meta data:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer les méta données",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Gestion des Méta Descriptions</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une page
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter des méta données</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">URL de la page *</label>
                <Input
                  placeholder="/produits, /contact, etc."
                  value={newMeta.page_url}
                  onChange={(e) => setNewMeta({ ...newMeta, page_url: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Titre SEO * (max 60 caractères)</label>
                <Input
                  placeholder="Titre optimisé pour les moteurs de recherche"
                  value={newMeta.title}
                  onChange={(e) => setNewMeta({ ...newMeta, title: e.target.value })}
                  maxLength={60}
                />
                <span className="text-xs text-gray-500">{newMeta.title.length}/60</span>
              </div>
              <div>
                <label className="text-sm font-medium">Description * (max 160 caractères)</label>
                <Textarea
                  placeholder="Description optimisée pour les moteurs de recherche"
                  value={newMeta.description}
                  onChange={(e) => setNewMeta({ ...newMeta, description: e.target.value })}
                  maxLength={160}
                />
                <span className="text-xs text-gray-500">{newMeta.description.length}/160</span>
              </div>
              <div>
                <label className="text-sm font-medium">Mots-clés (séparés par des virgules)</label>
                <Input
                  placeholder="iptv, streaming, télévision"
                  value={newMeta.keywords}
                  onChange={(e) => setNewMeta({ ...newMeta, keywords: e.target.value })}
                />
              </div>
              <Button onClick={handleSave} disabled={isLoading} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {metaData?.map((meta) => (
          <Card key={meta.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {meta.page_url}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingMeta(meta)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(meta.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingMeta?.id === meta.id ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Titre SEO</label>
                    <Input
                      value={editingMeta.title}
                      onChange={(e) => setEditingMeta({ ...editingMeta, title: e.target.value })}
                      maxLength={60}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={editingMeta.description}
                      onChange={(e) => setEditingMeta({ ...editingMeta, description: e.target.value })}
                      maxLength={160}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Mots-clés</label>
                    <Input
                      value={editingMeta.keywords}
                      onChange={(e) => setEditingMeta({ ...editingMeta, keywords: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleUpdate} disabled={isLoading}>
                      Sauvegarder
                    </Button>
                    <Button variant="outline" onClick={() => setEditingMeta(null)}>
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Titre:</span>
                    <p className="text-sm text-gray-600">{meta.title}</p>
                  </div>
                  <div>
                    <span className="font-medium">Description:</span>
                    <p className="text-sm text-gray-600">{meta.description}</p>
                  </div>
                  {meta.keywords && (
                    <div>
                      <span className="font-medium">Mots-clés:</span>
                      <p className="text-sm text-gray-600">{meta.keywords}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MetaDescriptionManager;
