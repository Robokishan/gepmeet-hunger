import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { cookies } = req;
  const res = NextResponse.next();
  const url = req.url;
  //   const idOldLogin = req.nextUrl.searchParams.get("oldlogin");
  //   const paramToken = req.nextUrl.searchParams.get("token");
  //   if (!idOldLogin) {

  if (
    !cookies.token &&
    // !url.includes("token") &&
    !url.includes("/auth") &&
    !url.includes(".ico") &&
    !url.includes(".png")
  ) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  //   } else if (url.includes("token")) {
  //     return NextResponse.redirect("/partner/home").cookie("lmtoken", paramToken);
  //   } else if (url.includes("/auth") && cookies.lmtoken) {
  //     return NextResponse.redirect("/");
  //   }

  return res;
}
