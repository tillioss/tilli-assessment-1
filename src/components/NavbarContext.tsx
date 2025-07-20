"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface NavbarContextType {
  showBackButton: boolean;
  backHref: string;
  backLabel: string;
  setBackButton: (href: string, label: string) => void;
  hideBackButton: () => void;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [showBackButton, setShowBackButton] = useState(false);
  const [backHref, setBackHref] = useState("");
  const [backLabel, setBackLabel] = useState("");

  const setBackButton = (href: string, label: string) => {
    setBackHref(href);
    setBackLabel(label);
    setShowBackButton(true);
  };

  const hideBackButton = () => {
    setShowBackButton(false);
  };

  return (
    <NavbarContext.Provider
      value={{
        showBackButton,
        backHref,
        backLabel,
        setBackButton,
        hideBackButton,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error("useNavbar must be used within NavbarProvider");
  }
  return context;
}
