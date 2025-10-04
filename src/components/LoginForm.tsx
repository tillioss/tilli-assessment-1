"use client";

import { useState } from "react";
import { ArrowRight, Loader2, User } from "lucide-react";
import { TeacherInfo } from "@/types";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { login } from "@/lib/appwrite";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo>({
    school: t("schools.school1"),
    grade: t("grades.grade1"),
    gender: "",
    age: undefined,
    teachingExperience: undefined,
    education: "",
    selTraining: "",
    multilingualClassroom: undefined,
    classSize: undefined,
    classroomResources: [],
    resourcesOther: "",
    resourcesSufficiency: "",
  });

  const schoolOptions = [
    t("schools.school1"),
    t("schools.school2"),
    t("schools.school3"),
  ];
  const gradeOptions = [t("grades.grade1")];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(teacherInfo);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError(t("login.loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg relative">
      {/* Mascot above title */}
      <div className="flex justify-center mb-4">
        <Image
          src="/images/mascot/tilli.png"
          alt={t("app.mascotAlt")}
          width={80}
          height={80}
          className="rounded-full"
          priority
        />
      </div>
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {t("login.title")}
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
            {t("login.teacherInfo")}
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("login.school")} *
            </label>
            <select
              value={teacherInfo.school}
              onChange={(e) =>
                setTeacherInfo((prev) => ({
                  ...prev,
                  school: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82A4DE] text-sm sm:text-base text-gray-900 bg-white"
              required
            >
              <option value="">{t("login.selectSchool")}</option>
              {schoolOptions.map((school) => (
                <option key={school} value={school}>
                  {school}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("login.grade")} *
            </label>
            <select
              value={teacherInfo.grade}
              onChange={(e) =>
                setTeacherInfo((prev) => ({
                  ...prev,
                  grade: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82A4DE] text-sm sm:text-base text-gray-900 bg-white"
              required
            >
              <option value="">{t("login.selectGrade")}</option>
              {gradeOptions.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Demographics and Experience Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <User className="w-5 h-5 mr-2" />
            {t("login.demographics")}
          </h2>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("login.gender")} *
            </label>
            <select
              value={teacherInfo.gender || ""}
              onChange={(e) =>
                setTeacherInfo((prev) => ({
                  ...prev,
                  gender: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82A4DE] text-sm sm:text-base text-gray-900 bg-white"
              required
            >
              <option value="">{t("login.selectGender")}</option>
              <option value="male">{t("login.genderMale")}</option>
              <option value="female">{t("login.genderFemale")}</option>
              <option value="other">{t("login.genderOther")}</option>
              <option value="prefer-not-to-say">
                {t("login.genderPreferNotToSay")}
              </option>
            </select>
          </div>

          {/* Age and Teaching Experience */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("login.age")} *
              </label>
              <input
                type="number"
                value={teacherInfo.age || ""}
                onChange={(e) =>
                  setTeacherInfo((prev) => ({
                    ...prev,
                    age: parseInt(e.target.value) || undefined,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82A4DE] text-sm sm:text-base text-gray-900 placeholder-gray-500"
                placeholder={t("login.agePlaceholder")}
                required
                min="18"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("login.teachingExperience")} *
              </label>
              <input
                type="number"
                value={teacherInfo.teachingExperience || ""}
                onChange={(e) =>
                  setTeacherInfo((prev) => ({
                    ...prev,
                    teachingExperience: parseInt(e.target.value) || undefined,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82A4DE] text-sm sm:text-base text-gray-900 placeholder-gray-500"
                placeholder={t("login.teachingExperiencePlaceholder")}
                required
                min="0"
                max="50"
              />
            </div>
          </div>

          {/* Education */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("login.education")} *
            </label>
            <select
              value={teacherInfo.education || ""}
              onChange={(e) =>
                setTeacherInfo((prev) => ({
                  ...prev,
                  education: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82A4DE] text-sm sm:text-base text-gray-900 bg-white"
              required
            >
              <option value="">{t("login.selectEducation")}</option>
              <option value="none">{t("login.educationNone")}</option>
              <option value="primary">{t("login.educationPrimary")}</option>
              <option value="middle">{t("login.educationMiddle")}</option>
              <option value="high">{t("login.educationHigh")}</option>
              <option value="bachelor">{t("login.educationBachelor")}</option>
              <option value="master">{t("login.educationMaster")}</option>
              <option value="doctorate">{t("login.educationDoctorate")}</option>
            </select>
          </div>

          {/* SEL Training */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("login.selTraining")} *
            </label>
            <select
              value={teacherInfo.selTraining || ""}
              onChange={(e) =>
                setTeacherInfo((prev) => ({
                  ...prev,
                  selTraining: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82A4DE] text-sm sm:text-base text-gray-900 bg-white"
              required
            >
              <option value="">{t("login.selectSelTraining")}</option>
              <option value="none">{t("login.selTrainingNone")}</option>
              <option value="limited-theoretical">
                {t("login.selTrainingLimitedTheoretical")}
              </option>
              <option value="limited-practical">
                {t("login.selTrainingLimitedPractical")}
              </option>
              <option value="ongoing-theoretical">
                {t("login.selTrainingOngoingTheoretical")}
              </option>
              <option value="ongoing-practical">
                {t("login.selTrainingOngoingPractical")}
              </option>
              <option value="ongoing-balanced">
                {t("login.selTrainingOngoingBalanced")}
              </option>
            </select>
          </div>

          {/* Multilingual Classroom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("login.multilingualClassroom")} *
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer text-black">
                <input
                  type="radio"
                  name="multilingual"
                  value="yes"
                  checked={teacherInfo.multilingualClassroom === true}
                  onChange={(e) => {
                    console.log("Yes radio clicked:", e.target.value);
                    setTeacherInfo((prev) => ({
                      ...prev,
                      multilingualClassroom: true,
                    }));
                  }}
                  className="w-4 h-4"
                  required
                />
                <span className="text-black">{t("login.multilingualYes")}</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer text-black">
                <input
                  type="radio"
                  name="multilingual"
                  value="no"
                  checked={teacherInfo.multilingualClassroom === false}
                  onChange={(e) => {
                    console.log("No radio clicked:", e.target.value);
                    setTeacherInfo((prev) => ({
                      ...prev,
                      multilingualClassroom: false,
                    }));
                  }}
                  className="w-4 h-4"
                />
                <span className="text-black">{t("login.multilingualNo")}</span>
              </label>
            </div>
          </div>

          {/* Class Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("login.classSize")} *
            </label>
            <input
              type="number"
              value={teacherInfo.classSize || ""}
              onChange={(e) =>
                setTeacherInfo((prev) => ({
                  ...prev,
                  classSize: parseInt(e.target.value) || undefined,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82A4DE] text-sm sm:text-base text-gray-900 placeholder-gray-500"
              placeholder={t("login.classSizePlaceholder")}
              required
              min="1"
              max="100"
            />
          </div>

          {/* Classroom Resources */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("login.classroomResources")} *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "books", label: t("login.resourcesBooks") },
                { key: "internet", label: t("login.resourcesInternet") },
                { key: "smartphone", label: t("login.resourcesSmartphone") },
                { key: "laptop", label: t("login.resourcesLaptop") },
                { key: "projector", label: t("login.resourcesProjector") },
                { key: "smartboard", label: t("login.resourcesSmartBoard") },
                {
                  key: "teaching-materials",
                  label: t("login.resourcesTeachingMaterials"),
                },
                { key: "other", label: t("login.resourcesOther") },
              ].map((resource) => (
                <label
                  key={resource.key}
                  className="flex items-center text-black"
                >
                  <input
                    type="checkbox"
                    checked={
                      teacherInfo.classroomResources?.includes(resource.key) ||
                      false
                    }
                    onChange={(e) => {
                      const currentResources =
                        teacherInfo.classroomResources || [];
                      if (e.target.checked) {
                        setTeacherInfo((prev) => ({
                          ...prev,
                          classroomResources: [
                            ...currentResources,
                            resource.key,
                          ],
                        }));
                      } else {
                        setTeacherInfo((prev) => ({
                          ...prev,
                          classroomResources: currentResources.filter(
                            (r) => r !== resource.key
                          ),
                        }));
                      }
                    }}
                    className="mr-2"
                  />
                  {resource.label}
                </label>
              ))}
            </div>
            {teacherInfo.classroomResources?.includes("other") && (
              <input
                type="text"
                value={teacherInfo.resourcesOther || ""}
                onChange={(e) =>
                  setTeacherInfo((prev) => ({
                    ...prev,
                    resourcesOther: e.target.value,
                  }))
                }
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82A4DE] text-sm sm:text-base text-gray-900 placeholder-gray-500"
                placeholder={t("login.resourcesOtherPlaceholder")}
              />
            )}
          </div>

          {/* Resources Sufficiency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("login.resourcesSufficiency")} *
            </label>
            <select
              value={teacherInfo.resourcesSufficiency || ""}
              onChange={(e) =>
                setTeacherInfo((prev) => ({
                  ...prev,
                  resourcesSufficiency: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82A4DE] text-sm sm:text-base text-gray-900 bg-white"
              required
            >
              <option value="">{t("login.selectSufficiency")}</option>
              <option value="not-sufficient">
                {t("login.sufficiencyNotSufficient")}
              </option>
              <option value="somewhat-sufficient">
                {t("login.sufficiencySomewhatSufficient")}
              </option>
              <option value="sufficient">
                {t("login.sufficiencySufficient")}
              </option>
              <option value="very-sufficient">
                {t("login.sufficiencyVerySufficient")}
              </option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 bg-[#82A4DE] text-white py-3 px-4 rounded-full hover:bg-[#3d6bc7] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
        >
          {loading ? (
            <Loader2 size={18} className="sm:w-5 sm:h-5" />
          ) : (
            <>
              <span>{t("common.getStarted")}</span>
              <ArrowRight size={18} className="sm:w-5 sm:h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs sm:text-sm text-gray-500">
          {t("login.description")}
        </p>
      </div>
    </div>
  );
}
