
import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Mail, Phone, MapPin, CreditCard, Globe, MessageCircle } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-12">Contactez-nous</h1>
          
          <div className="space-y-8 bg-white p-8 rounded-lg shadow-sm">
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-[#ea384c] mt-1" />
              <div>
                <h2 className="font-semibold mb-1">Téléphone</h2>
                <a href="tel:+213669254864" className="text-accent hover:text-[#ea384c] transition-colors">
                  +213 669 254 864
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-[#ea384c] mt-1" />
              <div>
                <h2 className="font-semibold mb-1">Email</h2>
                <a href="mailto:mehalli.rabie@gmail.com" className="text-accent hover:text-[#ea384c] transition-colors">
                  mehalli.rabie@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-[#ea384c] mt-1" />
              <div>
                <h2 className="font-semibold mb-1">Adresse</h2>
                <p className="text-accent">
                  Yasmin 2, côté café Dubai<br />
                  Bir El Djir, Oran
                </p>
              </div>
            </div>

            <div className="border-t pt-8">
              <h2 className="text-xl font-bold mb-6">Options de Paiement</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CreditCard className="w-6 h-6 text-[#ea384c] mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Méthodes de Paiement</h3>
                    <ul className="space-y-2 text-accent">
                      <li>CCP : 5617859 clé 70 (mehalli rabie)</li>
                      <li>Baridi mob : 00799999000561785988</li>
                      <li>Paysera : mehalli.rabie@gmail.com</li>
                      <li>
                        <a href="https://taplink.cc/satshop" className="text-[#ea384c] hover:underline" target="_blank" rel="noopener noreferrer">
                          Paiement par CIB CARD ou EDAHABIA
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Globe className="w-6 h-6 text-[#ea384c] mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Liens Utiles</h3>
                    <ul className="space-y-2">
                      <li>
                        <a href="https://sat-shop.eu" className="text-[#ea384c] hover:underline" target="_blank" rel="noopener noreferrer">
                          Notre site web
                        </a>
                      </li>
                      <li>
                        <a href="https://m.facebook.com/SATSHOP31000/" className="text-[#ea384c] hover:underline" target="_blank" rel="noopener noreferrer">
                          Notre page Facebook
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MessageCircle className="w-6 h-6 text-[#ea384c] mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">WhatsApp</h3>
                    <a href="https://wa.me/213669254864" className="text-[#ea384c] hover:underline">
                      0669254864
                    </a>
                    <p className="text-sm text-accent mt-2">
                      Le code sera envoyé entre 10 à 30 minutes max
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <img 
              src="/lovable-uploads/22390200-5f55-4644-a2a3-1332ebd6642e.png" 
              alt="Sports fans watching game"
              className="w-full rounded-lg shadow-md"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
