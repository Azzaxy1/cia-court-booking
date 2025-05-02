import { LoginAdminForm } from "@/components/Admin/login/LoginAdminForm";
import React from "react";

const AdminLogin = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LoginAdminForm />
      </div>
    </div>
  );
};

export default AdminLogin;
