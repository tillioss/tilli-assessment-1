"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Save,
  Eye,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Edit,
  X,
} from "lucide-react";
import { rubricData } from "@/lib/rubric-data";
import { Student, AssessmentRecord } from "@/types";
import StarRating from "@/components/StarRating";
import { getRandomEmoji } from "@/lib/emoji-assignment";
import { useNavbar } from "@/components/NavbarContext";
import { useAuth } from "@/components/AuthProvider";
import {
  createAssessment,
  getAssessments,
  updateAssessment,
} from "@/lib/appwrite";

function ManualEntryContent() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { setBackButton, hideBackButton } = useNavbar();

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
      q8Answer: "",
      q9Answer: "",
      q10Answer: "",
      q11Answer: "",
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedStudents, setExpandedStudents] = useState<Set<string>>(
    new Set()
  );
  const [savedAssessments, setSavedAssessments] = useState<AssessmentRecord[]>(
    []
  );
  const [isLoadingAssessments, setIsLoadingAssessments] = useState(true);
  const [editingAssessmentId, setEditingAssessmentId] = useState<string | null>(
    null
  );
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [inPlaceEditingId, setInPlaceEditingId] = useState<string | null>(null);

  useEffect(() => {
    setBackButton("/", "Back");
    return () => hideBackButton();
  }, [setBackButton, hideBackButton]);

  useEffect(() => {
    const loadAssessments = async () => {
      try {
        const assessments = await getAssessments(user?.$id || "");
        setSavedAssessments(assessments);
      } catch (error) {
        console.error("Error loading assessments:", error);
      } finally {
        setIsLoadingAssessments(false);
      }
    };

    if (isAuthenticated && !isLoading) {
      loadAssessments();
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#E1ECFF] flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="w-8 h-8 border-2 border-[#4F86E2] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

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

  const isStudentFullyGraded = (student: Student) => {
    const requiredFields = [
      "q1Answer",
      "q2Answer",
      "q3Answer",
      "q4Answer",
      "q5Answer",
      "q6Answer",
      "q7Answer",
      "q8Answer",
      "q9Answer",
      "q10Answer",
      "q11Answer",
    ];
    return requiredFields.every(
      (field) => student[field as keyof Student] !== ""
    );
  };

  const getStudentCardColor = (student: Student) => {
    if (!student.studentName.trim()) return "border-gray-200 bg-white";
    if (isStudentFullyGraded(student)) {
      return "border-green-200 bg-green-50";
    }
    return "border-yellow-200 bg-yellow-50";
  };

  const getStudentStatusText = (student: Student) => {
    if (!student.studentName.trim()) return "No name entered";
    if (isStudentFullyGraded(student)) {
      return "✓ Fully graded";
    }
    return "⚠ Incomplete";
  };

  const getStudentStatusColor = (student: Student) => {
    if (!student.studentName.trim()) return "text-gray-500";
    if (isStudentFullyGraded(student)) {
      return "text-green-600";
    }
    return "text-yellow-600";
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

  const startEditing = (assessment: AssessmentRecord) => {
    try {
      const answers = JSON.parse(assessment.assessment);
      const student: Student = {
        studentName: assessment.studentName,
        emoji: getRandomEmoji(),
        q1Answer: answers[0] || "",
        q2Answer: answers[1] || "",
        q3Answer: answers[2] || "",
        q4Answer: answers[3] || "",
        q5Answer: answers[4] || "",
        q6Answer: answers[5] || "",
        q7Answer: answers[6] || "",
        q8Answer: answers[7] || "",
        q9Answer: answers[8] || "",
        q10Answer: answers[9] || "",
        q11Answer: answers[10] || "",
      };
      setEditingStudent(student);
      setEditingAssessmentId(assessment.$id || null);
    } catch (error) {
      console.error("Error parsing assessment data for editing:", error);
    }
  };

  const cancelEditing = () => {
    setEditingStudent(null);
    setEditingAssessmentId(null);
  };

  const updateEditingStudent = (field: keyof Student, value: string) => {
    if (editingStudent) {
      setEditingStudent({ ...editingStudent, [field]: value });
    }
  };

  const saveEditedAssessment = async () => {
    if (!editingStudent || !editingAssessmentId || !user?.$id) {
      return;
    }

    setIsSubmitting(true);

    try {
      const assessmentData = {
        teacherId: user.$id,
        teacherName: user?.teacherInfo?.teacherName || "Teacher",
        school: user?.teacherInfo?.school || "School",
        grade: user?.teacherInfo?.grade || "Grade",
        section: user?.teacherInfo?.section || "Section",
        studentName: editingStudent.studentName,
        assessment: JSON.stringify([
          editingStudent.q1Answer,
          editingStudent.q2Answer,
          editingStudent.q3Answer,
          editingStudent.q4Answer,
          editingStudent.q5Answer,
          editingStudent.q6Answer,
          editingStudent.q7Answer,
          editingStudent.q8Answer,
          editingStudent.q9Answer,
          editingStudent.q10Answer,
          editingStudent.q11Answer,
        ]),
        isManualEntry: true,
      };

      await updateAssessment(editingAssessmentId, assessmentData);

      // Update local state
      setSavedAssessments((prev) =>
        prev.map((assessment) =>
          assessment.$id === editingAssessmentId
            ? { ...assessment, ...assessmentData }
            : assessment
        )
      );

      cancelEditing();
    } catch (error) {
      console.error("Error updating assessment:", error);
      alert("Error updating assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startInPlaceEditing = (assessmentId: string) => {
    setInPlaceEditingId(assessmentId);
  };

  const cancelInPlaceEditing = () => {
    setInPlaceEditingId(null);
  };

  const updateInPlaceAssessment = async (
    assessmentId: string,
    fieldName: string,
    value: string
  ) => {
    const assessment = savedAssessments.find((a) => a.$id === assessmentId);
    if (!assessment || !user?.$id) return;

    try {
      const answers = JSON.parse(assessment.assessment);

      if (fieldName === "studentName") {
        // Update student name
        const assessmentData = {
          teacherId: user.$id,
          teacherName: user?.teacherInfo?.teacherName || "Teacher",
          school: user?.teacherInfo?.school || "School",
          grade: user?.teacherInfo?.grade || "Grade",
          section: user?.teacherInfo?.section || "Section",
          studentName: value,
          assessment: assessment.assessment,
          isManualEntry: true,
        };

        await updateAssessment(assessmentId, assessmentData);

        // Update local state
        setSavedAssessments((prev) =>
          prev.map((a) =>
            a.$id === assessmentId ? { ...a, ...assessmentData } : a
          )
        );
      } else {
        // Update rating
        const questionNumber = parseInt(
          fieldName.replace("q", "").replace("Answer", "")
        );
        answers[questionNumber - 1] = value;

        const assessmentData = {
          teacherId: user.$id,
          teacherName: user?.teacherInfo?.teacherName || "Teacher",
          school: user?.teacherInfo?.school || "School",
          grade: user?.teacherInfo?.grade || "Grade",
          section: user?.teacherInfo?.section || "Section",
          studentName: assessment.studentName,
          assessment: JSON.stringify(answers),
          isManualEntry: true,
        };

        await updateAssessment(assessmentId, assessmentData);

        // Update local state
        setSavedAssessments((prev) =>
          prev.map((a) =>
            a.$id === assessmentId ? { ...a, ...assessmentData } : a
          )
        );
      }
    } catch (error) {
      console.error("Error updating assessment in place:", error);
      alert("Error updating assessment. Please try again.");
    }
  };

  const resetForm = () => {
    setStudents([
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
        q8Answer: "",
        q9Answer: "",
        q10Answer: "",
        q11Answer: "",
      },
    ]);
  };

  const handleAddStudent = async () => {
    if (!user?.$id) {
      alert("Please log in to save assessments");
      return;
    }

    const hasEmptyStudents = students.some((student) => !student.studentName);
    if (hasEmptyStudents) {
      alert("Please fill in all student names");
      return;
    }

    const hasIncompleteGrading = students.some(
      (student) => !isStudentFullyGraded(student)
    );
    if (hasIncompleteGrading) {
      alert("Please complete grading for all students");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save each student individually
      const savedAssessments: AssessmentRecord[] = [];

      for (const student of students) {
        if (student.studentName.trim() === "") continue;

        const assessmentData: AssessmentRecord = {
          teacherId: user.$id,
          teacherName: user?.teacherInfo?.teacherName || "Teacher",
          school: user?.teacherInfo?.school || "School",
          grade: user?.teacherInfo?.grade || "Grade",
          section: user?.teacherInfo?.section || "Section",
          studentName: student.studentName,
          assessment: JSON.stringify([
            student.q1Answer,
            student.q2Answer,
            student.q3Answer,
            student.q4Answer,
            student.q5Answer,
            student.q6Answer,
            student.q7Answer,
            student.q8Answer,
            student.q9Answer,
            student.q10Answer,
            student.q11Answer,
          ]),
          isManualEntry: true,
          createdAt: new Date().toISOString(),
        };

        // Save to database
        await createAssessment(assessmentData);
        savedAssessments.push(assessmentData);
      }

      // Add to local state
      setSavedAssessments((prev) => [...savedAssessments, ...prev]);

      // Reset form
      resetForm();

      console.log("Assessments saved:", savedAssessments);
    } catch (error) {
      console.error("Error creating assessment:", error);
      alert("Error creating assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayStudents = savedAssessments
    .map((assessment) => {
      try {
        const answers = JSON.parse(assessment.assessment);
        return {
          studentName: assessment.studentName,
          emoji: getRandomEmoji(),
          q1Answer: answers[0] || "",
          q2Answer: answers[1] || "",
          q3Answer: answers[2] || "",
          q4Answer: answers[3] || "",
          q5Answer: answers[4] || "",
          q6Answer: answers[5] || "",
          q7Answer: answers[6] || "",
          q8Answer: answers[7] || "",
          q9Answer: answers[8] || "",
          q10Answer: answers[9] || "",
          q11Answer: answers[10] || "",
          teacherName: assessment.teacherName,
          school: assessment.school,
          grade: assessment.grade,
        };
      } catch (error) {
        console.error("Error parsing assessment data:", error);
        return null;
      }
    })
    .filter(Boolean) as (Student & {
    teacherName: string;
    school: string;
    grade: string;
  })[];

  return (
    <div className="min-h-screen bg-[#E1ECFF]">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Saved Assessments View */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Saved Assessments ({displayStudents.length})
            </h2>
          </div>

          {/* Student Assessments */}
          <div>
            {isLoadingAssessments ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-[#4F86E2] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">
                  Loading assessments...
                </p>
              </div>
            ) : displayStudents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayStudents.map((student, studentIndex) => {
                  const studentId = `saved-student-${studentIndex}`;
                  const isExpanded = expandedStudents.has(studentId);

                  return (
                    <div
                      key={studentIndex}
                      className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${getStudentCardColor(
                        student
                      )}`}
                    >
                      {/* Student Card Header */}
                      <div
                        className="p-3"
                        onClick={() => toggleStudentExpansion(studentId)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">{student.emoji}</span>
                            <div>
                              {inPlaceEditingId ===
                              savedAssessments[studentIndex].$id ? (
                                <input
                                  type="text"
                                  value={student.studentName}
                                  onChange={(e) =>
                                    updateInPlaceAssessment(
                                      savedAssessments[studentIndex].$id || "",
                                      "studentName",
                                      e.target.value
                                    )
                                  }
                                  className="text-xs font-medium text-gray-900 bg-white border border-blue-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              ) : (
                                <h5 className="font-medium text-gray-900 text-xs">
                                  {student.studentName}
                                </h5>
                              )}
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${getStudentStatusColor(
                                  student
                                )} bg-opacity-10 ${
                                  isStudentFullyGraded(student)
                                    ? "bg-green-100"
                                    : "bg-yellow-100"
                                }`}
                              >
                                {getStudentStatusText(student)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {inPlaceEditingId ===
                            savedAssessments[studentIndex].$id ? (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    cancelInPlaceEditing();
                                  }}
                                  className="p-1 text-green-600 hover:text-green-800 transition-colors"
                                  title="Done editing"
                                >
                                  <CheckCircle size={14} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startInPlaceEditing(
                                      savedAssessments[studentIndex].$id || ""
                                    );
                                  }}
                                  className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                  title="Edit in place"
                                >
                                  <Edit size={14} />
                                </button>
                              </>
                            )}
                            {isExpanded ? (
                              <ChevronUp size={14} className="text-gray-400" />
                            ) : (
                              <ChevronDown
                                size={14}
                                className="text-gray-400"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 p-3 bg-gray-50">
                          <div className="space-y-3">
                            {rubricData.skillCategories.map(
                              (category, categoryIndex) => (
                                <div
                                  key={categoryIndex}
                                  className="border-l-4 border-blue-200 pl-2"
                                >
                                  <h6 className="text-xs font-semibold text-gray-900 mb-1">
                                    {category.categoryName}
                                  </h6>
                                  <div className="space-y-2">
                                    {category.criteria.map(
                                      (criterion, criterionIndex) => {
                                        const questionNumber =
                                          categoryIndex *
                                            category.criteria.length +
                                          criterionIndex +
                                          1;
                                        const fieldName =
                                          `q${questionNumber}Answer` as keyof Student;

                                        return (
                                          <div
                                            key={criterion.id}
                                            className="bg-gray-50 rounded p-2"
                                          >
                                            <div className="mb-1">
                                              <p className="text-xs font-medium text-gray-900">
                                                {criterion.text}
                                              </p>
                                            </div>
                                            <div className="mt-2">
                                              <StarRating
                                                value={student[fieldName] || ""}
                                                onChange={(value) =>
                                                  inPlaceEditingId ===
                                                  savedAssessments[studentIndex]
                                                    .$id
                                                    ? updateInPlaceAssessment(
                                                        savedAssessments[
                                                          studentIndex
                                                        ].$id || "",
                                                        fieldName,
                                                        value
                                                      )
                                                    : undefined
                                                }
                                                maxRating={4}
                                                ratingLevels={
                                                  rubricData.ratingLevels
                                                }
                                                showLabel={false}
                                                disabled={
                                                  inPlaceEditingId !==
                                                  savedAssessments[studentIndex]
                                                    .$id
                                                }
                                              />
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-600">
                  No saved assessments found. Add your first student below.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Edit Assessment Form */}
        {editingStudent && editingAssessmentId && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8 border-2 border-blue-200">
            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Edit Student Assessment
                </h2>
                <button
                  onClick={cancelEditing}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
              {/* Student Name */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-xl mr-2">{editingStudent.emoji}</span>
                  Student Name *
                </label>
                <input
                  type="text"
                  value={editingStudent.studentName}
                  onChange={(e) =>
                    updateEditingStudent("studentName", e.target.value)
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
                                value={editingStudent[fieldName]}
                                onChange={(value) =>
                                  updateEditingStudent(fieldName, value)
                                }
                                maxRating={4}
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

            {/* Save Edit Button */}
            <div className="text-center">
              <button
                onClick={saveEditedAssessment}
                disabled={isSubmitting}
                className="bg-[#4F86E2] text-white px-6 sm:px-8 py-3 rounded-full hover:bg-[#3d6bc7] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving Changes...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save size={18} className="sm:w-5 sm:h-5" />
                    <span>Save Changes</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Students Assessment Form */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Add New Student Assessment
            </h2>
          </div>

          {students.map((student, studentIndex) => (
            <div
              key={studentIndex}
              className="border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6"
            >
              <div className="flex justify-between items-center mb-4">
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
                                maxRating={4}
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

        {/* Add Student Button at Bottom */}
        <div className="text-center">
          <button
            onClick={handleAddStudent}
            disabled={isSubmitting}
            className="bg-[#4F86E2] text-white px-6 sm:px-8 py-3 rounded-full hover:bg-[#3d6bc7] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving Assessment...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Plus size={18} className="sm:w-5 sm:h-5" />
                <span>Save Student Assessment</span>
              </div>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

export default function ManualEntryPage() {
  return <ManualEntryContent />;
}
