"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Save, Star } from "lucide-react";
import Link from "next/link";
import { rubricData } from "@/lib/rubric-data";
import { Student, AssessmentRecord } from "@/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import StarRating from "@/components/StarRating";
import { getRandomEmoji } from "@/lib/emoji-assignment";
import { useNavbar } from "@/components/NavbarContext";

function ManualEntryContent() {
  const router = useRouter();
  const { setBackButton, hideBackButton } = useNavbar();

  useEffect(() => {
    setBackButton("/", "Back");
    return () => hideBackButton();
  }, [setBackButton, hideBackButton]);

  const [teacherInfo, setTeacherInfo] = useState({
    teacherName: "",
    school: "",
    grade: "",
  });
  const [students, setStudents] = useState<Student[]>([
    {
      studentName: "",
      emoji: getRandomEmoji(),
      q1Answer: "",
      q2Answer: "",
      q3Answer: "",
      q4Answer: "",
      q5Answer: "",
      q6Answer: "",
      q7Answer: "",
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addStudent = () => {
    setStudents((prev) => [
      ...prev,
      {
        studentName: "",
        emoji: getRandomEmoji(),
        q1Answer: "",
        q2Answer: "",
        q3Answer: "",
        q4Answer: "",
        q5Answer: "",
        q6Answer: "",
        q7Answer: "",
      },
    ]);
  };

  const removeStudent = (index: number) => {
    if (students.length > 1) {
      setStudents((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateStudent = (
    index: number,
    field: keyof Student,
    value: string
  ) => {
    setStudents((prev) =>
      prev.map((student, i) =>
        i === index ? { ...student, [field]: value } : student
      )
    );
  };

  const handleSubmit = async () => {
    if (!teacherInfo.teacherName || !teacherInfo.school || !teacherInfo.grade) {
      alert("Please fill in all teacher information");
      return;
    }

    const hasEmptyStudents = students.some((student) => !student.studentName);
    if (hasEmptyStudents) {
      alert("Please fill in all student names");
      return;
    }

    setIsSubmitting(true);

    try {
      const assessmentData: AssessmentRecord = {
        teacherName: teacherInfo.teacherName,
        school: teacherInfo.school,
        grade: teacherInfo.grade,
        date: new Date().toISOString().split("T")[0],
        students: students.filter(
          (student) => student.studentName.trim() !== ""
        ),
        isManualEntry: true,
      };

      // TODO: Save to Appwrite
      console.log("Assessment data:", assessmentData);

      // For now, just redirect to view assessments
      router.push("/view-assessments");
    } catch (error) {
      console.error("Error saving assessment:", error);
      alert("Error saving assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E1ECFF]">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Teacher Information */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
            Teacher Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                placeholder="Enter teacher name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School *
              </label>
              <input
                type="text"
                value={teacherInfo.school}
                onChange={(e) =>
                  setTeacherInfo((prev) => ({
                    ...prev,
                    school: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F86E2] text-sm sm:text-base text-gray-900 placeholder-gray-500"
                placeholder="Enter school name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade *
              </label>
              <input
                type="text"
                value={teacherInfo.grade}
                onChange={(e) =>
                  setTeacherInfo((prev) => ({ ...prev, grade: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F86E2] text-sm sm:text-base text-gray-900 placeholder-gray-500"
                placeholder="Enter grade"
                required
              />
            </div>
          </div>
        </div>

        {/* Rating Levels Info */}
        <div className="bg-[#E1ECFF] rounded-lg p-4 mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-medium text-[#4F86E2] mb-2">
            Rating Levels
          </h3>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {Object.entries(rubricData.ratingLevels).map(
              ([level, description]) => (
                <div key={level} className="text-center">
                  <div className="flex justify-center mb-1">
                    {Array.from({ length: parseInt(level) }, (_, index) => (
                      <Star
                        key={index}
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#4F86E2]">
                    {description}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Students Assessment */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Student Assessments
            </h2>
            <button
              onClick={addStudent}
              className="flex items-center space-x-1 sm:space-x-2 bg-[#4F86E2] text-white px-3 sm:px-4 py-2 rounded-full hover:bg-[#3d6bc7] transition-colors text-sm sm:text-base"
            >
              <Plus size={14} className="sm:w-4 sm:h-4" />
              <span>Add Student</span>
            </button>
          </div>

          {students.map((student, studentIndex) => (
            <div
              key={studentIndex}
              className="border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{student.emoji}</span>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">
                    Student {studentIndex + 1}
                  </h3>
                </div>
                {students.length > 1 && (
                  <button
                    onClick={() => removeStudent(studentIndex)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Student Name */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-xl mr-2">{student.emoji}</span>
                  Student Name *
                </label>
                <input
                  type="text"
                  value={student.studentName}
                  onChange={(e) =>
                    updateStudent(studentIndex, "studentName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F86E2] text-sm sm:text-base text-gray-900 placeholder-gray-500"
                  placeholder="Enter student name"
                  required
                />
              </div>

              {/* Assessment Criteria */}
              <div className="space-y-4 sm:space-y-6">
                {rubricData.skillCategories.map((category, categoryIndex) => (
                  <div
                    key={categoryIndex}
                    className="border-l-4 border-blue-200 pl-3 sm:pl-4"
                  >
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
                      {category.categoryName}
                    </h4>
                    <div className="space-y-3 sm:space-y-4">
                      {category.criteria.map((criterion, criterionIndex) => {
                        const questionNumber =
                          categoryIndex * category.criteria.length +
                          criterionIndex +
                          1;
                        const fieldName =
                          `q${questionNumber}Answer` as keyof Student;

                        return (
                          <div
                            key={criterion.id}
                            className="bg-gray-50 rounded-lg p-3 sm:p-4"
                          >
                            <div className="mb-2 sm:mb-3">
                              <p className="text-xs sm:text-sm font-medium text-gray-900 mb-1">
                                {criterion.text}
                              </p>
                              <p className="text-xs text-gray-600 italic">
                                {criterion.example}
                              </p>
                            </div>
                            <div className="mt-3">
                              <StarRating
                                value={student[fieldName]}
                                onChange={(value) =>
                                  updateStudent(studentIndex, fieldName, value)
                                }
                                maxRating={3}
                                ratingLevels={rubricData.ratingLevels}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#4F86E2] text-white px-6 sm:px-8 py-3 rounded-full hover:bg-[#3d6bc7] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Save size={18} className="sm:w-5 sm:h-5" />
                <span>Save Assessment</span>
              </div>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

export default function ManualEntryPage() {
  return (
    <ProtectedRoute>
      <ManualEntryContent />
    </ProtectedRoute>
  );
}
