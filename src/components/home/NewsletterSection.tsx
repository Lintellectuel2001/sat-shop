import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez entrer votre email",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-order-notification', {
        body: {
          email: email,
          type: 'newsletter',
          adminEmail: 'mehalli.rabie@gmail.com'
        }
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Merci de votre inscription à notre newsletter!",
      });
      setEmail("");
    } catch (error) {
      console.error('Error sending newsletter notification:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-secondary to-white">
      <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 space-y-6">
          <h2 className="text-4xl font-bold leading-tight">
            Restez informé de nos <br />
            <span className="text-accent">offres spéciales</span>
          </h2>
          <p className="text-primary/80 text-lg leading-relaxed">
            Inscrivez-vous pour recevoir nos dernières offres, nouveautés 
            et codes de réduction en avant-première.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md">
            <Input 
              type="email"
              placeholder="Entrez votre email" 
              className="flex-1 h-12 rounded-full border-subtle focus:border-accent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <Button 
              type="submit"
              className="bg-accent hover:bg-accent/90 rounded-full h-12 px-6 shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isLoading}
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </form>
        </div>
        <div className="lg:w-1/2">
          <img 
            src="/lovable-uploads/4f809d8c-2ceb-427e-ab7b-cc701210868b.png"
            alt="Télécommande TV"
            className="rounded-2xl shadow-elegant object-cover w-full h-[400px]"
          />
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;