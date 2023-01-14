import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        {/* the tag below is necessary to make the whole shabang work */}
        <NextScript />
      </body>
    </Html>
  );
}
