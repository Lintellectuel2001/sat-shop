
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, AlertTriangle, CheckCircle, Loader2, Code } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TableRLSStatus {
  schema_name: string;
  table_name: string;
  has_rls: boolean;
  exposed_to_postgrest: boolean;
}

interface FunctionSearchPathStatus {
  schema_name: string;
  function_name: string;
  language: string;
}

const RLSChecker = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [tablesWithoutRLS, setTablesWithoutRLS] = useState<TableRLSStatus[]>([]);
  const [functionsWithoutSearchPath, setFunctionsWithoutSearchPath] = useState<FunctionSearchPathStatus[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("tables");
  const { toast } = useToast();

  const checkSecurity = async () => {
    setIsChecking(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('check-rls');

      if (error) {
        throw new Error(error.message || 'Failed to check security status');
      }

      if (data && data.tables_without_rls) {
        setTablesWithoutRLS(data.tables_without_rls);
        
        if (data.tables_without_rls.length === 0) {
          toast({
            title: "RLS Check Passed",
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

      if (data && data.functions_without_search_path) {
        setFunctionsWithoutSearchPath(data.functions_without_search_path);
        
        if (data.functions_without_search_path.length === 0 && data.tables_without_rls.length === 0) {
          toast({
            title: "Security Check Passed",
            description: "All functions have search_path set! Your database is secure.",
            variant: "default",
          });
        } else if (data.functions_without_search_path.length > 0) {
          toast({
            title: "Security Issue Detected",
            description: `Found ${data.functions_without_search_path.length} functions without search_path set.`,
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      console.error('Error checking security:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast({
        title: "Error",
        description: "Failed to check security status. See console for details.",
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
          <CardTitle className="text-2xl">Database Security Checker</CardTitle>
          <CardDescription>
            Check for security issues in your database (RLS, search_path)
          </CardDescription>
        </div>
        <Button 
          onClick={checkSecurity} 
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
              Check Security
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="tables">Tables without RLS</TabsTrigger>
            <TabsTrigger value="functions">Functions without search_path</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tables">
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
          </TabsContent>
          
          <TabsContent value="functions">
            {functionsWithoutSearchPath.length > 0 ? (
              <>
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Security Issue Detected</AlertTitle>
                  <AlertDescription>
                    The following functions do not have search_path set. 
                    This could lead to SQL injection vulnerabilities.
                  </AlertDescription>
                </Alert>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Schema</TableHead>
                      <TableHead>Function</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {functionsWithoutSearchPath.map((func, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{func.schema_name}</TableCell>
                        <TableCell className="font-medium">{func.function_name}</TableCell>
                        <TableCell>{func.language}</TableCell>
                        <TableCell>
                          <span className="text-destructive flex items-center gap-1">
                            <Code className="h-4 w-4" /> No search_path
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            ) : functionsWithoutSearchPath.length === 0 && !isChecking && !error ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle>All Secure</AlertTitle>
                <AlertDescription>
                  All PL/pgSQL functions have search_path set properly.
                </AlertDescription>
              </Alert>
            ) : null}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RLSChecker;
