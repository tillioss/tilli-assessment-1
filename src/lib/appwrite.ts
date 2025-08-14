import { Client, Account, Databases, Storage, Query } from "appwrite";
import { AssessmentRecord } from "@/types";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { client };

// Database and collection IDs
export const RUBRICS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_RUBRICS_COLLECTION_ID || "";
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const collectionId = RUBRICS_COLLECTION_ID;

export const createAssessment = async (assessment: AssessmentRecord) => {
  try {
    if (!databaseId) {
      throw new Error(
        "Database ID not configured. Please set NEXT_PUBLIC_APPWRITE_DATABASE_ID in your environment variables."
      );
    }

    if (!collectionId) {
      throw new Error(
        "Collection ID not configured. Please set NEXT_PUBLIC_RUBRICS_COLLECTION_ID in your environment variables."
      );
    }

    const response = await databases.createDocument(
      databaseId,
      collectionId,
      "unique()",
      {
        teacherId: assessment.teacherId,
        teacherName: assessment.teacherName,
        school: assessment.school,
        grade: assessment.grade,
        section: assessment.section,
        studentName: assessment.studentName,
        assessment: assessment.assessment,
        isManualEntry: assessment.isManualEntry,
        createdAt: new Date().toISOString(),
      }
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
    const collectionId = RUBRICS_COLLECTION_ID;

    if (!databaseId) {
      throw new Error(
        "Database ID not configured. Please set NEXT_PUBLIC_APPWRITE_DATABASE_ID in your environment variables."
      );
    }

    if (!collectionId) {
      throw new Error(
        "Collection ID not configured. Please set NEXT_PUBLIC_RUBRICS_COLLECTION_ID in your environment variables."
      );
    }

    const response = await databases.listDocuments(databaseId, collectionId, [
      Query.equal("teacherId", teacherId),
    ]);

    return response.documents.map((doc) => ({
      $id: doc.$id,
      teacherId: doc.teacherId,
      teacherName: doc.teacherName,
      school: doc.school,
      grade: doc.grade,
      section: doc.section,
      date: doc.date,
      studentName: doc.studentName,
      assessment: doc.assessment,
      isManualEntry: doc.isManualEntry,
      createdAt: doc.createdAt,
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

    if (!collectionId) {
      throw new Error(
        "Collection ID not configured. Please set NEXT_PUBLIC_RUBRICS_COLLECTION_ID in your environment variables."
      );
    }

    const response = await databases.updateDocument(
      databaseId,
      collectionId,
      assessmentId,
      {
        teacherId: assessment.teacherId,
        teacherName: assessment.teacherName,
        school: assessment.school,
        grade: assessment.grade,
        section: assessment.section,
        studentName: assessment.studentName,
        assessment: assessment.assessment,
        isManualEntry: assessment.isManualEntry,
      }
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

    if (!collectionId) {
      throw new Error(
        "Collection ID not configured. Please set NEXT_PUBLIC_RUBRICS_COLLECTION_ID in your environment variables."
      );
    }

    await databases.deleteDocument(databaseId, collectionId, assessmentId);
    return true;
  } catch (error) {
    console.error("Error deleting assessment:", error);
    throw error;
  }
};
