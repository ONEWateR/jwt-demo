import {NextRequest} from 'next/server'
import {jwtVerify, SignJWT} from 'jose'
import {AuthCode} from "./constants";

class AuthError extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

const JWT_SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

async function generateTokenByUser(user: User): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(JSON.stringify(user))
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(JWT_SECRET_KEY)
}

async function verifyToken(request: NextRequest): Promise<User | null> {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthError(AuthCode.MISS_TOKEN, '缺少 token')
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new AuthError(AuthCode.MISS_TOKEN, '缺少 token')
  }

  try {
    const verified = await jwtVerify(token, JWT_SECRET_KEY)
    const user = JSON.parse(verified.payload.jti || '') as User;
    return user
  } catch (error) {
    console.error('jwtVerify 错误：', error)
  }

  throw new AuthError(AuthCode.INVALID_TOKEN, 'token 过期')
}

export {
  verifyToken,
  generateTokenByUser,
}