import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { NavbarProvider } from "@/components/NavbarContext";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import I18nProvider from "@/components/I18nProvider";

export const metadata: Metadata = {
  title: "Tilli Assessment App",
  description:
    "Teacher assessment rubric scanning and manual entry application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/icons/favicon.ico" />
        <link
          rel="apple-touch-icon"
          href="/images/icons/apple-touch-icon.png"
        />
        <meta name="theme-color" content="#4F86E2" />
      </head>
      <body className="font-sans">
        <I18nProvider>
          <AuthProvider>
            <NavbarProvider>
              <ConditionalNavbar />
              <div className="min-h-screen bg-gray-50">{children}</div>
            </NavbarProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
