import "../styles/globals.css";
import type { AppType } from "next/dist/shared/lib/utils";

export async function getStaticProps() {
  return {
    props: { message: `Next.js is awesome` }, // will be passed to the page component as props
  };
}

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default MyApp;
