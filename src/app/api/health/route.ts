import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

export async function GET(req: NextRequest) {
  try {
    // Test Firebase Admin initialization
    const auth = getAdminAuth();
    const db = getAdminDb();

    // Test Firestore connection
    const testDoc = await db.collection("_health").doc("test").get();

    return NextResponse.json({
      status: "ok",
      firebase: {
        admin_auth_initialized: !!auth,
        firestore_initialized: !!db,
        firestore_readable: true,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Health check failed:", errorMessage);

    return NextResponse.json(
      {
        status: "error",
        error: errorMessage,
        details: {
          firebase_admin_project_id: process.env.FIREBASE_ADMIN_PROJECT_ID ? "set" : "missing",
          firebase_admin_client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL ? "set" : "missing",
          firebase_admin_private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY ? "set" : "missing",
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
