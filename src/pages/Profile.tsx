import { ProfileManager } from "@/components/profile/ProfileManager";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-secondary">
      <Navbar />
      <div className="container mx-auto max-w-md pt-32 pb-16 px-4">
        <div className="bg-white rounded-2xl shadow-elegant p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Mon Profil</h1>
            <p className="text-primary/60">
              Gérez vos informations personnelles
            </p>
          </div>
          <ProfileManager />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;