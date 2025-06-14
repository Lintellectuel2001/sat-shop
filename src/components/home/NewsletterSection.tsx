
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail, Gift } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { data: siteSettings } = useSiteSettings();

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
    <section className="section-spacing bg-gradient-to-br from-accent-50 via-white to-purple-50 relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-accent-200/20 to-purple-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-br from-pink-200/20 to-accent-200/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container-modern relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Contenu textuel */}
          <div className="lg:w-1/2 space-y-8 animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-semibold">
              <Gift className="w-4 h-4" />
              <span>Offres exclusives</span>
            </div>

            {/* Titre */}
            <div className="space-y-6">
              <h2 className="leading-tight">
                Restez informé de nos{" "}
                <span className="gradient-text">offres spéciales</span>
              </h2>
              
              <p className="text-xl text-primary-600 leading-relaxed">
                Inscrivez-vous pour recevoir nos dernières offres, nouveautés 
                et codes de réduction en avant-première directement dans votre boîte mail.
              </p>
            </div>

            {/* Formulaire d'inscription */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-400 w-5 h-5" />
                  <Input 
                    type="email"
                    placeholder="Entrez votre adresse email" 
                    className="input-modern pl-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit"
                  className="btn-modern whitespace-nowrap"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Inscription..."
                  ) : (
                    <>
                      S'inscrire
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
              
              <p className="text-sm text-primary-500">
                🎁 Recevez <strong>10% de réduction</strong> sur votre première commande
              </p>
            </form>

            {/* Avantages */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mx-auto">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="font-semibold text-primary-900">Offres ciblées</h4>
                <p className="text-sm text-primary-600">Selon vos préférences</p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mx-auto">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="font-semibold text-primary-900">En exclusivité</h4>
                <p className="text-sm text-primary-600">Avant tout le monde</p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mx-auto">
                  <span className="text-2xl">🚀</span>
                </div>
                <h4 className="font-semibold text-primary-900">Nouveautés</h4>
                <p className="text-sm text-primary-600">Les derniers services</p>
              </div>
            </div>
          </div>

          {/* Logo/Image */}
          <div className="lg:w-1/2 flex justify-center items-center animate-scale-in">
            <div className="relative">
              {/* Effet de glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent-400/20 to-purple-400/20 rounded-3xl blur-2xl transform -rotate-3"></div>
              
              <div className="relative bg-white p-12 rounded-3xl shadow-modern">
                <img 
                  src={siteSettings?.logo_url || "/lovable-uploads/d7990538-4e18-4b76-bb29-4e16e74bf512.png"}
                  alt={siteSettings?.logo_text || "Sat-shop"}
                  className="w-64 h-64 object-contain animate-float"
                />
              </div>
              
              {/* Badge décoratif */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-accent-500 to-purple-500 text-white p-4 rounded-2xl shadow-modern animate-bounce-gentle">
                <Mail className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
