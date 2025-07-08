import AuthForm from "@/components/Auth/AuthForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <AuthForm />
      </div>
    </div>
  );
};

export default RegisterPage;
