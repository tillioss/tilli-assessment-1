"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  Calendar,
  User,
  School,
  GraduationCap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AssessmentRecord, Student } from "@/types";
import { formatDate } from "@/lib/utils";
import ProtectedRoute from "@/components/ProtectedRoute";
import Image from "next/image";
import { useNavbar } from "@/components/NavbarContext";

function ViewAssessmentsContent() {
  const { setBackButton, hideBackButton } = useNavbar();
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [selectedAssessment, setSelectedAssessment] =
    useState<AssessmentRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedStudents, setExpandedStudents] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    setBackButton("/", "Back");
    return () => hideBackButton();
  }, [setBackButton, hideBackButton]);

  useEffect(() => {
    // TODO: Fetch assessments from Appwrite
    // For now, using mock data
    const mockAssessments: AssessmentRecord[] = [
      {
        $id: "1",
        teacherName: "Sarah Johnson",
        school: "Springfield Elementary",
        grade: "3rd Grade",
        date: "2024-01-15",
        students: [
          {
            studentName: "Emma Wilson",
            emoji: "🌸",
            q1Answer: "3",
            q2Answer: "2",
            q3Answer: "3",
            q4Answer: "2",
            q5Answer: "3",
            q6Answer: "2",
            q7Answer: "3",
          },
          {
            studentName: "Michael Chen",
            emoji: "⭐",
            q1Answer: "2",
            q2Answer: "3",
            q3Answer: "2",
            q4Answer: "3",
            q5Answer: "2",
            q6Answer: "3",
            q7Answer: "2",
          },
        ],
        isManualEntry: true,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
      },
      {
        $id: "2",
        teacherName: "David Rodriguez",
        school: "Lincoln Middle School",
        grade: "5th Grade",
        date: "2024-01-14",
        students: [
          {
            studentName: "Aisha Patel",
            emoji: "🌺",
            q1Answer: "3",
            q2Answer: "3",
            q3Answer: "3",
            q4Answer: "2",
            q5Answer: "3",
            q6Answer: "3",
            q7Answer: "2",
          },
        ],
        isManualEntry: false,
        createdAt: "2024-01-14T14:20:00Z",
        updatedAt: "2024-01-14T14:20:00Z",
      },
    ];

    setAssessments(mockAssessments);
    setIsLoading(false);
  }, []);

  const getRatingDescription = (rating: string) => {
    const ratingMap = {
      "1": "Beginner",
      "2": "Growing",
      "3": "Expert",
    };
    return ratingMap[rating as keyof typeof ratingMap] || "Not rated";
  };

  const getRatingColor = (rating: string) => {
    const colorMap = {
      "1": "bg-red-100 text-red-800",
      "2": "bg-yellow-100 text-yellow-800",
      "3": "bg-green-100 text-green-800",
    };
    return (
      colorMap[rating as keyof typeof colorMap] || "bg-gray-100 text-gray-800"
    );
  };

  const toggleStudentExpansion = (studentId: string) => {
    setExpandedStudents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E1ECFF]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {assessments.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 max-w-md mx-auto">
              {/* Mascot above empty state message */}
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
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                No Assessments Found
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                You haven't created any assessments yet. Start by uploading
                photos or entering data manually.
              </p>
              <div className="space-y-3 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                <Link href="/upload-photos">
                  <button className="w-full sm:w-auto bg-[#4F86E2] text-white px-4 py-2 rounded-full hover:bg-[#3d6bc7] transition-colors text-sm sm:text-base">
                    Upload Photos
                  </button>
                </Link>
                <Link href="/manual-entry">
                  <button className="w-full sm:w-auto bg-[#4F86E2] text-white px-4 py-2 rounded-full hover:bg-[#3d6bc7] transition-colors text-sm sm:text-base">
                    Manual Entry
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {assessments.map((assessment) => (
              <div key={assessment.$id}></div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function ViewAssessmentsPage() {
  return (
    <ProtectedRoute>
      <ViewAssessmentsContent />
    </ProtectedRoute>
  );
}
