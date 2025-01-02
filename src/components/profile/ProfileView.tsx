import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ProfileData {
  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  subscription_status: string | null;
  subscription_type: string | null;
}

interface ProfileViewProps {
  profile: ProfileData;
  onEdit: () => void;
}

export function ProfileView({ profile, onEdit }: ProfileViewProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-sm">Nom complet</h3>
        <p className="text-gray-600">{profile.full_name}</p>
      </div>
      <div>
        <h3 className="font-medium text-sm">Email</h3>
        <p className="text-gray-600">{profile.email}</p>
      </div>
      {profile.phone && (
        <div>
          <h3 className="font-medium text-sm">Téléphone</h3>
          <p className="text-gray-600">{profile.phone}</p>
        </div>
      )}
      {profile.address && (
        <div>
          <h3 className="font-medium text-sm">Adresse</h3>
          <p className="text-gray-600">{profile.address}</p>
        </div>
      )}
      
      <div className="border-t pt-4 mt-4">
        <h3 className="font-medium text-lg mb-3">Informations d'abonnement</h3>
        {profile.subscription_type ? (
          <>
            <div>
              <h4 className="font-medium text-sm">Type d'abonnement</h4>
              <p className="text-gray-600">{profile.subscription_type}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm">Statut</h4>
              <p className="text-gray-600">{profile.subscription_status}</p>
            </div>
            {profile.subscription_start_date && (
              <div>
                <h4 className="font-medium text-sm">Date de début</h4>
                <p className="text-gray-600">
                  {format(new Date(profile.subscription_start_date), 'PPP', { locale: fr })}
                </p>
              </div>
            )}
            {profile.subscription_end_date && (
              <div>
                <h4 className="font-medium text-sm">Date de fin</h4>
                <p className="text-gray-600">
                  {format(new Date(profile.subscription_end_date), 'PPP', { locale: fr })}
                </p>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 italic">Aucun abonnement actif</p>
        )}
      </div>

      <Button 
        className="w-full mt-4"
        onClick={onEdit}
      >
        Modifier le profil
      </Button>
    </div>
  );
}