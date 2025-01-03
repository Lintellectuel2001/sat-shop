import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const LoginPanel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic with Supabase
    toast({
      title: "Connexion en cours de développement",
      description: "Cette fonctionnalité sera bientôt disponible.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-secondary pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-md">
        <div className="bg-white rounded-2xl shadow-elegant p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Connexion</h1>
            <p className="text-primary/60">
              Accédez à votre compte Sat-shop
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-primary">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-primary">
                Mot de passe
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-primary/80">Se souvenir de moi</span>
              </label>
              <button
                type="button"
                className="text-sm text-accent hover:text-accent/80 transition-colors"
              >
                Mot de passe oublié ?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-white"
            >
              Se connecter
            </Button>

            <div className="text-center text-sm text-primary/60">
              Pas encore de compte ?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-accent hover:text-accent/80 transition-colors"
              >
                S'inscrire
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPanel;