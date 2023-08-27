import { MusicKitProvider } from "@/providers/MusicKitProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MusicKitProvider>
      <Component {...pageProps} />
    </MusicKitProvider>
  );
}
