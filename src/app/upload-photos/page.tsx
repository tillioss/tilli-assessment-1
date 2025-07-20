"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Upload, X, Camera, ArrowLeft, Smartphone, Image } from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useNavbar } from "@/components/NavbarContext";

interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}

function UploadPhotosContent() {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [teacherInfo, setTeacherInfo] = useState({
    teacherName: "",
    school: "",
    grade: "",
  });

  const { setBackButton, hideBackButton } = useNavbar();

  useEffect(() => {
    setBackButton("/", "Back");
    return () => hideBackButton();
  }, [setBackButton, hideBackButton]);

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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      setCameraStream(stream);
      setShowCamera(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera error:", error);
      setCameraError("Unable to access camera. Please check permissions.");
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
              stopCamera();
            }
          },
          "image/jpeg",
          0.8
        );
      }
    }
  };

  const handleSubmit = async () => {
    if (!teacherInfo.teacherName || !teacherInfo.school || !teacherInfo.grade) {
      alert("Please fill in all teacher information");
      return;
    }

    if (uploadedFiles.length === 0) {
      alert("Please upload at least one photo");
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      uploadedFiles.forEach((fileObj) => {
        formData.append("image", fileObj.file);
      });

      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/student-assessment-rubric-scanning",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        // TODO: Save to Appwrite
        console.log("Scan result:", result);
        router.push("/view-assessments");
      } else {
        throw new Error("Failed to process photos");
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
      alert("Error processing photos. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E1ECFF]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Teacher Information */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
            Teacher Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teacher Name
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
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School
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
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade
              </label>
              <input
                type="text"
                value={teacherInfo.grade}
                onChange={(e) =>
                  setTeacherInfo((prev) => ({ ...prev, grade: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F86E2] text-sm sm:text-base text-gray-900 placeholder-gray-500"
                placeholder="Enter grade"
              />
            </div>
          </div>
        </div>

        {/* Photo Upload Area */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
            Upload Rubric Photos
          </h2>

          {/* Camera Interface */}
          {showCamera && (
            <div className="mb-6 p-4 bg-gray-900 rounded-lg">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 sm:h-96 object-cover rounded-lg"
                />
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
                    className="bg-[#4F86E2] text-white px-6 py-2 rounded-full hover:bg-[#3d6bc7] transition-colors"
                  >
                    Capture
                  </button>
                </div>
              </div>
              {cameraError && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {cameraError}
                </p>
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
                <Upload size={18} className="sm:w-5 sm:h-5" />
                <span>Process Photos</span>
              </div>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

export default function UploadPhotosPage() {
  return (
    <ProtectedRoute>
      <UploadPhotosContent />
    </ProtectedRoute>
  );
}
