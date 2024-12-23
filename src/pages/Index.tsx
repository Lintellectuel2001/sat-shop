import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Index = () => {
  const navigate = useNavigate();

  const slides = [
    {
      title: "Service IPTV Premium",
      description: "Accédez à des milliers de chaînes en direct",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
      color: "from-purple-500",
    },
    {
      title: "Sharing Premium",
      description: "Partagez vos accès en toute sécurité",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
      color: "from-blue-500",
    },
    {
      title: "VOD Illimitée",
      description: "Des milliers de films et séries à la demande",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      color: "from-pink-500",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Carousel Section */}
      <section className="w-full py-12 bg-white">
        <div className="container mx-auto px-4">
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {slides.map((slide, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-[400px] w-full overflow-hidden rounded-xl">
                    <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} to-transparent opacity-60`} />
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 p-8 text-white">
                      <h3 className="text-2xl font-bold mb-2">{slide.title}</h3>
                      <p className="text-lg">{slide.description}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </section>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-white">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 animate-fade-up">
            <p className="text-accent text-lg mb-4">
              Découvrez nos services premium 🌟
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8 text-primary">
              Services IPTV, Sharing et VOD de qualité
            </h1>
            <button 
              onClick={() => navigate('/marketplace')}
              className="bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              Découvrir nos offres
              <span className="inline-block">→</span>
            </button>
          </div>
          <div className="lg:w-1/2 mt-8 lg:mt-0 relative">
            <div className="absolute -z-10 top-0 right-0 w-64 h-64 bg-[#ffd700] rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute -z-10 bottom-0 right-20 w-48 h-48 bg-[#ff69b4] rounded-full opacity-30 blur-3xl"></div>
            <img
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
              alt="Hero"
              className="rounded-2xl shadow-lg relative z-10"
            />
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 px-4">Nos Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            <ProductCard
              name="IPTV Premium"
              price="29.99€"
              image="https://images.unsplash.com/photo-1483058712412-4245e9b90334"
              rating={5}
              reviews={12}
            />
            <ProductCard
              name="Sharing Access"
              price="19.99€"
              image="https://images.unsplash.com/photo-1434494878577-86c23bcb06b9"
              rating={4}
              reviews={8}
            />
            <ProductCard
              name="VOD Service"
              price="24.99€"
              image="https://images.unsplash.com/photo-1485827404703-89b55fcc595e"
              rating={5}
              reviews={15}
            />
            <ProductCard
              name="Pack Complet"
              price="59.99€"
              image="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
              rating={4}
              reviews={10}
            />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-[#F8F8F8]">
        <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-4xl font-bold">Ne manquez pas nos offres spéciales</h2>
            <p className="text-accent">Inscrivez-vous pour recevoir nos dernières offres, nouveautés et codes de réduction...</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm">01</span>
                <span>Offres exclusives</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">02</span>
                <span>Support premium</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-sm">03</span>
                <span>Contenu exclusif</span>
              </div>
            </div>

            <div className="flex gap-2 max-w-md">
              <Input placeholder="Entrez votre email" className="flex-1" />
              <Button className="bg-primary">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1595665593673-bf1ad72905c0?q=80&w=1000&auto=format&fit=crop"
              alt="Newsletter"
              className="rounded-lg object-cover w-full h-[400px]"
            />
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="bg-purple-50 w-20 h-20 mx-auto rounded-lg flex items-center justify-center">
                <ChevronDown className="w-10 h-10 text-purple-600" />
              </div>
              <p className="text-sm text-purple-600">Étape 1</p>
              <h3 className="font-semibold text-lg">Choisissez votre service</h3>
              <p className="text-accent text-sm">Sélectionnez le service qui vous convient</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="bg-blue-50 w-20 h-20 mx-auto rounded-lg flex items-center justify-center">
                <Plus className="w-10 h-10 text-blue-600" />
              </div>
              <p className="text-sm text-blue-600">Étape 2</p>
              <h3 className="font-semibold text-lg">Procédez au paiement</h3>
              <p className="text-accent text-sm">Paiement sécurisé et rapide</p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-yellow-50 w-20 h-20 mx-auto rounded-lg flex items-center justify-center">
                <ChevronUp className="w-10 h-10 text-yellow-600" />
              </div>
              <p className="text-sm text-yellow-600">Étape 3</p>
              <h3 className="font-semibold text-lg">Activation rapide</h3>
              <p className="text-accent text-sm">Accès immédiat après confirmation</p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-pink-50 w-20 h-20 mx-auto rounded-lg flex items-center justify-center">
                <Check className="w-10 h-10 text-pink-600" />
              </div>
              <p className="text-sm text-pink-600">Étape 4</p>
              <h3 className="font-semibold text-lg">Profitez du service</h3>
              <p className="text-accent text-sm">Support technique 24/7</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;