import { account } from "./appwrite";
import { ID } from "appwrite";

export interface TeacherInfo {
  teacherName: string;
  school: string;
  grade: string;
  section: string;
}

export interface AuthUser {
  $id: string;
  name?: string;
  email?: string;
  teacherInfo?: TeacherInfo;
}

export class AuthService {
  static async createAnonymousSession(
    teacherInfo?: TeacherInfo
  ): Promise<void> {
    try {
      await account.createAnonymousSession();

      // Store teacher info in localStorage if provided
      if (teacherInfo) {
        localStorage.setItem("teacherInfo", JSON.stringify(teacherInfo));
      }
    } catch (error) {
      console.error("Error creating anonymous session:", error);
      throw error;
    }
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const user = await account.get();

      // Get teacher info from localStorage
      const teacherInfoStr = localStorage.getItem("teacherInfo");
      const teacherInfo = teacherInfoStr
        ? JSON.parse(teacherInfoStr)
        : undefined;

      return {
        $id: user.$id,
        name: user.name,
        email: user.email,
        teacherInfo,
      };
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  static async deleteSession(sessionId: string): Promise<void> {
    try {
      await account.deleteSession(sessionId);
    } catch (error) {
      console.error("Error deleting session:", error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      await account.deleteSessions();
      // Clear teacher info from localStorage
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
