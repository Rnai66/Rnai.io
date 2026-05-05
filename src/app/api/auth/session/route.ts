import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: "No ID token provided" }, { status: 401 });
    }

    const adminAuth = getAdminAuth();
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Initialize user doc if it doesn't exist
    const db = getAdminDb();
    const userRef = db.collection("users").doc(decodedToken.uid);
    const userDoc = await userRef.get();
    
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

    // Set session expiration to 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    
    // Create the session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    
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
