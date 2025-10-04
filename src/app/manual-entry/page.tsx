"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Edit, Star } from "lucide-react";
import { Student, AssessmentRecord } from "@/types";
import StarRating from "@/components/StarRating";
import { useNavbar } from "@/components/NavbarContext";
import { createAssessment, getAssessments } from "@/lib/appwrite";
import EditAssessmentModal from "@/components/EditAssessmentModal";
import { useTranslation } from "react-i18next";
import { useRubricData } from "@/lib/useRubricData";

const skillQuestionMap = {
  self_awareness: ["q1Answer", "q2Answer"],
  social_management: ["q8Answer", "q9Answer"],
  social_awareness: ["q5Answer", "q6Answer"],
  relationship_skills: ["q7Answer"],
  responsible_decision_making: ["q9Answer"],
  metacognition: ["q4Answer", "q10Answer", "q11Answer"],
  empathy: ["q6Answer", "q5Answer", "q7Answer"],
  critical_thinking: ["q3Answer", "q4Answer", "q9Answer"],
};

// Function to calculate skill scores based on student answers
const calculateSkillScores = (student: Student) => {
  const skillScores: { [key: string]: number } = {};

  // Calculate score for each skill
  Object.entries(skillQuestionMap).forEach(([skill, questionFields]) => {
    let totalScore = 0;
    let answeredQuestions = 0;

    questionFields.forEach((questionField) => {
      const answer = student[questionField as keyof Student];
      if (answer && answer !== "") {
        const score = parseInt(answer) + 1;
        if (!isNaN(score)) {
          totalScore += score;
          answeredQuestions++;
        }
      }
    });

    skillScores[skill] =
      answeredQuestions > 0 ? totalScore / questionFields.length : 0;
  });

  return skillScores;
};

function ManualEntryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testType = searchParams.get("testType") || "PRE";
  const { setBackButton, hideBackButton } = useNavbar();
  const { t } = useTranslation();
  const rubricData = useRubricData();

  const [students, setStudents] = useState<Student[]>([
    {
      emoji: "👤",
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
  const [savedAssessments, setSavedAssessments] = useState<AssessmentRecord[]>(
    []
  );
  const [isLoadingAssessments, setIsLoadingAssessments] = useState(true);
  const [editingAssessment, setEditingAssessment] =
    useState<AssessmentRecord | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    setBackButton("/dashboard", t("common.back"));
    return () => hideBackButton();
  }, [setBackButton, hideBackButton]);

  useEffect(() => {
    setCurrentUser(localStorage.getItem("sessionId") ?? null);

    const loadUserAndAssessments = async () => {
      try {
        if (!currentUser) {
          return;
        }

        const assessments = await getAssessments(currentUser);
        setSavedAssessments(assessments);
      } catch (error) {
        console.error("Error loading user and assessments:", error);
      } finally {
        setIsLoadingAssessments(false);
      }
    };

    loadUserAndAssessments();
  }, [router, currentUser]);

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
    if (isStudentFullyGraded(student)) {
      return "border-green-200 bg-green-50";
    }
    return "border-yellow-200 bg-yellow-50";
  };

  const getStudentStatusText = (student: Student) => {
    if (isStudentFullyGraded(student)) {
      return "✓ Fully graded";
    }
    return "⚠ Incomplete";
  };

  const getStudentStatusColor = (student: Student) => {
    if (isStudentFullyGraded(student)) {
      return "text-green-600";
    }
    return "text-yellow-600";
  };

  const openEditModal = (assessment: AssessmentRecord) => {
    setEditingAssessment(assessment);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingAssessment(null);
    setIsEditModalOpen(false);
  };

  const handleAssessmentUpdate = (updatedAssessment: AssessmentRecord) => {
    setSavedAssessments((prev) =>
      prev.map((assessment) =>
        assessment.$id === updatedAssessment.$id
          ? updatedAssessment
          : assessment
      )
    );
  };

  const resetForm = () => {
    setStudents([
      {
        emoji: "👤",
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
    const hasIncompleteGrading = students.some(
      (student) => !isStudentFullyGraded(student)
    );
    if (hasIncompleteGrading) {
      alert(t("manualEntry.completeGrading"));
      return;
    }

    setIsSubmitting(true);

    try {
      const savedAssessments: AssessmentRecord[] = [];

      for (const student of students) {
        // Calculate skill scores for this student
        const skillScores = calculateSkillScores(student);

        // Calculate individual question scores
        const questionScores = [
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
        ].map((answer) => (answer ? parseInt(answer) : 0));

        const overallScore =
          Object.values(skillScores).reduce((acc, score) => acc + score, 0) /
          Object.keys(skillScores).length;

        const assessmentData: AssessmentRecord = {
          teacherId: currentUser || "",
          scores: JSON.stringify(questionScores),
          overallScore: overallScore,
          skillScores: JSON.stringify(skillScores),
          answers: JSON.stringify([
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
          testType,
          isManualEntry: true,
        };

        const savedAssessment = await createAssessment(assessmentData);
        const assessmentWithId = {
          ...assessmentData,
          $id: savedAssessment.$id,
        };
        savedAssessments.push(assessmentWithId);
      }

      setSavedAssessments((prev) => [...savedAssessments, ...prev]);

      // resetForm();

      window.scrollTo({ top: 0, behavior: "smooth" });

      console.log("Assessments saved:", savedAssessments);
    } catch (error) {
      console.error("Error creating assessment:", error);
      alert(t("manualEntry.errorCreatingAssessment"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayStudents = savedAssessments
    .map((assessment) => {
      try {
        const answers = JSON.parse(assessment.answers);
        return {
          $id: assessment.$id,
          emoji: "👤",
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
      } catch (error) {
        console.error("Error parsing assessment data:", error);
        return null;
      }
    })
    .filter(Boolean) as (Student & {
    $id?: string;
  })[];

  return (
    <div className="min-h-screen bg-[#E1ECFF]">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Saved Assessments View */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              {t("manualEntry.savedAssessments")} ({displayStudents.length})
            </h2>
          </div>

          {/* Student Assessments */}
          <div>
            {isLoadingAssessments ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-[#4F86E2] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">
                  {t("manualEntry.loadingAssessments")}
                </p>
              </div>
            ) : displayStudents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayStudents.map((student, studentIndex) => {
                  return (
                    <div
                      key={studentIndex}
                      className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${getStudentCardColor(
                        student
                      )}`}
                    >
                      {/* Student Card Header */}
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl">{student.emoji}</span>
                            <div>
                              <h5 className="font-medium text-gray-900 text-xs">
                                Student {studentIndex + 1}
                              </h5>
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
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const assessment = savedAssessments.find(
                                  (a) =>
                                    a.$id === displayStudents[studentIndex].$id
                                );
                                if (assessment) {
                                  openEditModal(assessment);
                                } else {
                                  console.error(
                                    "Assessment not found for student:",
                                    displayStudents[studentIndex]
                                  );
                                }
                              }}
                              className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                              title={t("manualEntry.editAssessment")}
                            >
                              <Edit size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-600">
                  {t("manualEntry.noSavedAssessments")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Star Rating Legend */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm p-6 mb-6 sm:mb-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              {t("manualEntry.understandingStarRatings")}
              <Star className="w-5 h-5 text-yellow-500 ml-2" />
            </h3>
            <p className="text-sm text-gray-600">
              {t("manualEntry.useStarRatings")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(rubricData.ratingLevels).map(
              ([rating, description]) => (
                <div
                  key={rating}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-center mb-3">
                    <div className="flex space-x-1">
                      {Array.from({ length: 4 }, (_, index) => (
                        <Star
                          key={index}
                          size={24}
                          className={`${
                            index < parseInt(rating) + 1
                              ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      {`${parseInt(rating) + 1} Star`}
                    </div>
                    <div className="text-sm font-medium text-gray-900 leading-tight">
                      {description}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Students Assessment Form */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              {t("manualEntry.addNewStudentAssessment")}
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
                    {t("manualEntry.remove")}
                  </button>
                )}
              </div>

              {/* Assessment Criteria */}
              <div className="space-y-4 sm:space-y-6">
                {rubricData.skillCategories.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
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
                              <p className="text-md font-medium text-gray-900 mb-1">
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
                                showLabel={true}
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
                <span>{t("manualEntry.savingAssessment")}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {t("manualEntry.saveStudentReport")}
              </div>
            )}
          </button>
        </div>

        {/* Edit Assessment Modal */}
        <EditAssessmentModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          assessment={editingAssessment}
          onSave={handleAssessmentUpdate}
          teacherId={currentUser || ""}
        />
      </main>
    </div>
  );
}

export default function ManualEntryPage() {
  return <ManualEntryContent />;
}
