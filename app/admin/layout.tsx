import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import AuthButton from "@/components/admin/AuthButton";
import SessionWrapper from "@/components/admin/SessionWrapper";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-col items-center justify-center px-6 gap-5">
          <h1 className="text-3xl">Vennligst logg inn</h1>
          <AuthButton type="login" />
        </div>
      </div>
    );
  }

  if (!session.user.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-col items-center justify-center px-6 gap-5">
          <h1 className="text-3xl">Du har ikke tilgang til denne siden</h1>
          <h2 className="text-xl">{session.user.name}</h2>
          <AuthButton type="logout" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen items-center">
      <Toaster />
      {children}
    </div>
  );
};

const WrappedAdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <SessionWrapper>
      <AdminLayout>{children}</AdminLayout>
    </SessionWrapper>
  );
};

export default WrappedAdminLayout;
