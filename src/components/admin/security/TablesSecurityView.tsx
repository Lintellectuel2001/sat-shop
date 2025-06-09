
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";
import { SecurityAlert } from './SecurityAlert';

interface TableRLSStatus {
  schema_name: string;
  table_name: string;
  has_rls: boolean;
  exposed_to_postgrest: boolean;
}

interface TablesSecurityViewProps {
  tablesWithoutRLS: TableRLSStatus[];
  isChecking: boolean;
  error: string | null;
}

export const TablesSecurityView: React.FC<TablesSecurityViewProps> = ({
  tablesWithoutRLS,
  isChecking,
  error
}) => {
  if (tablesWithoutRLS.length > 0) {
    return (
      <>
        <SecurityAlert
          type="warning"
          title="Security Issue Detected"
          description="The following tables do not have Row Level Security (RLS) enabled. This could expose sensitive data if not intended."
        />
        
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
    );
  }

  if (tablesWithoutRLS.length === 0 && !isChecking && !error) {
    return (
      <SecurityAlert
        type="success"
        title="All Secure"
        description="All tables exposed to PostgREST have Row Level Security (RLS) enabled."
      />
    );
  }

  return null;
};
