import AuthForm from "@/components/Auth/AuthForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <AuthForm isLogin />
      </div>
    </div>
  );
};

export default LoginPage;
