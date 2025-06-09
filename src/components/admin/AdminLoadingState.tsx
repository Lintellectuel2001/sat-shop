
import React from 'react';

const AdminLoadingState = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-accent">Vérification des droits d'administration...</p>
      </div>
    </div>
  );
};

export default AdminLoadingState;
