import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getPublicEnv } from "@/lib/env";

const LOGIN_PATH = "/login";

export async function updateSession(request: NextRequest) {
    const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = getPublicEnv();
    let response = NextResponse.next({ request });

    const supabase = createServerClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
            getAll: () => request.cookies.getAll(),
            setAll: (cookiesToSet, headers) => {
                cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                response = NextResponse.next({ request });
                cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
                Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
            },  
        },
    });

    const {
        data: { user },
    } = await supabase.auth.getUser();
    const { pathname } = request.nextUrl;

    if (user || pathname === LOGIN_PATH) return response;
    if (pathname.startsWith("/api/")) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = LOGIN_PATH;
    loginUrl.search = "";
    return NextResponse.redirect(loginUrl);
}