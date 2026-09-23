export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    // Protect all routes except login, register, and API auth routes
    "/((?!login|register|api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
