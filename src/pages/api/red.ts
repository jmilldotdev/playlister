import axios from "axios";
import he from "he";
import { NextApiRequest, NextApiResponse } from "next";

// Define the CollageResponse and related types. Adapt as needed to match your actual JSON structure.
interface Artist {
  name: string;
}

interface MusicInfo {
  artists: Artist[];
}

interface TorrentGroup {
  name: string;
  musicInfo: MusicInfo;
}

interface ResponseData {
  name: string;
  description: string;
  torrentgroups: TorrentGroup[];
}

interface CollageResponse {
  response: ResponseData;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { collageId } = req.body;
  const RED_KEY = process.env.RED_KEY as string;

  try {
    const headers = {
      Authorization: `${RED_KEY}`,
    };

    const response = await axios.get(
      `https://redacted.ch/ajax.php?action=collage&id=${collageId}`,
      { headers }
    );

    const data: CollageResponse = response.data;

    // Parse response data
    const albums: string[] = [];
    for (const tg of data.response.torrentgroups) {
      const album = tg.name;
      const artist = tg.musicInfo.artists[0].name;
      const decoded = he.decode(decodeURIComponent(album));
      albums.push(`${artist} - ${decoded}`);
    }

    res.status(200).json({
      name: he.decode(data.response.name),
      description: he.decode(data.response.description),
      albums,
    });
  } catch (err) {
    console.error("Error decoding JSON: ", err);
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}
