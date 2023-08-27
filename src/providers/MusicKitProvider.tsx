import setupMusicKit from "@/util/setupMusicKit";
import axios from "axios";
import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  PropsWithChildren,
} from "react";

interface IMusicKitContext {
  musicKitInstance?: any;
  developerToken?: string;
  userToken?: string;
  authorize: () => void;
  createPlaylist: () => void;
}

const MusicKitContext = createContext<IMusicKitContext>({
  musicKitInstance: undefined,
  developerToken: undefined,
  userToken: undefined,
  authorize: () => {},
  createPlaylist: () => {},
});

export const MusicKitProvider = ({ children }: PropsWithChildren) => {
  const [musicKitInstance, setMusicKitInstance] = useState<any | undefined>(
    undefined
  );
  const [developerToken, setDeveloperToken] = useState(undefined);
  const [userToken, setUserToken] = useState(undefined);

  useEffect(() => {
    const setup = async () => {
      const response = await axios.get("/api/token");
      const { token } = response.data;
      setDeveloperToken(token);
      const mkResult = await setupMusicKit(token);
      setMusicKitInstance(mkResult);
    };

    setup();
  }, []);

  const authorize = async () => {
    if (!musicKitInstance) return;
    const token = await musicKitInstance.authorize();
    setUserToken(token);
  };

  const createPlaylist = async (name: string, description: string) => {
    if (!musicKitInstance || !userToken) return;
    try {
      const res = await axios.post("/api/playlist/create", {
        userToken,
        name,
        description,
      });
      const { playlistId } = res.data;
      return playlistId;
    } catch (err) {
      console.log(err);
    }
  };

  if (!musicKitInstance) {
    return <div>Loading...</div>;
  }

  const value = {
    musicKitInstance,
    userToken,
    developerToken,
    authorize,
    createPlaylist,
  };

  return (
    <MusicKitContext.Provider value={value}>
      {children}
    </MusicKitContext.Provider>
  );
};

export const useMusicKit = (): any => {
  const context = useContext(MusicKitContext);
  if (context === undefined) {
    throw new Error("useMusicKit must be used within a MusicKitProvider");
  }
  return context;
};
