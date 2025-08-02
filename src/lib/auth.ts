import { account } from "./appwrite";
import { ID } from "appwrite";

export interface AuthUser {
  $id: string;
  name?: string;
  email?: string;
}

export class AuthService {
  static async createAnonymousSession(): Promise<void> {
    try {
      await account.createAnonymousSession();
    } catch (error) {
      console.error("Error creating anonymous session:", error);
      throw error;
    }
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const user = await account.get();
      return {
        $id: user.$id,
        name: user.name,
        email: user.email,
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
