
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, AlertTriangle, Info, CheckCircle, Eye } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuditEntry {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  details: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const SecurityAuditLog = () => {
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchAuditEntries();
  }, []);

  const fetchAuditEntries = async () => {
    try {
      // For now, we'll simulate audit entries since the table doesn't exist yet
      // In a real implementation, you would create an audit_log table
      const mockEntries: AuditEntry[] = [
        {
          id: '1',
          user_id: 'admin-1',
          action: 'admin_login',
          resource: 'admin_panel',
          details: { success: true },
          ip_address: '192.168.1.1',
          user_agent: 'Mozilla/5.0...',
          created_at: new Date().toISOString(),
          severity: 'medium'
        },
        {
          id: '2',
          user_id: 'user-1',
          action: 'failed_login',
          resource: 'authentication',
          details: { attempts: 3 },
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0...',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          severity: 'high'
        }
      ];
      
      setAuditEntries(mockEntries);
    } catch (error) {
      console.error('Error fetching audit entries:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les logs d'audit",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Info className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      critical: "destructive",
      high: "destructive",
      medium: "secondary",
      low: "outline"
    };
    
    return (
      <Badge variant={variants[severity] || "outline"}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const filteredEntries = auditEntries.filter(entry => {
    if (filter === 'all') return true;
    return entry.severity === filter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Journal d'audit de sécurité
            </CardTitle>
            <CardDescription>
              Surveillance des actions sensibles et des tentatives de sécurité
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par sévérité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                <SelectItem value="critical">Critique</SelectItem>
                <SelectItem value="high">Élevé</SelectItem>
                <SelectItem value="medium">Moyen</SelectItem>
                <SelectItem value="low">Faible</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchAuditEntries} variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Chargement des logs d'audit...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sévérité</TableHead>
                <TableHead>Date/Heure</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Ressource</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Détails</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(entry.severity)}
                      {getSeverityBadge(entry.severity)}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {formatDate(entry.created_at)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {entry.action}
                  </TableCell>
                  <TableCell>{entry.resource}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {entry.user_id.substring(0, 8)}...
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {entry.ip_address}
                  </TableCell>
                  <TableCell>
                    <pre className="text-xs bg-gray-100 p-1 rounded">
                      {JSON.stringify(entry.details, null, 1)}
                    </pre>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        {!isLoading && filteredEntries.length === 0 && (
          <div className="text-center py-8">
            <Shield className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Aucun log d'audit trouvé</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityAuditLog;
