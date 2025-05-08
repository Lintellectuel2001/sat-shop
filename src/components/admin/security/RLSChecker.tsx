
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TableRLSStatus {
  schema_name: string;
  table_name: string;
  has_rls: boolean;
  exposed_to_postgrest: boolean;
}

const RLSChecker = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [tablesWithoutRLS, setTablesWithoutRLS] = useState<TableRLSStatus[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const checkRLS = async () => {
    setIsChecking(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('check-rls');

      if (error) {
        throw new Error(error.message || 'Failed to check RLS status');
      }

      if (data && data.tables_without_rls) {
        setTablesWithoutRLS(data.tables_without_rls);
        
        if (data.tables_without_rls.length === 0) {
          toast({
            title: "Security Check Passed",
            description: "All tables have RLS enabled! Your database is secure.",
            variant: "default",
          });
        } else {
          toast({
            title: "Security Issue Detected",
            description: `Found ${data.tables_without_rls.length} tables without RLS enabled.`,
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      console.error('Error checking RLS:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast({
        title: "Error",
        description: "Failed to check RLS status. See console for details.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">Row Level Security Checker</CardTitle>
          <CardDescription>
            Check for tables that are missing Row Level Security (RLS)
          </CardDescription>
        </div>
        <Button 
          onClick={checkRLS} 
          disabled={isChecking}
          className="flex items-center gap-2"
        >
          {isChecking ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <Shield className="h-4 w-4" />
              Check RLS Status
            </>
          )}
        </Button>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {tablesWithoutRLS.length > 0 ? (
          <>
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Security Issue Detected</AlertTitle>
              <AlertDescription>
                The following tables do not have Row Level Security (RLS) enabled. 
                This could expose sensitive data if not intended.
              </AlertDescription>
            </Alert>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Schema</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tablesWithoutRLS.map((table, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{table.schema_name}</TableCell>
                    <TableCell className="font-medium">{table.table_name}</TableCell>
                    <TableCell>
                      <span className="text-destructive flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" /> No RLS
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : tablesWithoutRLS.length === 0 && !isChecking && !error ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>All Secure</AlertTitle>
            <AlertDescription>
              All tables exposed to PostgREST have Row Level Security (RLS) enabled.
            </AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default RLSChecker;
