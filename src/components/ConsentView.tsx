"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";

interface ConsentViewProps {
  onConsentGiven?: () => void;
}

export default function ConsentView({ onConsentGiven }: ConsentViewProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const handleConsent = () => {
    if (onConsentGiven) {
      onConsentGiven();
    } else {
      router.push("/dashboard");
    }
  };

  // Helper function to render text with bold formatting
  const renderFormattedText = (text: string) => {
    return text.split("**").map((part, index) => {
      if (index % 2 === 1) {
        return (
          <strong key={index} className="font-semibold">
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with gradient background */}
      <div className="w-full bg-[#5996FF] py-3 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src="/images/logo/logo.png"
              alt={t("app.logoAlt")}
              width={40}
              height={40}
              className="rounded-lg"
            />
            <h1 className="text-white text-xl font-semibold">
              {t("navbar.title")}
            </h1>
          </div>
          {/* Language Switcher */}
          <div className="bg-white/20 rounded-lg shadow-md p-1">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <h2 className="text-3xl font-bold text-[#4F86E2] mb-8">
          {t("consent.title")}
        </h2>

        {/* Content paragraphs */}
        <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
          <p>{renderFormattedText(t("consent.intro"))}</p>

          <p>{renderFormattedText(t("consent.description"))}</p>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-[#4F86E2] mb-4">
              {t("consent.confidentiality")}
            </h3>
            <p>{renderFormattedText(t("consent.privacy"))}</p>
          </div>

          <p className="mt-6">{t("consent.conclusion")}</p>
        </div>

        {/* I Understand Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={handleConsent}
            className="bg-[#4F86E2] text-white px-6 py-3 rounded-xl font-semibold text-lg hover:bg-[#3d6bc7] shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            {t("consent.understand")}
          </button>
        </div>
      </div>
    </div>
  );
}
