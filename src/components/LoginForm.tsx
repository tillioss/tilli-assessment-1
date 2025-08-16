"use client";

import { useState } from "react";
import { ArrowRight, User } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { TeacherInfo } from "@/lib/auth";
import Image from "next/image";

const schoolOptions = ["Avalon Heights, Mumbai"];

const gradeOptions = ["Grade 1"];

const sectionOptions = ["A", "B", "C"];

export default function LoginForm() {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState("");
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo>({
    teacherName: "",
    school: schoolOptions[0],
    grade: gradeOptions[0],
    section: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate teacher information
    if (
      !teacherInfo.teacherName ||
      !teacherInfo.school ||
      !teacherInfo.grade ||
      !teacherInfo.section
    ) {
      setError("Please fill in all teacher information");
      return;
    }

    try {
      await login(teacherInfo);
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to login. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg">
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
          Hello teacher! 👋
        </h1>
      </div>

      <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Teacher Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Teacher Information
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teacher Name *
            </label>
            <input
              type="text"
              value={teacherInfo.teacherName}
              onChange={(e) =>
                setTeacherInfo((prev) => ({
                  ...prev,
                  teacherName: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F86E2] text-sm sm:text-base text-gray-900 placeholder-gray-500"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School *
            </label>
            <select
              value={teacherInfo.school}
              onChange={(e) =>
                setTeacherInfo((prev) => ({
                  ...prev,
                  school: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F86E2] text-sm sm:text-base text-gray-900 bg-white"
              required
            >
              <option value="">Select School</option>
              {schoolOptions.map((school) => (
                <option key={school} value={school}>
                  {school}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade *
              </label>
              <select
                value={teacherInfo.grade}
                onChange={(e) =>
                  setTeacherInfo((prev) => ({
                    ...prev,
                    grade: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F86E2] text-sm sm:text-base text-gray-900 bg-white"
                required
              >
                <option value="">Select Grade</option>
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section *
              </label>
              <select
                value={teacherInfo.section}
                onChange={(e) =>
                  setTeacherInfo((prev) => ({
                    ...prev,
                    section: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F86E2] text-sm sm:text-base text-gray-900 bg-white"
                required
              >
                <option value="">Select Section</option>
                {sectionOptions.map((section) => (
                  <option key={section} value={section}>
                    Section {section}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

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
          Enter your information to begin using the assessment system
        </p>
      </div>
    </div>
  );
}
