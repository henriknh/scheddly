"use server";

import prisma from "@/lib/prisma";

interface SessionData {
  codeVerifier: string;
  brandId?: string;
  timestamp: number;
}

class ProductionSessionStore {
  private readonly SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes
  private inMemorySessions = new Map<string, SessionData>();

  async setSession(state: string, codeVerifier: string, brandId?: string): Promise<void> {
    if (!state || !codeVerifier) {
      throw new Error("State and code verifier are required");
    }

    const sessionData = {
      codeVerifier,
      brandId,
      timestamp: Date.now(),
    };

    // Try database first, fallback to in-memory
    try {
      const expiresAt = new Date(Date.now() + this.SESSION_TIMEOUT);
      await prisma.session.upsert({
        where: { state },
        update: {
          codeVerifier,
          brandId,
          expiresAt,
        },
        create: {
          state,
          codeVerifier,
          brandId,
          expiresAt,
        },
      });
    } catch (error) {
      // Fallback to in-memory storage
      console.warn("Database session storage failed, using in-memory fallback:", error);
      this.inMemorySessions.set(state, sessionData);
    }
  }

  async getSession(state: string): Promise<SessionData | null> {
    if (!state) {
      return null;
    }

    // Try database first
    try {
      const session = await prisma.session.findUnique({
        where: { state },
      });

      if (session) {
        // Check if session has expired
        if (session.expiresAt < new Date()) {
          await this.deleteSession(state);
          return null;
        }

        return {
          codeVerifier: session.codeVerifier,
          brandId: session.brandId || undefined,
          timestamp: session.createdAt.getTime(),
        };
      }
    } catch (error) {
      console.warn("Database session retrieval failed, trying in-memory:", error);
    }

    // Fallback to in-memory storage
    const session = this.inMemorySessions.get(state);
    if (!session) {
      return null;
    }

    // Check if session has expired
    if (Date.now() - session.timestamp > this.SESSION_TIMEOUT) {
      this.inMemorySessions.delete(state);
      return null;
    }

    return session;
  }

  async deleteSession(state: string): Promise<void> {
    if (!state) {
      return;
    }

    // Try database first
    try {
      await prisma.session.deleteMany({
        where: { state },
      });
    } catch (error) {
      console.warn("Database session deletion failed:", error);
    }

    // Also clean up in-memory
    this.inMemorySessions.delete(state);
  }

  // Clean up expired sessions
  async cleanup(): Promise<void> {
    // Clean up database sessions
    try {
      await prisma.session.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });
    } catch (error) {
      console.warn("Database session cleanup failed:", error);
    }

    // Clean up in-memory sessions
    const now = Date.now();
    for (const [state, session] of this.inMemorySessions.entries()) {
      if (now - session.timestamp > this.SESSION_TIMEOUT) {
        this.inMemorySessions.delete(state);
      }
    }
  }

  // Get session count for monitoring
  async getSessionCount(): Promise<number> {
    let dbCount = 0;
    try {
      dbCount = await prisma.session.count();
    } catch (error) {
      console.warn("Failed to get database session count:", error);
    }
    return dbCount + this.inMemorySessions.size;
  }
}

export const productionSessionStore = new ProductionSessionStore();

// Clean up expired sessions every 5 minutes
if (typeof window === 'undefined') {
  setInterval(async () => {
    try {
      await productionSessionStore.cleanup();
    } catch (error) {
      console.error('Failed to cleanup expired sessions:', error);
    }
  }, 5 * 60 * 1000);
}