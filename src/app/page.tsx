"use client";

import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import ConsentView from "@/components/ConsentView";

// Force dynamic rendering to avoid build-time auth context issues
export const dynamic = "force-dynamic";

export default function HomePage() {
  const [consentGiven, setConsentGiven] = useState(false);

  const handleConsentGiven = () => {
    setConsentGiven(true);
  };

  if (!consentGiven) {
    return <ConsentView onConsentGiven={handleConsentGiven} />;
  }

  return (
    <div className="min-h-screen bg-[#E1ECFF] flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
