import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'
import {verifyToken} from './lib/auth'
import {AuthCode} from "./lib/constants";

// 不检查 token 的 api 地址
const NOT_VERIFY_TOKEN_URLS = ['/api/login']

export async function middleware(request: NextRequest) {
  if (NOT_VERIFY_TOKEN_URLS.some(url => request.nextUrl.pathname.startsWith(url))) {
    return NextResponse.next();
  }

  try {
    const user = await verifyToken(request);
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('current-user', JSON.stringify(user))

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch(e) {
    // @ts-ignore
    return NextResponse.json({ code: e.code, message: e.message }, {status: 401})
  }
}

export const config = {
  matcher: '/api/:function*',
}