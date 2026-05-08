import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("__session");

  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (token && request.nextUrl.pathname.startsWith("/dashboard")) {
    const verifyUrl = new URL("/api/auth/session", request.url);
    const verifyRes = await fetch(verifyUrl, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    if (!verifyRes.ok) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      const response = NextResponse.redirect(url);
      response.cookies.delete("__session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
