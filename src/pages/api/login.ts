import { NextApiRequest, NextApiResponse } from 'next';
import md5 from 'md5';
import {generateTokenByUser} from "@/lib/auth";
import {AuthCode} from "../../lib/constants";

const DEFAULT_PASSWORD = md5('111');

// 这里模拟账号密码验证
const mockVerify = (username: string, password: string): Promise<User> | null => {
  if (username === 'admin' && password === DEFAULT_PASSWORD) {
    return Promise.resolve({ userId: 'adminMock', role: ['admin'] });
  }
  if (username === 'user' && password === DEFAULT_PASSWORD) {
    return Promise.resolve({ userId: 'userMock', role: ['user'] });
  }

  return Promise.reject(new Error('not found'));
}

export default async (req: NextApiRequest, res: NextApiResponse<ServerData>) => {
  const { username, password } = req.body;

  try {
    const user = await mockVerify(username, password);
    const token = await generateTokenByUser(user)
    res.status(200).json({ data: { token, ...user } });
  } catch (e) {
    res.status(401).json({code: AuthCode.INCORRECT_CREDENTIALS, message: '账号密码错误'});
  }
};