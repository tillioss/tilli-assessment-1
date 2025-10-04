import { Client, Account, Databases, Storage, Query } from "appwrite";
import { AssessmentRecord, TeacherInfo } from "@/types";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { client };

// Database and collection IDs
export const reportCollectionId =
  process.env.NEXT_PUBLIC_TEACHER_REPORT_COLLECTION_ID || "";
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

export const login = async (teacherInfo: TeacherInfo) => {
  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    const teachersCollectionId = process.env.NEXT_PUBLIC_TEACHERS_COLLECTION_ID;

    if (!databaseId) {
      throw new Error(
        "Database ID not configured. Please set NEXT_PUBLIC_APPWRITE_DATABASE_ID in your environment variables."
      );
    }

    if (!teachersCollectionId) {
      throw new Error(
        "Teachers Collection ID not configured. Please set NEXT_PUBLIC_TEACHERS_COLLECTION_ID in your environment variables."
      );
    }

    // Create teacher document in Appwrite
    const teacherDoc = await databases.createDocument(
      databaseId,
      teachersCollectionId,
      "unique()",
      {
        school: teacherInfo.school,
        grade: teacherInfo.grade,
        demographics: JSON.stringify(teacherInfo),
      }
    );

    // Store session and teacher info in localStorage
    localStorage.setItem("sessionId", teacherDoc.$id);
    localStorage.setItem("teacherInfo", JSON.stringify(teacherInfo));
  } catch (error) {
    console.error("Error creating teacher session:", error);
    throw error;
  }
};

export const createAssessment = async (assessment: AssessmentRecord) => {
  try {
    if (!databaseId) {
      throw new Error(
        "Database ID not configured. Please set NEXT_PUBLIC_APPWRITE_DATABASE_ID in your environment variables."
      );
    }

    if (!reportCollectionId) {
      throw new Error(
        "Collection ID not configured. Please set NEXT_PUBLIC_reportCollectionId in your environment variables."
      );
    }

    const response = await databases.createDocument(
      databaseId,
      reportCollectionId,
      "unique()",
      assessment
    );
    return response;
  } catch (error) {
    console.error("Error creating assessment:", error);
    throw error;
  }
};

export const getAssessments = async (
  teacherId: string
): Promise<AssessmentRecord[]> => {
  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    const collectionId = reportCollectionId;

    if (!databaseId) {
      throw new Error(
        "Database ID not configured. Please set NEXT_PUBLIC_APPWRITE_DATABASE_ID in your environment variables."
      );
    }

    if (!collectionId) {
      throw new Error(
        "Collection ID not configured. Please set NEXT_PUBLIC_reportCollectionId in your environment variables."
      );
    }

    const response = await databases.listDocuments(databaseId, collectionId, [
      Query.equal("teacherId", teacherId),
    ]);

    return response.documents.map((doc) => ({
      $id: doc.$id,
      teacherId: doc.teacherId,
      overallScore: doc.overallScore,
      answers: doc.answers,
      scores: doc.scores,
      skillScores: doc.skillScores,
      testType: doc.testType,
      isManualEntry: doc.isManualEntry,
    }));
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw error;
  }
};

export const updateAssessment = async (
  assessmentId: string,
  assessment: Partial<AssessmentRecord>
) => {
  try {
    if (!databaseId) {
      throw new Error(
        "Database ID not configured. Please set NEXT_PUBLIC_APPWRITE_DATABASE_ID in your environment variables."
      );
    }

    if (!reportCollectionId) {
      throw new Error(
        "Collection ID not configured. Please set NEXT_PUBLIC_reportCollectionId in your environment variables."
      );
    }

    const response = await databases.updateDocument(
      databaseId,
      reportCollectionId,
      assessmentId,
      assessment
    );
    return response;
  } catch (error) {
    console.error("Error updating assessment:", error);
    throw error;
  }
};

export const deleteAssessment = async (assessmentId: string) => {
  try {
    if (!databaseId) {
      throw new Error(
        "Database ID not configured. Please set NEXT_PUBLIC_APPWRITE_DATABASE_ID in your environment variables."
      );
    }

    if (!reportCollectionId) {
      throw new Error(
        "Collection ID not configured. Please set NEXT_PUBLIC_reportCollectionId in your environment variables."
      );
    }

    await databases.deleteDocument(
      databaseId,
      reportCollectionId,
      assessmentId
    );
    return true;
  } catch (error) {
    console.error("Error deleting assessment:", error);
    throw error;
  }
};
