import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useLoginHandler } from "@/hooks/useLoginHandler";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { handleLogin, loading } = useLoginHandler();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(email, password);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
          disabled={loading}
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
          disabled={loading}
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 text-sm">
          <input 
            type="checkbox" 
            className="rounded border-gray-300"
            disabled={loading}
          />
          <span className="text-primary/80">Se souvenir de moi</span>
        </label>
        <button
          type="button"
          className="text-sm text-accent hover:text-accent/80 transition-colors"
          disabled={loading}
        >
          Mot de passe oublié ?
        </button>
      </div>

      <Button
        type="submit"
        className="w-full bg-accent hover:bg-accent/90 text-white"
        disabled={loading}
      >
        {loading ? "Connexion en cours..." : "Se connecter"}
      </Button>

      <div className="text-center text-sm text-primary/60">
        Pas encore de compte ?{" "}
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="text-accent hover:text-accent/80 transition-colors"
          disabled={loading}
        >
          S'inscrire
        </button>
      </div>
    </form>
  );
};