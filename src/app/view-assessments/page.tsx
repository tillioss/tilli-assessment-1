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
              <div
                key={assessment.$id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {/* Assessment Header */}
                <div className="bg-[#82a4de] text-white p-4 sm:p-6">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold mb-2">
                      Assessment by {assessment.teacherName}
                    </h2>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-blue-100 text-sm sm:text-base">
                      <div className="flex items-center space-x-2">
                        <School size={14} className="sm:w-4 sm:h-4" />
                        <span>{assessment.school}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <GraduationCap size={14} className="sm:w-4 sm:h-4" />
                        <span>{assessment.grade}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} className="sm:w-4 sm:h-4" />
                        <span>{formatDate(assessment.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Students Grid */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
                    Students ({assessment.students.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {assessment.students.map((student, index) => {
                      const studentId = `${assessment.$id}-${index}`;
                      const isExpanded = expandedStudents.has(studentId);

                      return (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => toggleStudentExpansion(studentId)}
                        >
                          {/* Student Card Header */}
                          <div className="p-3 sm:p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-xl">{student.emoji}</span>
                                <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                                  {student.studentName}
                                </h4>
                              </div>
                              <div className="flex items-center space-x-2">
                                {isExpanded ? (
                                  <ChevronUp
                                    size={16}
                                    className="text-gray-400"
                                  />
                                ) : (
                                  <ChevronDown
                                    size={16}
                                    className="text-gray-400"
                                  />
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500">
                              Click to view detailed answers
                            </p>
                          </div>

                          {/* Expanded Details */}
                          {isExpanded && (
                            <div className="border-t border-gray-100 p-3 sm:p-4 bg-gray-50">
                              <div className="space-y-2">
                                <div className="text-xs sm:text-sm">
                                  <span className="text-gray-600">
                                    Q1 (Self Awareness):
                                  </span>
                                  <span
                                    className={`ml-1 sm:ml-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getRatingColor(
                                      student.q1Answer
                                    )}`}
                                  >
                                    {getRatingDescription(student.q1Answer)}
                                  </span>
                                </div>
                                <div className="text-xs sm:text-sm">
                                  <span className="text-gray-600">
                                    Q2 (Self Awareness):
                                  </span>
                                  <span
                                    className={`ml-1 sm:ml-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getRatingColor(
                                      student.q2Answer
                                    )}`}
                                  >
                                    {getRatingDescription(student.q2Answer)}
                                  </span>
                                </div>
                                <div className="text-xs sm:text-sm">
                                  <span className="text-gray-600">
                                    Q3 (Self Awareness):
                                  </span>
                                  <span
                                    className={`ml-1 sm:ml-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getRatingColor(
                                      student.q3Answer
                                    )}`}
                                  >
                                    {getRatingDescription(student.q3Answer)}
                                  </span>
                                </div>
                                <div className="text-xs sm:text-sm">
                                  <span className="text-gray-600">
                                    Q4 (Self Management):
                                  </span>
                                  <span
                                    className={`ml-1 sm:ml-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getRatingColor(
                                      student.q4Answer
                                    )}`}
                                  >
                                    {getRatingDescription(student.q4Answer)}
                                  </span>
                                </div>
                                <div className="text-xs sm:text-sm">
                                  <span className="text-gray-600">
                                    Q5 (Self Management):
                                  </span>
                                  <span
                                    className={`ml-1 sm:ml-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getRatingColor(
                                      student.q5Answer
                                    )}`}
                                  >
                                    {getRatingDescription(student.q5Answer)}
                                  </span>
                                </div>
                                <div className="text-xs sm:text-sm">
                                  <span className="text-gray-600">
                                    Q6 (Self Management):
                                  </span>
                                  <span
                                    className={`ml-1 sm:ml-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getRatingColor(
                                      student.q6Answer
                                    )}`}
                                  >
                                    {getRatingDescription(student.q6Answer)}
                                  </span>
                                </div>
                                <div className="text-xs sm:text-sm">
                                  <span className="text-gray-600">
                                    Q7 (Self Management):
                                  </span>
                                  <span
                                    className={`ml-1 sm:ml-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getRatingColor(
                                      student.q7Answer
                                    )}`}
                                  >
                                    {getRatingDescription(student.q7Answer)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
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
