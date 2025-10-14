import { NextResponse, NextRequest } from 'next/server'
import { auth } from "@/auth";


const protectedRoutes = ['/admin'];
const authRoutes = ['/signin', '/signup'];
const publicRoutes = ['/', '/alphabet', '/chapter', '/vocabulary'];

export default auth(async function middleware(req: NextRequest) {
    const session = await (auth)();
    const path = req.nextUrl.pathname

    if (!session) {
        if (protectedRoutes.some(route => path.startsWith(route))) {
            return NextResponse.redirect(new URL("/signin", req.nextUrl));
        }
        if (path === '/') {
            return NextResponse.redirect(new URL("/alphabet", req.nextUrl));
        }
        return NextResponse.next()
    }

    if (session) {
        if (publicRoutes.includes(path) || authRoutes.includes(path)) {
            return NextResponse.redirect(new URL("/admin", req.nextUrl));
        }
        return NextResponse.next();
    }


    return NextResponse.next()
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
    runtime: 'nodejs',
}