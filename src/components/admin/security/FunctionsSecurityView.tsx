
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Code } from "lucide-react";
import { SecurityAlert } from './SecurityAlert';

interface FunctionSearchPathStatus {
  schema_name: string;
  function_name: string;
  language: string;
}

interface FunctionsSecurityViewProps {
  functionsWithoutSearchPath: FunctionSearchPathStatus[];
  isChecking: boolean;
  error: string | null;
}

export const FunctionsSecurityView: React.FC<FunctionsSecurityViewProps> = ({
  functionsWithoutSearchPath,
  isChecking,
  error
}) => {
  if (functionsWithoutSearchPath.length > 0) {
    return (
      <>
        <SecurityAlert
          type="warning"
          title="Security Issue Detected"
          description="The following functions do not have search_path set. This could lead to SQL injection vulnerabilities."
        />
        
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
    );
  }

  if (functionsWithoutSearchPath.length === 0 && !isChecking && !error) {
    return (
      <SecurityAlert
        type="success"
        title="All Secure"
        description="All PL/pgSQL functions have search_path set properly."
      />
    );
  }

  return null;
};
