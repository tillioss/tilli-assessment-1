import { account, databases } from "./appwrite";
import { TeacherInfo } from "@/types";

export interface AuthUser {
  $id: string;
  name?: string;
  email?: string;
  teacherInfo?: TeacherInfo;
}

export class AuthService {
  static async login(teacherInfo: TeacherInfo): Promise<void> {
    try {
      const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
      const teachersCollectionId =
        process.env.NEXT_PUBLIC_TEACHERS_COLLECTION_ID;

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
          createdAt: new Date().toISOString(),
        }
      );

      // Store session and teacher info in localStorage
      localStorage.setItem("sessionId", teacherDoc.$id);
      localStorage.setItem("teacherInfo", JSON.stringify(teacherInfo));
    } catch (error) {
      console.error("Error creating teacher session:", error);
      throw error;
    }
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      // Check if there's an active session
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        return null;
      }

      // Get teacher info from localStorage
      const teacherInfoStr = localStorage.getItem("teacherInfo");
      const teacherInfo = teacherInfoStr
        ? JSON.parse(teacherInfoStr)
        : undefined;

      if (!teacherInfo) {
        return null;
      }

      return {
        $id: sessionId,
        name: "Teacher",
        teacherInfo,
      };
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  static async logout(): Promise<void> {
    try {
      // Clear session and teacher info from localStorage
      localStorage.removeItem("sessionId");
      localStorage.removeItem("teacherInfo");
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }

  static isAuthenticated(): boolean {
    try {
      // Check if there's an active session
      return !!localStorage.getItem("sessionId");
    } catch (error) {
      return false;
    }
  }
}
