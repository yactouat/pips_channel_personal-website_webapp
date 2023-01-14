// this is where you would add global CSS that needs to be loaded on every page
import "@/styles/global.css";
import type { AppProps } from "next/app";

/**
 *
 * top level component that wrapes all the pages of the app
 *
 * you can use this component to keep state when navigating between pages
 *
 * @param {AppProps}
 * @returns {JSX.Element}
 */
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
