
import React, { useState } from "react";
import { UserCog } from "lucide-react";
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

const AdminAccessButton = () => {
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
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <UserCog className="h-5 w-5" />
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
  );
};

export default AdminAccessButton;
