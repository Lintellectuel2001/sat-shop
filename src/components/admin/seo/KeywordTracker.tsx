
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Plus, Target, TrendingUp, TrendingDown, Minus, Search, BarChart } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Keyword {
  id: string;
  keyword: string;
  target_url: string;
  current_position: number;
  previous_position: number;
  search_volume: number;
  difficulty: string;
  created_at: string;
  last_checked: string;
}

const KeywordTracker = () => {
  const [newKeyword, setNewKeyword] = useState({
    keyword: '',
    target_url: '',
    search_volume: 0,
    difficulty: 'medium',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { data: keywords, refetch } = useQuery({
    queryKey: ['keywords'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seo_keywords')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Keyword[];
    },
  });

  const handleAddKeyword = async () => {
    if (!newKeyword.keyword || !newKeyword.target_url) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le mot-clé et l'URL cible sont obligatoires",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('seo_keywords')
        .insert([{
          ...newKeyword,
          current_position: 0,
          previous_position: 0,
        }]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Mot-clé ajouté avec succès",
      });

      setNewKeyword({
        keyword: '',
        target_url: '',
        search_volume: 0,
        difficulty: 'medium',
      });
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error('Error adding keyword:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le mot-clé",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteKeyword = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('seo_keywords')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Mot-clé supprimé avec succès",
      });

      refetch();
    } catch (error: any) {
      console.error('Error deleting keyword:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le mot-clé",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const simulatePositionUpdate = async () => {
    if (!keywords?.length) return;

    setIsLoading(true);
    try {
      // Simuler des positions aléatoires pour la démo
      const updates = keywords.map(keyword => ({
        id: keyword.id,
        previous_position: keyword.current_position,
        current_position: Math.floor(Math.random() * 100) + 1,
        last_checked: new Date().toISOString(),
      }));

      for (const update of updates) {
        await supabase
          .from('seo_keywords')
          .update(update)
          .eq('id', update.id);
      }

      toast({
        title: "Succès",
        description: "Positions mises à jour (simulation)",
      });

      refetch();
    } catch (error: any) {
      console.error('Error updating positions:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour les positions",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPositionTrend = (current: number, previous: number) => {
    if (current === 0 || previous === 0) return null;
    if (current < previous) return 'up';
    if (current > previous) return 'down';
    return 'stable';
  };

  const getTrendIcon = (trend: string | null) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Suivi des Mots-clés</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={simulatePositionUpdate} disabled={isLoading}>
            <Search className="mr-2 h-4 w-4" />
            Vérifier positions
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter mot-clé
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un mot-clé à suivre</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Mot-clé *</label>
                  <Input
                    placeholder="iptv algérie, abonnement iptv"
                    value={newKeyword.keyword}
                    onChange={(e) => setNewKeyword({ ...newKeyword, keyword: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">URL cible *</label>
                  <Input
                    placeholder="/marketplace, /product/123"
                    value={newKeyword.target_url}
                    onChange={(e) => setNewKeyword({ ...newKeyword, target_url: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Volume de recherche (estimation)</label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={newKeyword.search_volume}
                    onChange={(e) => setNewKeyword({ ...newKeyword, search_volume: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Difficulté</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={newKeyword.difficulty}
                    onChange={(e) => setNewKeyword({ ...newKeyword, difficulty: e.target.value })}
                  >
                    <option value="easy">Facile</option>
                    <option value="medium">Moyen</option>
                    <option value="hard">Difficile</option>
                  </select>
                </div>
                <Button onClick={handleAddKeyword} disabled={isLoading} className="w-full">
                  Ajouter
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total mots-clés</p>
                <p className="text-2xl font-bold">{keywords?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Top 10</p>
                <p className="text-2xl font-bold">
                  {keywords?.filter(k => k.current_position > 0 && k.current_position <= 10).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Position moyenne</p>
                <p className="text-2xl font-bold">
                  {keywords?.length ? 
                    Math.round(keywords.filter(k => k.current_position > 0).reduce((acc, k) => acc + k.current_position, 0) / keywords.filter(k => k.current_position > 0).length) || 0
                    : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Volume total</p>
                <p className="text-2xl font-bold">
                  {keywords?.reduce((acc, k) => acc + k.search_volume, 0).toLocaleString() || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keywords List */}
      <div className="space-y-4">
        {keywords?.map((keyword) => {
          const trend = getPositionTrend(keyword.current_position, keyword.previous_position);
          return (
            <Card key={keyword.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{keyword.keyword}</h4>
                      <Badge className={getDifficultyColor(keyword.difficulty)}>
                        {keyword.difficulty === 'easy' ? 'Facile' : keyword.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>URL: {keyword.target_url}</span>
                      <span>Volume: {keyword.search_volume.toLocaleString()}</span>
                      {keyword.last_checked && (
                        <span>Dernière vérification: {new Date(keyword.last_checked).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        {getTrendIcon(trend)}
                        <span className="text-2xl font-bold">
                          {keyword.current_position === 0 ? '-' : keyword.current_position}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">Position</span>
                    </div>

                    {keyword.previous_position > 0 && (
                      <div className="text-center text-sm text-gray-500">
                        <span>Précédent: {keyword.previous_position}</span>
                        {trend && (
                          <div className={`text-xs ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                            {trend === 'up' ? `+${keyword.previous_position - keyword.current_position}` : 
                             trend === 'down' ? `-${keyword.current_position - keyword.previous_position}` : 
                             '='}
                          </div>
                        )}
                      </div>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteKeyword(keyword.id)}
                      disabled={isLoading}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {!keywords?.length && (
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun mot-clé suivi</h3>
              <p className="text-gray-600 mb-4">
                Commencez par ajouter des mots-clés importants pour votre business IPTV.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter votre premier mot-clé
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suggestions de mots-clés IPTV</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              'iptv algérie', 'abonnement iptv', 'iptv premium', 'iptv 4k',
              'télévision streaming', 'chaînes sportives', 'iptv pas cher', 'iptv fiable',
              'streaming hd', 'box iptv', 'iptv android', 'iptv smart tv'
            ].map((suggestion) => (
              <Badge 
                key={suggestion} 
                variant="outline" 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setNewKeyword({ ...newKeyword, keyword: suggestion })}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-3">
            💡 Cliquez sur une suggestion pour l'ajouter rapidement à votre liste.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeywordTracker;
