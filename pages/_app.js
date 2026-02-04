import Head from "next/head";
import 'semantic-ui-css/semantic.min.css'

function MyApp({ Component, pageProps }) {
  return <>
    <Head>
      <link rel="manifest" href="/popn-sudden/manifest.json" />
      <meta name="theme-color" content="#000000" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      />
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
    </Head>
    <Component {...pageProps} />
  </>;
}

export default MyApp;
