"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";

interface I18nProviderProps {
  children: React.ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsClient(true);
    // Ensure i18n is initialized
    if (!i18n.isInitialized) {
      i18n.init();
    }
  }, []);

  // Handle language query parameter globally
  useEffect(() => {
    const langParam = searchParams.get("lang");
    if (langParam && (langParam === "en" || langParam === "ar")) {
      i18n.changeLanguage(langParam);
    }
  }, [searchParams]);

  if (!isClient) {
    return <>{children}</>;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
