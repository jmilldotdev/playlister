import { getDeveloperToken } from "@/util/getDeveloperToken";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userToken, playlistId, songIds } = req.body;

  try {
    const token = getDeveloperToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Music-User-Token": userToken,
    };

    const songData = songIds.map((songId: string) => {
      return {
        id: songId,
        type: "songs",
      };
    });

    console.log(songData);

    const resp = await axios.post(
      `https://api.music.apple.com/v1/me/library/playlists/${playlistId}/tracks`,
      {
        data: songData,
      },
      { headers }
    );

    res.status(200).json({ data: resp.data });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}
