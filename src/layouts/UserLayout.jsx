

import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const UserLayout = ({ children }) => {
  useEffect(() => {
    // Forzar modo claro al entrar al sector público
    document.body.classList.remove("dark-mode");
  }, []);

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default UserLayout;