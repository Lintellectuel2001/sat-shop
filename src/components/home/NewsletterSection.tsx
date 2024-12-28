import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

const NewsletterSection = () => {
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
          <div className="flex gap-3 max-w-md">
            <Input 
              placeholder="Entrez votre email" 
              className="flex-1 h-12 rounded-full border-subtle focus:border-accent"
            />
            <Button className="bg-accent hover:bg-accent/90 rounded-full h-12 px-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
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