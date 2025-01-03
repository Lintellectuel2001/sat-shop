import { LoginForm } from "./LoginForm";

const LoginPanel = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-secondary pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-md">
        <div className="bg-white rounded-2xl shadow-elegant p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Connexion</h1>
            <p className="text-primary/60">
              Accédez à votre compte Sat-shop
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPanel;