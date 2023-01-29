import Head from "next/head";
import styles from "./main-layout.module.css";
import utilStyles from "./../../styles/utils.module.css";
import Image from "next/image";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
  isHomePage?: boolean;
}

const headerTitle = "yactouat's personal website";
export const siteTitle = "yactouat.com";

export default function MainLayout({
  children,
  isHomePage = false,
}: LayoutProps) {
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
        <meta name="description" content={headerTitle} />
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
          {isHomePage ? (
            <>
              <Image
                priority
                src="/images/yactouat.jpg"
                className={utilStyles.borderCircle}
                height={144}
                width={144}
                alt="Yacine Touati"
              />
              <h1 className={utilStyles.heading2Xl}>{headerTitle}</h1>
            </>
          ) : (
            <>
              <Link href="/">
                <Image
                  priority
                  src="/images/yactouat.jpg"
                  className={utilStyles.borderCircle}
                  height={108}
                  width={108}
                  alt=""
                />
              </Link>
              <h2 className={utilStyles.headingLg}>
                <Link href="/">{headerTitle}</Link>
              </h2>
            </>
          )}
        </header>
        <main>{children}</main>
        {!isHomePage && (
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
