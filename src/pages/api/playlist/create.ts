import { getDeveloperToken } from "@/util/getDeveloperToken";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userToken, name, description } = req.body;

  try {
    const token = getDeveloperToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Music-User-Token": userToken,
    };

    const resp = await axios.post(
      "https://api.music.apple.com/v1/me/library/playlists",
      {
        attributes: {
          name: `Playlister - RED - ${name}`,
          description,
        },
      },
      { headers }
    );
    const playlistId = resp.data.data[0].id;

    res.status(200).json({ playlistId });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}
