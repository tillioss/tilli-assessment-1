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
        section: teacherInfo.section,
        zone: teacherInfo.zone,
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
      studentName: doc.studentName,
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

const getLevel = (value: number) => {
  if (value < 1.66) return "beginner";
  if (value < 3) return "growth";
  return "expert";
};

const incrementDistribution = (dist: Record<string, number>, level: string) => {
  const updated = { ...dist };
  updated[level] = (updated[level] || 0) + 1;
  return updated;
};

const incrementCategoryDistributions = (
  existing: Record<string, Record<string, number>>,
  categoryLevels: Record<string, string>
) => {
  const updated = { ...existing };
  for (const [category, level] of Object.entries(categoryLevels)) {
    if (!updated[category])
      updated[category] = { beginner: 0, growth: 0, expert: 0 };

    updated[category][level] = (updated[category][level] || 0) + 1;
  }
  return updated;
};

export const updateScores = async ({
  skillScores,
  school,
  grade,
  section,
  zone,
  assessment,
  overallScore,
  testType,
}: Record<string, any>) => {
  const categoryLevels: Record<string, string> = {};
  for (const [category, score] of Object.entries(skillScores)) {
    categoryLevels[category] = getLevel(score as number);
  }

  let agg = await databases.listDocuments(
    databaseId!,
    process.env.NEXT_PUBLIC_APPWRITE_SCORES_COLLECTION_ID!,
    [
      Query.equal("school", school),
      Query.equal("grade", grade),
      Query.equal("section", section),
      Query.equal("zone", zone),
      Query.equal("assessment", assessment),
      Query.equal("testType", testType),
    ]
  );

  if (agg.documents.length === 0) {
    const overallDist = { beginner: 0, growth: 0, expert: 0 };
    overallDist[getLevel(overallScore)] = 1;

    const categoryDist: Record<string, Record<string, number>> = {};
    for (const [category, lvl] of Object.entries(categoryLevels)) {
      categoryDist[category] = { beginner: 0, growth: 0, expert: 0 };
      categoryDist[category][lvl] = 1;
    }

    await databases.createDocument(
      databaseId!,
      process.env.NEXT_PUBLIC_APPWRITE_SCORES_COLLECTION_ID!,
      "unique()",
      {
        school,
        grade,
        section,
        zone,
        assessment,
        testType,
        total_students: 1,
        overall_level_distribution: JSON.stringify(overallDist),
        category_level_distributions: JSON.stringify(categoryDist),
      }
    );

    agg = await databases.listDocuments(
      databaseId!,
      process.env.NEXT_PUBLIC_APPWRITE_SCORES_COLLECTION_ID!,
      [
        Query.equal("school", school),
        Query.equal("grade", grade),
        Query.equal("section", section),
        Query.equal("zone", zone),
        Query.equal("assessment", assessment),
        Query.equal("testType", testType),
      ]
    );
  }

  const doc = agg.documents[0];

  const newTotal = (doc.total_students || 0) + 1;

  const newOverall = incrementDistribution(
    JSON.parse(doc.overall_level_distribution || "{}"),
    getLevel(overallScore)
  );

  const newCategoryDist = incrementCategoryDistributions(
    JSON.parse(doc.category_level_distributions || "{}"),
    categoryLevels
  );

  await databases.updateDocument(
    databaseId!,
    process.env.NEXT_PUBLIC_APPWRITE_SCORES_COLLECTION_ID!,
    doc.$id,
    {
      total_students: newTotal,
      overall_level_distribution: JSON.stringify(newOverall),
      category_level_distributions: JSON.stringify(newCategoryDist),
    }
  );
};
