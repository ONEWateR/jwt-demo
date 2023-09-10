import {NextApiRequest} from "next";

export function getCurrentUserByRequest(request: NextApiRequest): Promise<User | null> {
  try {
    return Promise.resolve(JSON.parse(<string>request.headers['current-user']))
  } catch(e) {
    console.error('[getCurrentUserByRequest] error', { headers: request.headers })
  }
  return Promise.resolve(null);
}