
import { useNavigate } from "react-router-dom";
import { useRegister } from "@/hooks/useRegister";
import RegisterForm from "@/components/auth/RegisterForm";
import RegisterSuccessDialog from "@/components/auth/RegisterSuccessDialog";

const RegisterPanel = () => {
  const navigate = useNavigate();
  const {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    phone,
    setPhone,
    address,
    setAddress,
    loading,
    showSuccessDialog,
    setShowSuccessDialog,
    handleRegister
  } = useRegister();

  const handleSuccessDialogAction = () => {
    setShowSuccessDialog(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-secondary pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-md">
        <div className="bg-white rounded-2xl shadow-elegant p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Inscription</h1>
            <p className="text-primary/60">
              Créez votre compte Sat-shop
            </p>
          </div>

          <RegisterForm
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            phone={phone}
            setPhone={setPhone}
            address={address}
            setAddress={setAddress}
            loading={loading}
            onSubmit={handleRegister}
          />
        </div>
      </div>

      <RegisterSuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        onAction={handleSuccessDialogAction}
      />
    </div>
  );
};

export default RegisterPanel;
