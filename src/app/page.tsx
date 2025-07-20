"use client";

import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { Upload, FileText, Users, LogOut } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

// Force dynamic rendering to avoid build-time auth context issues
export const dynamic = "force-dynamic";

function Dashboard() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#E1ECFF]">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
            Assessment Dashboard
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Choose how you'd like to create student assessments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 max-w-4xl mx-auto">
          {/* Photo Upload Option */}
          <Link href="/upload-photos">
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-200">
              <div className="text-center">
                <div className="bg-[#4F86E2] w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Upload Photos
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Upload multiple photos of rubric sheets for automatic scanning
                </p>
                <div className="text-xs sm:text-sm text-[#4F86E2] font-medium">
                  Use AI scanning →
                </div>
              </div>
            </div>
          </Link>

          {/* Manual Entry Option */}
          <Link href="/manual-entry">
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-200">
              <div className="text-center">
                <div className="bg-[#4F86E2] w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Manual Entry
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Enter student assessment data manually using the rubric form
                </p>
                <div className="text-xs sm:text-sm text-[#4F86E2] font-medium">
                  Fill form manually →
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* View Assessments */}
        <div className="mt-8 sm:mt-12 text-center">
          <Link href="/view-assessments">
            <div className="inline-flex items-center space-x-2 bg-[#4F86E2] hover:bg-[#3d6bc7] px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-colors">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <span className="text-sm sm:text-base text-white font-medium">
                View All Assessments
              </span>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
