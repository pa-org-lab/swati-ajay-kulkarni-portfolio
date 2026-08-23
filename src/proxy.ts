// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  //   const token = req.cookies.get("auth-token")?.value
  //   if (req.nextUrl.pathname.startsWith("/admin") && !token) {
  //     return NextResponse.redirect(new URL("/login", req.url))
  //   }
  //   return NextResponse.next()
}

export const config = {
  //   matcher: ["/admin/:path*"],
};
