import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, Home, RotateCcw } from 'lucide-react';

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-700">
            Paiement Échoué
          </CardTitle>
          <p className="text-muted-foreground">
            Votre paiement n'a pas pu être traité. Veuillez réessayer.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-red-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Que s'est-il passé?</h3>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Le paiement a été annulé</li>
              <li>• Informations de carte incorrectes</li>
              <li>• Fonds insuffisants</li>
              <li>• Problème technique temporaire</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Que faire maintenant?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Vérifiez vos informations de paiement</li>
              <li>• Assurez-vous d'avoir des fonds suffisants</li>
              <li>• Réessayez dans quelques minutes</li>
              <li>• Contactez votre banque si le problème persiste</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button 
              onClick={() => navigate('/marketplace')}
              className="w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Réessayer le paiement
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Besoin d'aide? Contactez notre support client
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFailure;