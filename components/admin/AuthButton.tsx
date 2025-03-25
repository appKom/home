"use client";

import { signIn, signOut } from "next-auth/react";
import { Button } from "../Button";

interface Props {
  type: "login" | "logout";
}

const AuthButton = ({ type }: Props) => {
  const handleLogin = () =>
    signIn("github", {
      callbackUrl: "/admin",
    });

  const handleLogout = () => signOut({ callbackUrl: "/" });

  return (
    <Button
      title={type === "login" ? "Logg inn med Github" : "Logg ut"}
      color="onlineOrange"
      onClick={type === "login" ? handleLogin : handleLogout}
    />
  );
};

export default AuthButton;
