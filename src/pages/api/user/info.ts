import { NextApiRequest, NextApiResponse } from 'next';
import {getCurrentUserByRequest} from "../../../utils/index";

export default async (req: NextApiRequest, res: NextApiResponse<ServerData>) => {
  const user = await getCurrentUserByRequest(req);

  res.status(200).json({ data: user });
};