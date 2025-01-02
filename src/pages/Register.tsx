import { Button } from "@/components/ui/button";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="container max-w-md mx-auto py-10">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Créer un compte</h1>
          <p className="text-gray-500">
            Remplissez le formulaire ci-dessous pour vous inscrire
          </p>
        </div>

        <RegisterForm />

        <div className="text-center text-sm">
          Déjà inscrit ?{" "}
          <Button
            variant="link"
            className="p-0 h-auto font-semibold"
            onClick={() => navigate("/login")}
          >
            Se connecter
          </Button>
        </div>
      </div>
    </div>
  );
}