"use client";

import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { Student, AssessmentRecord } from "@/types";
import StarRating from "@/components/StarRating";
import { updateAssessment } from "@/lib/appwrite";
import { useRubricData } from "@/lib/useRubricData";
import { useTranslation } from "react-i18next";

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

interface EditAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: AssessmentRecord | null;
  onSave: (updatedAssessment: AssessmentRecord) => void;
  teacherId: string;
}

export default function EditAssessmentModal({
  isOpen,
  onClose,
  assessment,
  onSave,
  teacherId,
}: EditAssessmentModalProps) {
  const { t } = useTranslation();
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [originalStudent, setOriginalStudent] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const rubricData = useRubricData();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (assessment && isOpen && isMounted) {
      try {
        const answers = JSON.parse(assessment.answers);
        const student: Student = {
          emoji: "👤",
          studentName: assessment.studentName || "",
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
        setOriginalStudent(student);
      } catch (error) {
        console.error("Error parsing assessment data for editing:", error);
      }
    }
  }, [assessment, isOpen, isMounted]);

  const updateEditingStudent = (field: keyof Student, value: string) => {
    if (editingStudent) {
      setEditingStudent({ ...editingStudent, [field]: value });
    }
  };

  const handleSave = async () => {
    if (!editingStudent || !assessment || !teacherId) {
      return;
    }

    if (!assessment.$id) {
      alert("Error: Assessment ID is missing. Please try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const skillScores = calculateSkillScores(editingStudent);

      const questionScores = [
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
      ].map((answer) => (answer ? parseInt(answer) : 0));

      const overallScore =
        Object.values(skillScores).reduce((acc, score) => acc + score, 0) /
        Object.keys(skillScores).length;

      const assessmentData = {
        teacherId: teacherId,
        studentName: editingStudent.studentName || "",
        scores: JSON.stringify(questionScores),
        answers: JSON.stringify([
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
        overallScore: overallScore,
        skillScores: JSON.stringify(skillScores),
        isManualEntry: true,
        testType: assessment.testType || "PRE",
      };

      await updateAssessment(assessment.$id, assessmentData);

      const updatedAssessment = {
        ...assessment,
        ...assessmentData,
      };

      onSave(updatedAssessment);
      onClose();
    } catch (error) {
      console.error("Error updating assessment:", error);
      alert(t("manualEntry.errorUpdatingAssessment"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasUnsavedChanges = () => {
    if (!editingStudent || !originalStudent) return false;

    // Compare all fields
    const fieldsToCompare: (keyof Student)[] = [
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

    return fieldsToCompare.some(
      (field) => editingStudent[field] !== originalStudent[field]
    );
  };

  const handleClose = () => {
    if (hasUnsavedChanges()) {
      const confirmed = window.confirm(t("manualEntry.unsavedChangesConfirm"));
      if (!confirmed) {
        return;
      }
    }

    setEditingStudent(null);
    setOriginalStudent(null);
    setIsSubmitting(false);
    onClose();
  };

  if (!isMounted || !isOpen || !editingStudent) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      suppressHydrationWarning
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {t("manualEntry.editStudentAssessment")}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("manualEntry.studentName")}
            </label>
            <input
              type="text"
              value={editingStudent.studentName}
              onChange={(e) =>
                updateEditingStudent("studentName", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82A4DE] text-sm sm:text-base text-gray-900 bg-white"
              required
            />
          </div>
          <div className="border border-gray-200 rounded-lg p-6 mb-6">
            {/* Assessment Criteria */}
            <div className="space-y-6">
              {rubricData.skillCategories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <div className="space-y-4">
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
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="mb-3">
                            <p className="text-md font-medium text-gray-900 mb-1">
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
                              showLabel={true}
                              maxRating={4}
                              ratingLevels={rubricData.ratingLevels}
                              disabled={isSubmitting}
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
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="bg-[#4F86E2] text-white px-6 py-2 rounded-md hover:bg-[#3d6bc7] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{t("manualEntry.saving")}</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>{t("manualEntry.saveChanges")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
