"use client";

import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import {
  Upload,
  FileText,
  Users,
  LogOut,
  Sparkles,
  Camera,
  Zap,
} from "lucide-react";
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

        <div className="max-w-6xl mx-auto">
          {/* Recommended AI Scan Option */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                <Sparkles className="w-3 h-3 mr-1" />
                RECOMMENDED
              </div>
            </div>

            <Link href="/upload-photos">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-blue-200 hover:border-blue-300 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100 rounded-full translate-y-12 -translate-x-12 opacity-20"></div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-[#4F86E2] w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center">
                        <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                          AI Photo Scan
                        </h3>
                        <p className="text-sm text-green-600 font-medium">
                          Fast & Accurate
                        </p>
                      </div>
                    </div>
                    <Zap className="w-6 h-6 text-yellow-500" />
                  </div>

                  <p className="text-sm sm:text-base text-gray-700 mb-4">
                    Simply take photos of your rubric sheets and let AI
                    automatically extract all student data. Saves time and
                    reduces manual errors.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>1-2 minutes processing</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>99% accuracy rate</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>No manual typing</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-[#4F86E2] font-medium">
                      Start AI Scan →
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Manual Entry Option */}
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-gray-200">
            <Link href="/manual-entry">
              <div className="text-center">
                <div className="bg-gray-500 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Manual Entry
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Enter student assessment data manually using the rubric form
                </p>
                <div className="text-xs sm:text-sm text-gray-500 font-medium">
                  Fill form manually →
                </div>
              </div>
            </Link>
          </div>
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
