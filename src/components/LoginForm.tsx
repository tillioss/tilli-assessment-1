"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useAuth } from "./AuthProvider";
import Image from "next/image";

export default function LoginForm() {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login();
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to login. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md">
      {/* Mascot above title */}
      <div className="flex justify-center mb-4">
        <Image
          src="/images/mascot/tilli.png"
          alt="Tilli Mascot"
          width={80}
          height={80}
          className="rounded-full"
          priority
        />
      </div>
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Tilli Assessment
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Teacher Assessment Rubric System
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 bg-[#4F86E2] text-white py-3 px-4 rounded-full hover:bg-[#3d6bc7] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
        >
          {isLoading ? (
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span>Get Started</span>
              <ArrowRight size={18} className="sm:w-5 sm:h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs sm:text-sm text-gray-500">
          Click "Get Started" to begin using the assessment system
        </p>
      </div>
    </div>
  );
}
