
import React from 'react';

const EmptyOrderState: React.FC = () => {
  return (
    <div className="rounded-md border p-8 text-center">
      <h3 className="font-medium text-lg mb-2">Aucune commande trouvée</h3>
      <p className="text-muted-foreground">
        Aucune commande n'a encore été passée par les clients.
      </p>
    </div>
  );
};

export default EmptyOrderState;
