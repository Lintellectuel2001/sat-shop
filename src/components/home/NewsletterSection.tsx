import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

const NewsletterSection = () => {
  return (
    <section className="py-16 px-4 bg-[#F8F8F8]">
      <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row items-center gap-8">
        <div className="lg:w-1/2 space-y-6">
          <h2 className="text-4xl font-bold">Ne manquez pas nos offres spéciales</h2>
          <p className="text-accent">
            Inscrivez-vous pour recevoir nos dernières offres, nouveautés et codes de réduction...
          </p>
          <div className="flex gap-2 max-w-md">
            <Input placeholder="Entrez votre email" className="flex-1" />
            <Button className="bg-primary">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="lg:w-1/2">
          <img 
            src="/lovable-uploads/e3c1a7ee-dc3a-4a53-854e-683d7af9da46.png"
            alt="VOD Interface"
            className="rounded-lg object-cover w-full h-[400px]"
          />
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;