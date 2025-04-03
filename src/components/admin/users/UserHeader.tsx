
import React from 'react';
import { RefreshCcw, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface UserHeaderProps {
  refreshUsers: () => Promise<void>;
}

const UserHeader = ({ refreshUsers }: UserHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Users className="h-5 w-5 text-accent" />
        <h2 className="text-xl font-semibold">Gestion des utilisateurs</h2>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={refreshUsers}
        className="gap-2"
      >
        <RefreshCcw className="h-4 w-4" />
        Actualiser
      </Button>
    </div>
  );
};

export default UserHeader;
