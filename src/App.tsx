import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import ProductDetails from "./pages/ProductDetails";
import Marketplace from "./pages/Marketplace";
import Cart from "./pages/Cart";
import LoginPanel from "./components/auth/LoginPanel";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<LoginPanel />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;