import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_TASKS, TASK_INIT_FLAG_KEY, TASKS_STORAGE_KEY } from "./src/lib/constants";


export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const hasInitFlag = request.cookies.has(TASK_INIT_FLAG_KEY);
  const hasTasks = request.cookies.has(TASKS_STORAGE_KEY);

  if (!hasInitFlag) {
    response.cookies.set(TASK_INIT_FLAG_KEY, "true", {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    if (!hasTasks) {
      response.cookies.set(TASKS_STORAGE_KEY, JSON.stringify(DEFAULT_TASKS), {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }
  }

  return response;
}

export const config = {
  matcher: "/:path*",
};


