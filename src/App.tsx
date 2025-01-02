import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Contact from "@/pages/Contact";
import Marketplace from "@/pages/Marketplace";
import ProductDetails from "@/pages/ProductDetails";
import Profile from "@/pages/Profile";

import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-center" richColors />
    </Router>
  );
}

export default App;