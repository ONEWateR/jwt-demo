interface User {
  userId: string;
  role: string[];
}

type Data = any;

interface ServerData<T = any> {
  code?: number;
  success?: boolean;
  data?: T;
  message?: string;
}

enum AuthErrorCode {
  /**
   * 缺少 token 或 token 过期、无效
   */
  INVALID_TOKEN = 4011,
  /**
   * 验证失败，账号密码错误
   */
  INCORRECT_CREDENTIALS = 4012,
}