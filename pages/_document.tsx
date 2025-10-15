import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
        <meta name="description" content="Crystal-clear audio communication with LiveKit" />
        <meta name="theme-color" content="#0071e3" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
