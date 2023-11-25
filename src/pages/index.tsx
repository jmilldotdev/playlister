import { useMusicKit } from "@/providers/MusicKitProvider";
import axios from "axios";
import { Inter } from "next/font/google";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { authorize, musicKitInstance, userToken, createPlaylist } =
    useMusicKit();
  const [collageId, setCollageId] = useState<string>("");
  const [currentAlbum, setCurrentAlbum] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [totalAlbums, setTotalAlbums] = useState<number>(0);

  async function processAlbum(album: string, index: number) {
    try {
      setCurrentAlbum(album);
      setCurrentIndex(index + 1);
      console.log(`Getting song for ${album}...`);
      const song = await getSongForAlbumArtist(album);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return song.id;
    } catch (error) {
      console.error(error);
    }
  }

  const fetchCollage = async () => {
    if (!collageId) return;
    try {
      console.log(collageId);
      const res = await axios.post(`/api/red`, {
        collageId,
      });
      const { name, description, albums } = res.data;
      console.log(albums);
      setTotalAlbums(albums.length);

      const playlistId = await createPlaylist(name, description);
      console.log(playlistId);

      // get a song for each album
      let songIds: string[] = [];
      for (const [index, album] of albums.entries()) {
        const songId = await processAlbum(album, index);
        songIds.push(songId);
      }

      // filter undefined
      songIds = songIds.filter((songId) => songId);
      console.log(songIds);

      // finally, add to playlist
      const addRes = await axios.post(`/api/playlist/addsongs`, {
        userToken,
        playlistId,
        songIds,
      });
      console.log(addRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getSongForAlbumArtist = async (albumArtist: string) => {
    try {
      const res = await musicKitInstance.api.search(albumArtist, {
        limit: 1,
        types: "albums",
      });
      const album = res.albums.data[0];
      const tracks = await musicKitInstance.api.album(album.id, {
        include: "tracks",
      });
      // pick a random track
      const randomTrack =
        tracks.relationships.tracks.data[
          Math.floor(Math.random() * tracks.relationships.tracks.data.length)
        ];
      return randomTrack;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <h1 className="text-4xl font-bold">Appsfly Music</h1>
      <button
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        onClick={authorize}
        disabled={userToken}
      >
        {userToken ? "Authorized" : "Authorize"}
      </button>
      <input
        className="border border-gray-400 rounded p-2 text-black"
        placeholder="Collage ID"
        value={collageId}
        onChange={(e) => setCollageId(e.target.value)}
      />
      <button
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        onClick={fetchCollage}
      >
        Fetch Collage
      </button>
      <div>
        {currentIndex > 0 && totalAlbums > 0 && (
          <p>
            Fetching {currentIndex} of {totalAlbums}... {currentAlbum}
          </p>
        )}
      </div>
    </main>
  );
}
