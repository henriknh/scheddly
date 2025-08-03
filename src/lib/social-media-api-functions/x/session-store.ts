// Simple in-memory session store for PKCE code verifiers
// In production, use Redis or a database for persistence

interface SessionData {
  codeVerifier: string;
  brandId?: string;
  timestamp: number;
}

class SessionStore {
  private sessions = new Map<string, SessionData>();
  private readonly SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes

  setSession(state: string, codeVerifier: string, brandId?: string): void {
    this.sessions.set(state, {
      codeVerifier,
      brandId,
      timestamp: Date.now(),
    });
  }

  getSession(state: string): SessionData | null {
    const session = this.sessions.get(state);
    if (!session) return null;

    // Check if session has expired
    if (Date.now() - session.timestamp > this.SESSION_TIMEOUT) {
      this.sessions.delete(state);
      return null;
    }

    return session;
  }

  deleteSession(state: string): void {
    this.sessions.delete(state);
  }

  // Clean up expired sessions
  cleanup(): void {
    const now = Date.now();
    for (const [state, session] of this.sessions.entries()) {
      if (now - session.timestamp > this.SESSION_TIMEOUT) {
        this.sessions.delete(state);
      }
    }
  }
}

export const sessionStore = new SessionStore();

// Clean up expired sessions every 5 minutes
if (typeof window === 'undefined') {
  setInterval(() => {
    sessionStore.cleanup();
  }, 5 * 60 * 1000);
}