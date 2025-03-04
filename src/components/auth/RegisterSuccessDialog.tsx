
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RegisterSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: () => void;
}

const RegisterSuccessDialog: React.FC<RegisterSuccessDialogProps> = ({
  open,
  onOpenChange,
  onAction
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Inscription réussie !</AlertDialogTitle>
          <AlertDialogDescription>
            Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter avec vos identifiants.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onAction}>
            Aller à la page de connexion
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RegisterSuccessDialog;
