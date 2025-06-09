
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

export const useRLSCheck = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [tablesWithoutRLS, setTablesWithoutRLS] = useState<TableRLSStatus[]>([]);
  const [functionsWithoutSearchPath, setFunctionsWithoutSearchPath] = useState<FunctionSearchPathStatus[]>([]);
  const [error, setError] = useState<string | null>(null);
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

  return {
    isChecking,
    tablesWithoutRLS,
    functionsWithoutSearchPath,
    error,
    checkSecurity
  };
};
