"use client";

import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useNavbar } from "./NavbarContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const { showBackButton, backHref, backLabel } = useNavbar();
  const { t } = useTranslation();

  return (
    <header className="w-full bg-[#82A4DE] shadow-sm border-b flex items-center justify-between px-4 py-2 sm:px-6">
      <div className="flex items-center">
        {showBackButton && (
          <Link
            href={backHref}
            className="flex items-center text-white hover:text-white/80 mr-3"
          >
            <ArrowLeft size={22} />
            {backLabel && (
              <span className="ml-1 text-base font-medium">{backLabel}</span>
            )}
          </Link>
        )}
        <Image
          src="/images/logo/logo.png"
          alt={t("app.logoAlt")}
          width={40}
          height={20}
          priority
          className="h-6 w-auto object-contain"
        />
        <span className="ml-3 text-white font-semibold text-lg">
          {t("navbar.title")}
        </span>
      </div>
      <LanguageSwitcher />
    </header>
  );
}
