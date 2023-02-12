import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import styles from "./main-layout.module.css";
import utilStyles from "./../../styles/utils.module.css";
import MainLayoutProps from "./MainLayoutProps";

const homeHeaderTitle = "yactouat's personal website";
const profileHeaderTitle = "your private profile page";
export const siteTitle = "yactouat.com";

export default function MainLayout({
  children,
  page: page = undefined,
}: MainLayoutProps) {
  return (
    <>
      <Head>
        {/* TODO add favicon, og:image, and a twitter card meta here */}
        {/* example OpenGraph image
          <meta
            property="og:image"
            content={`https://og-image.vercel.app/${encodeURI(
              siteTitle,
            )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
          />
        */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={homeHeaderTitle} />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff"></meta>
      </Head>
      <div className={styles.container}>
        <header className={styles.header}>
          {page && page == "home" && (
            <>
              <Image
                priority
                src="/images/yactouat.jpg"
                className={utilStyles.borderCircle}
                height={144}
                width={144}
                alt="Yacine Touati"
              />
              <h1 className={utilStyles.heading2Xl}>{homeHeaderTitle}</h1>
            </>
          )}
          {page && page == "profile" && (
            <>
              <div className={styles.svg}>
                {/* TODO image should be white on dark mode */}
                <svg
                  height="48"
                  viewBox="0 0 48 48"
                  width="48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m0 0h48v48h-48z" fill="none" />
                  <path d="m24 2a22 22 0 1 0 22 22 21.9 21.9 0 0 0 -22-22zm0 8a8 8 0 1 1 -8 8 8 8 0 0 1 8-8zm0 32a18.2 18.2 0 0 1 -12.2-4.8 26.4 26.4 0 0 1 12.2-3.2 26.4 26.4 0 0 1 12.2 3.2 18.2 18.2 0 0 1 -12.2 4.8z" />
                </svg>
              </div>
              <h1 className={utilStyles.heading2Xl}>{profileHeaderTitle}</h1>
            </>
          )}
          {!page && (
            <>
              <Link href="/">
                <Image
                  priority
                  src="/images/yactouat.jpg"
                  className={utilStyles.borderCircle}
                  height={108}
                  width={108}
                  alt="Yacine Touati"
                />
              </Link>
              <h2 className={utilStyles.headingLg}>
                <Link href="/">{homeHeaderTitle}</Link>
              </h2>
            </>
          )}
        </header>
        <main>{children}</main>
        {page != "home" && (
          <div className={styles.backToHomeLink}>
            {/* 
              using`Link` here allows to perform client-side navigation, 
              it also triggers pre fetching browser features in production builds 
            */}
            <Link href="/">← Back to home</Link>
          </div>
        )}
      </div>
    </>
  );
}
