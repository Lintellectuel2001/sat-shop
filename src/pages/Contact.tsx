import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Mail, Phone, MapPin } from "lucide-react";

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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;