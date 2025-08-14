"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import {
  X,
  Camera,
  Smartphone,
  Image,
  CheckCircle,
  Eye,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
} from "lucide-react";
import { useNavbar } from "@/components/NavbarContext";
import { useAuth } from "@/components/AuthProvider";
import { getRandomEmoji } from "@/lib/emoji-assignment";
import StarRating from "@/components/StarRating";
import { rubricData } from "@/lib/rubric-data";

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

function UploadPhotosContent() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string>("");
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [captureFeedback, setCaptureFeedback] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [expandedStudents, setExpandedStudents] = useState<Set<string>>(
    new Set()
  );
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const teacherInfo = user?.teacherInfo || {
    teacherName: "",
    school: "",
    grade: "",
    section: "",
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking authentication
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

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  const { setBackButton, hideBackButton } = useNavbar();

  useEffect(() => {
    setBackButton("/", "Back");
    return () => hideBackButton();
  }, [setBackButton, hideBackButton]);

  // Loading progress simulation
  useEffect(() => {
    if (isUploading) {
      setLoadingProgress(0);
      setLoadingMessage("Preparing your photos for analysis...");

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
            "Analyzing rubric structure...",
            "Identifying student responses...",
            "Processing handwriting and marks...",
            "Extracting assessment data...",
            "Finalizing results...",
            "Almost done...",
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

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Ensure video element is properly set up when camera is shown
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
          setCameraError(
            "Camera access denied. Please allow camera permissions."
          );
        } else if (error.name === "NotFoundError") {
          setCameraError("No camera found on this device.");
        } else {
          setCameraError("Unable to access camera. Please check permissions.");
        }
      } else {
        setCameraError("Unable to access camera. Please check permissions.");
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
        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to blob
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

              // Show success feedback using React state
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

  const handleSubmit = async () => {
    if (uploadedFiles.length === 0) {
      alert("Please upload at least one photo");
      return;
    }

    setIsUploading(true);
    setLoadingProgress(0);
    setLoadingMessage("Preparing your photos for analysis...");

    try {
      // Create FormData for file upload
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

        // Complete the progress
        setLoadingProgress(100);
        setLoadingMessage("Analysis complete! Preparing your results...");

        // Small delay to show completion
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Assign emojis to students and ensure all questions are initialized
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

        setScanResult(resultWithEmojis);
        setShowResults(true);
        console.log("Scan result:", resultWithEmojis);
      } else {
        throw new Error("Failed to process photos");
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
      alert("Error processing photos. Please try again.");
    } finally {
      setIsUploading(false);
      setLoadingProgress(0);
      setLoadingMessage("");
    }
  };

  const isStudentFullyGraded = (student: StudentAssessment) => {
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
      (field) => student[field as keyof StudentAssessment] !== ""
    );
  };

  const getStudentCardColor = (student: StudentAssessment) => {
    if (!student.studentName.trim()) return "border-gray-200 bg-white";
    if (isStudentFullyGraded(student)) {
      return "border-green-200 bg-green-50";
    }
    return "border-yellow-200 bg-yellow-50";
  };

  const getStudentStatusText = (student: StudentAssessment) => {
    if (!student.studentName.trim()) return "No name entered";
    if (isStudentFullyGraded(student)) {
      return "✓ Fully graded";
    }
    return "⚠ Incomplete";
  };

  const getStudentStatusColor = (student: StudentAssessment) => {
    if (!student.studentName.trim()) return "text-gray-500";
    if (isStudentFullyGraded(student)) {
      return "text-green-600";
    }
    return "text-yellow-600";
  };

  const updateStudentGrade = (
    studentIndex: number,
    question: string,
    value: string
  ) => {
    if (scanResult) {
      const updatedStudents = [...scanResult.students];
      updatedStudents[studentIndex] = {
        ...updatedStudents[studentIndex],
        [question]: value,
      };
      setScanResult({
        ...scanResult,
        students: updatedStudents,
      });
    }
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

  const handleSaveAssessment = async () => {
    try {
      // TODO: Save to Appwrite database
      console.log("Saving assessment:", scanResult);

      // Show success message
      alert("Assessment saved successfully!");

      // Navigate to view assessments
      router.push("/view-assessments");
    } catch (error) {
      console.error("Error saving assessment:", error);
      alert("Error saving assessment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#E1ECFF]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!showResults ? (
          <>
            {/* Photo Upload Area */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Upload Rubric Photos
                </h2>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      AI Photo Analysis
                    </h4>
                    <p className="text-xs text-blue-800">
                      Our AI will automatically extract all student responses
                      and scores from your rubric photos. Just upload clear
                      photos and let the AI do the work for you!
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
                        Take photos of each rubric sheet. You can capture
                        multiple photos.
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    {isCameraLoading ? (
                      <div className="w-full h-64 sm:h-96 bg-gray-800 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-white text-sm">
                            Starting camera...
                          </p>
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
                          ? "Loading..."
                          : captureFeedback
                          ? "Photo Captured!"
                          : "Capture"}
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
                      Take Photo
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 text-center">
                      Use your mobile camera to capture rubric photos
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
                      Upload Files
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 text-center">
                      {isDragActive
                        ? "Drop files here..."
                        : "Select existing photos from your device"}
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
                      Drop the photos here...
                    </p>
                  ) : (
                    <div>
                      <p className="text-sm sm:text-base text-gray-600 mb-2">
                        Drag & drop photos here, or click to select files
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Supports JPEG, PNG, WebP formats
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Uploaded Files Preview */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
                    Uploaded Photos ({uploadedFiles.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {uploadedFiles.map((fileObj) => (
                      <div key={fileObj.id} className="relative group">
                        <img
                          src={fileObj.preview}
                          alt="Preview"
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
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Sparkles size={18} className="sm:w-5 sm:h-5" />
                    <span>Start AI Analysis</span>
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
          </>
        ) : (
          /* Results Display */
          scanResult && (
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  AI Analysis Complete
                </h2>
                <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  {scanResult.students.length} Students Found
                </span>
              </div>

              {/* Review Message */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      Review Your Results
                    </h4>
                    <p className="text-xs text-blue-800">
                      Please review the AI analysis below. You can expand each
                      student to see detailed responses. Once you're satisfied,
                      click "Save Assessment" to store the results.
                    </p>
                  </div>
                </div>
              </div>

              {/* Teacher Information */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-base font-medium text-gray-900 mb-3 flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  Assessment Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                      Teacher Name
                    </span>
                    <p className="text-sm font-medium text-gray-900">
                      {scanResult.teacherName}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                      School
                    </span>
                    <p className="text-sm font-medium text-gray-900">
                      {scanResult.school}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                      Grade
                    </span>
                    <p className="text-sm font-medium text-gray-900">
                      {scanResult.grade}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                      Section
                    </span>
                    <p className="text-sm font-medium text-gray-900">
                      {teacherInfo.section}
                    </p>
                  </div>
                </div>
              </div>

              {/* Student Assessments */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  Student Assessments ({scanResult.students.length})
                </h3>
                {scanResult.students.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {scanResult.students.map((student, index) => {
                      const studentId = `student-${index}`;
                      const isExpanded = expandedStudents.has(studentId);

                      return (
                        <div
                          key={index}
                          className={`border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${getStudentCardColor(
                            student
                          )}`}
                        >
                          {/* Student Card Header */}
                          <div
                            className="p-4"
                            onClick={() => toggleStudentExpansion(studentId)}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <span className="text-2xl">
                                  {student.emoji}
                                </span>
                                <div>
                                  <h4 className="font-medium text-gray-900 text-sm">
                                    {student.studentName}
                                  </h4>
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
                            <div className="border-t border-gray-100 p-4 bg-gray-50">
                              <div className="space-y-4">
                                {rubricData.skillCategories.map(
                                  (category, categoryIndex) => (
                                    <div
                                      key={categoryIndex}
                                      className="border-l-4 border-blue-200 pl-3"
                                    >
                                      <h4 className="text-xs font-semibold text-gray-900 mb-2">
                                        {category.categoryName}
                                      </h4>
                                      <div className="space-y-3">
                                        {category.criteria.map(
                                          (criterion, criterionIndex) => {
                                            const questionNumber =
                                              categoryIndex *
                                                category.criteria.length +
                                              criterionIndex +
                                              1;
                                            const fieldName =
                                              `q${questionNumber}Answer` as keyof StudentAssessment;

                                            return (
                                              <div
                                                key={criterion.id}
                                                className="bg-gray-50 rounded-lg p-3"
                                              >
                                                <div className="mb-2">
                                                  <p className="text-xs font-medium text-gray-900 mb-1">
                                                    {criterion.text}
                                                  </p>
                                                  <p className="text-xs text-gray-600 italic">
                                                    {criterion.example}
                                                  </p>
                                                </div>
                                                <div className="mt-3">
                                                  <StarRating
                                                    value={
                                                      student[fieldName] || ""
                                                    }
                                                    onChange={(value) =>
                                                      updateStudentGrade(
                                                        index,
                                                        fieldName,
                                                        value
                                                      )
                                                    }
                                                    maxRating={4}
                                                    ratingLevels={
                                                      rubricData.ratingLevels
                                                    }
                                                    showLabel={false}
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
                      No student assessments found.
                    </p>
                  </div>
                )}
              </div>

              {/* Save Assessment Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={handleSaveAssessment}
                  className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors font-medium text-sm sm:text-base flex items-center justify-center mx-auto space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Save Assessment</span>
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  This will save the assessment to your dashboard
                </p>
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}

export default function UploadPhotosPage() {
  return <UploadPhotosContent />;
}
