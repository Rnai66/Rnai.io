import { getAdminAuth } from "./admin";

export async function verifyToken(authHeader: string | null, sessionCookie?: string | null): Promise<string | null> {
  try {
    const adminAuth = getAdminAuth();
    
    // If session cookie is provided, verify it first
    if (sessionCookie) {
      const decodedSession = await adminAuth.verifySessionCookie(sessionCookie, true);
      if (decodedSession) return decodedSession.uid;
    }
    
    // Fallback to Bearer token
    if (authHeader?.startsWith("Bearer ")) {
      const decoded = await adminAuth.verifyIdToken(authHeader.slice(7));
      return decoded.uid;
    }
    
    return null;
  } catch {
    return null;
  }
}

