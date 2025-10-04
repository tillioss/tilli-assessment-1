"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Sparkles, Camera, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

export const dynamic = "force-dynamic";

function Dashboard() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#E1ECFF]">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
            {t("dashboard.title")}
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            {t("dashboard.subtitle")}
          </p>

          <div className="mt-4 text-sm text-gray-500">
            {t("dashboard.welcomeMessage", {
              school: t("login.school"),
              grade: t("login.grade"),
            })}
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* AI Photo Scan Option */}
          <div className="mb-8">
            <Link href="/upload-photos">
              <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-gray-200 relative">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {t("common.recommended")}
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-[#4F86E2] w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    {t("dashboard.aiPhotoScan.title")}
                  </h3>
                  <p className="text-sm text-green-600 font-medium mb-2">
                    {t("common.fastAndAccurate")}
                  </p>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                    {t("dashboard.aiPhotoScan.description")}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>
                        {t("dashboard.aiPhotoScan.features.processingTime")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>
                        {t("dashboard.aiPhotoScan.features.accuracy")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>
                        {t("dashboard.aiPhotoScan.features.noTyping")}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 font-medium">
                    {t("dashboard.aiPhotoScan.cta")}
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Manual Entry Option */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-blue-200 hover:border-blue-300 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100 rounded-full translate-y-12 -translate-x-12 opacity-20"></div>

            <Link href="/manual-entry">
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-500 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                        {t("dashboard.manualEntry.title")}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">
                        {t("common.traditionalMethod")}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-gray-700 mb-4">
                  {t("dashboard.manualEntry.description")}
                </p>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-[#4F86E2] font-medium">
                    {t("dashboard.manualEntry.cta")}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return <Dashboard />;
}
