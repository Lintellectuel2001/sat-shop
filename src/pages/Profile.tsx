import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ProfileManager } from "../components/profile/ProfileManager";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Profile = () => {
  const [accessCode, setAccessCode] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAccessCode = () => {
    if (accessCode === "852654") {
      setIsDialogOpen(false);
      navigate("/admin");
    } else {
      toast({
        variant: "destructive",
        title: "Code incorrect",
        description: "Veuillez vérifier votre code d'accès",
      });
    }
    setAccessCode("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="relative">
          <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-0 right-0 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Shield className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Accès Administrateur</DialogTitle>
                <DialogDescription>
                  Veuillez entrer le code d'accès pour continuer
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <Input
                  type="password"
                  placeholder="Code d'accès"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAccessCode();
                    }
                  }}
                />
                <Button onClick={handleAccessCode}>
                  Accéder
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <ProfileManager />
      </div>
      <Footer />
    </div>
  );
};

export default Profile;