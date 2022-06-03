import type { NextPage } from "next";
import * as dfd from "danfojs-node";
import Head from "next/head";
import styles from "../styles/Home.module.css";

interface MainPageProps {
  a: any;
}

const Home: NextPage<MainPageProps> = ({ a }: { a: any }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>UI-Deloitte Center Dashboard</title>
        <meta
          name="description"
          content="See a summary of UI-Deloitte Center material distribution"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <pre>{JSON.stringify(a, null, 2)}</pre>
      </main>
    </div>
  );
};

export async function getServerSideProps(context) {
  const res = await fetch(
    `https://centerforanalytics.giesbusiness.illinois.edu/_functions/downloads_summary`
  );
  const data = await res.json();

  return {
    props: {
      a: data,
    },
  };
}

export default Home;
