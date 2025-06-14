
import React from 'react';
import { Truck, MapPin, CreditCard } from 'lucide-react';

const CODHeader = () => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-medium mb-6 gradient-text">
        Livraison en Algérie
      </h1>
      <p className="text-xl text-primary-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
        Commandez vos produits préférés et payez à la livraison partout en Algérie
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="card-modern text-center p-6">
          <div className="bg-accent-100 dark:bg-accent-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="w-8 h-8 text-accent-600 dark:text-accent-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Livraison Rapide</h3>
          <p className="text-primary-600 dark:text-gray-300 text-sm">
            Livraison dans toute l'Algérie sous 2-5 jours ouvrables
          </p>
        </div>

        <div className="card-modern text-center p-6">
          <div className="bg-success-100 dark:bg-success-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-success-600 dark:text-success-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Paiement à la Livraison</h3>
          <p className="text-primary-600 dark:text-gray-300 text-sm">
            Payez en espèces directement au livreur
          </p>
        </div>

        <div className="card-modern text-center p-6">
          <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Couverture Nationale</h3>
          <p className="text-primary-600 dark:text-gray-300 text-sm">
            Livraison dans les 48 wilayas d'Algérie
          </p>
        </div>
      </div>
    </div>
  );
};

export default CODHeader;
