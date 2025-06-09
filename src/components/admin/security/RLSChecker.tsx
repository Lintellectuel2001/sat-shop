
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRLSCheck } from './hooks/useRLSCheck';
import { ErrorAlert } from './ErrorAlert';
import { TablesSecurityView } from './TablesSecurityView';
import { FunctionsSecurityView } from './FunctionsSecurityView';

const RLSChecker = () => {
  const [activeTab, setActiveTab] = useState("tables");
  const {
    isChecking,
    tablesWithoutRLS,
    functionsWithoutSearchPath,
    error,
    checkSecurity
  } = useRLSCheck();

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
        {error && <ErrorAlert error={error} />}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="tables">Tables without RLS</TabsTrigger>
            <TabsTrigger value="functions">Functions without search_path</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tables">
            <TablesSecurityView 
              tablesWithoutRLS={tablesWithoutRLS}
              isChecking={isChecking}
              error={error}
            />
          </TabsContent>
          
          <TabsContent value="functions">
            <FunctionsSecurityView 
              functionsWithoutSearchPath={functionsWithoutSearchPath}
              isChecking={isChecking}
              error={error}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RLSChecker;
