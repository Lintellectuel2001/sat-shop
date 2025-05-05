
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatDate(dateString: string) {
  try {
    return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr });
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return dateString;
  }
}
