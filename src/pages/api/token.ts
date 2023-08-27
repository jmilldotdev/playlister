// pages/api/token.ts

import { getDeveloperToken } from "@/util/getDeveloperToken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const token = getDeveloperToken();

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}
