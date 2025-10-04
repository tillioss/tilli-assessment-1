"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { X, Camera, Smartphone, Image, Clock, Sparkles } from "lucide-react";
import { useNavbar } from "@/components/NavbarContext";
import { getRandomEmoji } from "@/lib/emoji-assignment";
import { createAssessment } from "@/lib/appwrite";
import { useTranslation } from "react-i18next";
import { AuthService } from "@/lib/auth";
import { Student } from "@/types";

interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}

interface StudentAssessment {
  q1Answer: string;
  q2Answer: string;
  q3Answer: string;
  q4Answer: string;
  q5Answer: string;
  q6Answer: string;
  q7Answer: string;
  q8Answer: string;
  q9Answer: string;
  q10Answer: string;
  q11Answer: string;
  studentName: string;
  emoji?: string;
}

interface ScanResult {
  grade: string;
  school: string;
  students: StudentAssessment[];
  teacherName: string;
}

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

function UploadPhotosContent() {
  const router = useRouter();
  const { setBackButton, hideBackButton } = useNavbar();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const testType = searchParams.get("testType") || "PRE";
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string>("");
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [captureFeedback, setCaptureFeedback] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setBackButton("/dashboard", t("common.back"));
    return () => hideBackButton();
  }, [setBackButton, hideBackButton]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (isUploading) {
      setLoadingProgress(0);
      setLoadingMessage(t("uploadPhotos.preparingPhotos"));

      const progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 2000);

      const messageInterval = setInterval(() => {
        setLoadingMessage((prev) => {
          const messages = [
            t("uploadPhotos.analyzingStructure"),
            t("uploadPhotos.identifyingResponses"),
            t("uploadPhotos.processingHandwritingMarks"),
            t("uploadPhotos.extractingData"),
            t("uploadPhotos.finalizingResults"),
            t("uploadPhotos.almostDone"),
          ];
          const currentIndex = messages.indexOf(prev);
          const nextIndex = (currentIndex + 1) % messages.length;
          return messages[nextIndex];
        });
      }, 8000);

      return () => {
        clearInterval(progressInterval);
        clearInterval(messageInterval);
      };
    }
  }, [isUploading]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
  });

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  useEffect(() => {
    if (showCamera && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(console.error);
    }
  }, [showCamera, cameraStream]);

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  // Camera functions
  const startCamera = async () => {
    try {
      setCameraError("");
      setIsCameraLoading(true);
      setShowCamera(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      setCameraStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsCameraLoading(false);
    } catch (error) {
      console.error("Camera error:", error);
      setShowCamera(false);
      setIsCameraLoading(false);
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          setCameraError(t("uploadPhotos.cameraAccessDenied"));
        } else if (error.name === "NotFoundError") {
          setCameraError(t("uploadPhotos.noCameraFound"));
        } else {
          setCameraError(t("uploadPhotos.unableToAccessCamera"));
        }
      } else {
        setCameraError(t("uploadPhotos.unableToAccessCamera"));
      }
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
    setCameraError("");
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], `photo_${Date.now()}.jpg`, {
                type: "image/jpeg",
              });

              const newFile = {
                file,
                preview: URL.createObjectURL(blob),
                id: Math.random().toString(36).substr(2, 9),
              };

              setUploadedFiles((prev) => [...prev, newFile]);

              setCaptureFeedback(true);
              setTimeout(() => {
                setCaptureFeedback(false);
              }, 1000);
            }
          },
          "image/jpeg",
          0.8
        );
      }
    }
  };

  const handleSaveAssessment = async (result: ScanResult) => {
    try {
      for (const student of result.students) {
        // Convert StudentAssessment to Student format for calculation
        const studentForCalculation: Student = {
          emoji: student.emoji || "👤",
          q1Answer: student.q1Answer || "",
          q2Answer: student.q2Answer || "",
          q3Answer: student.q3Answer || "",
          q4Answer: student.q4Answer || "",
          q5Answer: student.q5Answer || "",
          q6Answer: student.q6Answer || "",
          q7Answer: student.q7Answer || "",
          q8Answer: student.q8Answer || "",
          q9Answer: student.q9Answer || "",
          q10Answer: student.q10Answer || "",
          q11Answer: student.q11Answer || "",
        };

        // Calculate skill scores for this student
        const skillScores = calculateSkillScores(studentForCalculation);

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

        const assessmentData = {
          teacherId: currentUser?.$id || "",
          scores: JSON.stringify(questionScores),
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
          overallScore: overallScore,
          skillScores: JSON.stringify(skillScores),
          isManualEntry: false,
          testType,
        };

        await createAssessment(assessmentData);
      }

      router.push("/manual-entry");
    } catch (error) {
      console.error("Error saving assessment:", error);
      alert(t("manualEntry.errorCreatingAssessment"));
    }
  };

  const handleSubmit = async () => {
    if (uploadedFiles.length === 0) {
      alert(t("uploadPhotos.pleaseUploadPhoto"));
      return;
    }

    setIsUploading(true);
    setLoadingProgress(0);
    setLoadingMessage(t("uploadPhotos.preparingPhotos"));

    try {
      const formData = new FormData();
      uploadedFiles.forEach((fileObj) => {
        formData.append("image", fileObj.file);
      });

      const response = await fetch(
        process.env.NEXT_PUBLIC_SCAN_API +
          "/student-assessment-rubric-scanning",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();

        setLoadingProgress(100);
        setLoadingMessage(t("uploadPhotos.analysisComplete"));

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const studentsWithEmojis = result.students.map(
          (student: StudentAssessment) => ({
            q1Answer: student.q1Answer || "",
            q2Answer: student.q2Answer || "",
            q3Answer: student.q3Answer || "",
            q4Answer: student.q4Answer || "",
            q5Answer: student.q5Answer || "",
            q6Answer: student.q6Answer || "",
            q7Answer: student.q7Answer || "",
            q8Answer: student.q8Answer || "",
            q9Answer: student.q9Answer || "",
            q10Answer: student.q10Answer || "",
            q11Answer: student.q11Answer || "",
            studentName: student.studentName || "",
            emoji: getRandomEmoji(),
          })
        );

        const resultWithEmojis = {
          ...result,
          students: studentsWithEmojis,
        };

        await handleSaveAssessment(resultWithEmojis);
      } else {
        throw new Error(t("uploadPhotos.failedToProcessPhotos"));
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
      alert(t("uploadPhotos.errorProcessingPhotos"));
    } finally {
      setIsUploading(false);
      setLoadingProgress(0);
      setLoadingMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-[#E1ECFF]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Photo Upload Area */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              {t("uploadPhotos.title")}
            </h2>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  {t("uploadPhotos.aiAnalysis")}
                </h4>
                <p className="text-xs text-blue-800">
                  {t("uploadPhotos.aiDescription")}
                </p>
              </div>
            </div>
          </div>

          {/* Camera Interface */}
          {showCamera && (
            <div className="mb-6 p-4 bg-gray-900 rounded-lg">
              {/* Photo Counter */}
              <div className="text-center mb-4">
                <div className="inline-flex items-center space-x-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full">
                  <span className="text-sm">📸</span>
                  <span className="text-sm font-medium">
                    {uploadedFiles.length} Photo
                    {uploadedFiles.length !== 1 ? "s" : ""} Captured
                  </span>
                </div>
                {uploadedFiles.length === 0 && (
                  <p className="text-white text-xs mt-2 opacity-75">
                    Take photos of each rubric sheet. You can capture multiple
                    photos.
                  </p>
                )}
              </div>
              <div className="relative">
                {isCameraLoading ? (
                  <div className="w-full h-64 sm:h-96 bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-white text-sm">Starting camera...</p>
                    </div>
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-64 sm:h-96 object-cover rounded-lg"
                    onLoadedMetadata={() => {
                      if (videoRef.current) {
                        videoRef.current.play().catch(console.error);
                      }
                    }}
                  />
                )}
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                  <button
                    onClick={stopCamera}
                    className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={capturePhoto}
                    disabled={isCameraLoading}
                    className={`px-6 py-2 rounded-full transition-colors ${
                      captureFeedback
                        ? "bg-green-500 text-white"
                        : "bg-[#4F86E2] text-white hover:bg-[#3d6bc7] disabled:bg-gray-400 disabled:cursor-not-allowed"
                    }`}
                  >
                    {isCameraLoading
                      ? t("common.loading")
                      : captureFeedback
                      ? t("uploadPhotos.photoCaptured")
                      : t("uploadPhotos.capture")}
                  </button>
                  <button
                    onClick={stopCamera}
                    className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors"
                  >
                    Done ({uploadedFiles.length})
                  </button>
                </div>
              </div>
              {cameraError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                  <p className="text-red-700 text-sm text-center mb-2">
                    {cameraError}
                  </p>
                  <div className="text-center">
                    <button
                      onClick={() => setShowCamera(false)}
                      className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors text-sm"
                    >
                      Close Camera
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upload Options */}
          {!showCamera && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Camera Option */}
              <button
                onClick={startCamera}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#4F86E2] hover:bg-[#E1ECFF] transition-colors"
              >
                <Smartphone className="w-8 h-8 sm:w-12 sm:h-12 text-[#4F86E2] mb-3" />
                <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1">
                  {t("uploadPhotos.takePhoto")}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 text-center">
                  {t("uploadPhotos.takePhotoDescription")}
                </p>
              </button>

              {/* File Upload Option */}
              <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-[#4F86E2] bg-[#E1ECFF]"
                    : "border-gray-300 hover:border-[#4F86E2] hover:bg-[#E1ECFF]"
                }`}
              >
                <input {...getInputProps()} />
                <Image className="w-8 h-8 sm:w-12 sm:h-12 text-green-500 mb-3" />
                <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1">
                  {t("uploadPhotos.uploadFiles")}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 text-center">
                  {isDragActive
                    ? t("uploadPhotos.dropFilesHere")
                    : t("uploadPhotos.uploadFilesDescription")}
                </p>
              </div>
            </div>
          )}

          {/* Drag & Drop Area (for desktop) */}
          {!showCamera && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-[#4F86E2] bg-[#E1ECFF]"
                  : "border-gray-300 hover:border-[#4F86E2]"
              }`}
            >
              <input {...getInputProps()} />
              <Camera className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
              {isDragActive ? (
                <p className="text-[#4F86E2] text-sm sm:text-base">
                  {t("uploadPhotos.dropFilesHere")}
                </p>
              ) : (
                <div>
                  <p className="text-sm sm:text-base text-gray-600 mb-2">
                    {t("uploadPhotos.dragDropText")}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {t("uploadPhotos.supportedFormats")}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Uploaded Files Preview */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
                {t("uploadPhotos.uploadedPhotos")} ({uploadedFiles.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {uploadedFiles.map((fileObj) => (
                  <div key={fileObj.id} className="relative group">
                    <img
                      src={fileObj.preview}
                      alt={t("uploadPhotos.preview")}
                      className="w-full h-24 sm:h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeFile(fileObj.id)}
                      className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} className="sm:w-4 sm:h-4" />
                    </button>
                    <p className="text-xs text-gray-600 mt-1 truncate">
                      {fileObj.file.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={isUploading || uploadedFiles.length === 0}
            className="bg-[#4F86E2] text-white px-6 sm:px-8 py-3 rounded-full hover:bg-[#3d6bc7] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
          >
            {isUploading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{t("uploadPhotos.processing")}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Sparkles size={18} className="sm:w-5 sm:h-5" />
                <span>{t("uploadPhotos.startAiAnalysis")}</span>
              </div>
            )}
          </button>
        </div>

        {/* Loading Overlay */}
        {isUploading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 max-w-md mx-4">
              {/* Mascot */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-[#E1ECFF] rounded-full flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-[#4F86E2] animate-pulse" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Clock className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Analyzing Your Rubrics
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  This usually takes about 1 minute
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#4F86E2] h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Status Message */}
              <div className="text-center mb-6">
                <p className="text-sm text-gray-700 font-medium">
                  {loadingMessage}
                </p>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  What's happening?
                </h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• AI is analyzing your rubric photos</li>
                  <li>• Extracting student responses and scores</li>
                  <li>• Processing handwriting and marks</li>
                  <li>• Preparing detailed results for you</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function UploadPhotosPage() {
  return <UploadPhotosContent />;
}
