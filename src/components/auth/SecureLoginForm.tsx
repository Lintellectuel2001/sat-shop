
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Shield } from "lucide-react";
import { useSecureAuth } from "@/hooks/useSecureAuth";

interface SecureLoginFormProps {
  onSuccess: (data: any) => void;
  onError: (error: string) => void;
  title?: string;
  description?: string;
}

const SecureLoginForm: React.FC<SecureLoginFormProps> = ({
  onSuccess,
  onError,
  title = "Connexion sécurisée",
  description = "Connectez-vous avec vos identifiants"
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { secureLogin, isLocked, getRemainingLockoutTime } = useSecureAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthLabel = (strength: number) => {
    switch (strength) {
      case 0:
      case 1: return { label: "Très faible", color: "text-red-500" };
      case 2: return { label: "Faible", color: "text-orange-500" };
      case 3: return { label: "Moyen", color: "text-yellow-500" };
      case 4: return { label: "Fort", color: "text-blue-500" };
      case 5: return { label: "Très fort", color: "text-green-500" };
      default: return { label: "Inconnu", color: "text-gray-500" };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      const remainingTime = getRemainingLockoutTime();
      onError(`Compte verrouillé. Réessayez dans ${remainingTime} minutes.`);
      return;
    }

    if (!validateEmail(email)) {
      onError("Format d'email invalide");
      return;
    }

    if (password.length < 8) {
      onError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setIsLoading(true);
    try {
      const result = await secureLogin(email, password);
      
      if (result.success && result.data) {
        onSuccess(result.data);
      } else {
        onError(result.error || "Erreur de connexion");
      }
    } catch (error: any) {
      onError(error.message || "Erreur inattendue");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthInfo = getPasswordStrengthLabel(passwordStrength);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Shield className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>

      {isLocked && (
        <Alert variant="destructive">
          <AlertDescription>
            Compte temporairement verrouillé suite à trop de tentatives échouées. 
            Temps restant: {getRemainingLockoutTime()} minutes.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          disabled={isLoading || isLocked}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre mot de passe"
            disabled={isLoading || isLocked}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading || isLocked}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {password && (
          <p className={`text-sm ${strengthInfo.color}`}>
            Force: {strengthInfo.label}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || isLocked || !email || !password || passwordStrength < 2}
      >
        {isLoading ? "Connexion..." : "Se connecter"}
      </Button>

      <div className="text-xs text-gray-500 mt-4">
        <p>• Minimum 8 caractères requis</p>
        <p>• Maximum 5 tentatives par période de 5 minutes</p>
        <p>• Verrouillage de 15 minutes après échecs répétés</p>
      </div>
    </form>
  );
};

export default SecureLoginForm;
