import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("__session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const decodedSession = await getAdminAuth().verifySessionCookie(sessionCookie, true);
    return NextResponse.json({
      authenticated: true,
      uid: decodedSession.uid,
      email: decodedSession.email || null,
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: "No ID token provided" }, { status: 401 });
    }

    const adminAuth = getAdminAuth();
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    const db = getAdminDb();
    const userRef = db.collection("users").doc(decodedToken.uid);

    // Set session expiration to 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    // The Firestore "does this user doc exist" check and minting the
    // session cookie are independent of each other (both only need the
    // already-verified idToken/uid) — run them in parallel instead of one
    // after another. This was the biggest chunk of the "login takes
    // forever" latency: every login paid for both round-trips in serial
    // even though neither depends on the other's result.
    const [userDoc, sessionCookie] = await Promise.all([
      userRef.get(),
      adminAuth.createSessionCookie(idToken, { expiresIn }),
    ]);

    // First-time login only: grant the free-credit welcome bonus.
    if (!userDoc.exists) {
      await userRef.set({
        email: decodedToken.email,
        freeCreditsRemaining: 200,
        paidCreditsBalance: 0,
        autoRechargeEnabled: false,
        createdAt: new Date(),
      });
      await db.collection("ledgerEntries").add({
        uid: decodedToken.uid,
        type: "free_grant",
        credits: 200,
        balanceAfter: 200,
        ref: "signup",
        createdAt: new Date(),
      });
    }

    const response = NextResponse.json({ status: "success" }, { status: 200 });
    
    // Set the cookie with httpOnly and secure flags
    response.cookies.set("__session", sessionCookie, {
      maxAge: 60 * 60 * 24 * 5, // 5 days in seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Error creating session cookie:", error);
    return NextResponse.json({ error: "Unauthorized request" }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ status: "success" }, { status: 200 });
  response.cookies.delete("__session");
  return response;
}
