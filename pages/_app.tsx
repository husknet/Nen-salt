import type { AppProps } from "next/app";
import "../styles/globals.css"; // ✅ Import Tailwind CSS globally

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
