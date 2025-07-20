import { account } from "./appwrite";
import { ID } from "appwrite";

export interface AuthUser {
  $id: string;
  name?: string;
  phone?: string;
  email?: string;
}

export class AuthService {
  static async createPhoneSession(phone: string): Promise<void> {
    try {
      await account.createPhoneSession(ID.unique(), phone);
    } catch (error) {
      console.error("Error creating phone session:", error);
      throw error;
    }
  }

  static async updatePhoneSession(
    userId: string,
    secret: string
  ): Promise<void> {
    try {
      await account.updatePhoneSession(userId, secret);
    } catch (error) {
      console.error("Error updating phone session:", error);
      throw error;
    }
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const user = await account.get();
      return {
        $id: user.$id,
        name: user.name,
        phone: user.phone,
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
