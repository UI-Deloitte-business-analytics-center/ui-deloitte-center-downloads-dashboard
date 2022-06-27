import React, { useEffect, useState } from "react";
import { retrieveSummary } from "../utils/retrieveSummary";
import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { Box, CircularProgress, Container } from "@mui/material";
import DownloadsSummary from "../components/DownloadsSummary";
import { IDownloadsSummary } from "../types/downloads-summary";
import GitHubIcon from "@mui/icons-material/GitHub";

const Home: NextPage = () => {
  const [summary, setSummary] = useState<IDownloadsSummary>(null);

  const initialize = async () => {
    const data = await retrieveSummary();

    console.log(data.dfCountries);

    setSummary(data);
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <>
      <Head>
        <title>UI-Deloitte Center Downloads Dashboard</title>
      </Head>

      <main className={styles.main}>
        <Container maxWidth="lg">
          <Box>
            <h1>📊 UI-Deloitte Center Downloads Summary</h1>
            <p className={styles.subtitle}>
              The summary here only includes unique downloads that have occured
              after the launch of the{" "}
              <a href="https://centerforanalytics.giesbusiness.illinois.edu/">
                new Center Website
              </a>
              . If a user downloads a material more than once, only the first
              download is counted.
            </p>
          </Box>

          {summary ? (
            <DownloadsSummary data={summary} />
          ) : (
            <Box className={styles.loadingBox}>
              <Box className={styles.progressWrapper}>
                <CircularProgress size={80} color="inherit" />
              </Box>

              <p className={styles.message}>Loading</p>
            </Box>
          )}

          <footer className={styles.siteFooter}>
            <Link href="https://github.com/UI-Deloitte-business-analytics-center/ui-deloitte-center-downloads-dashboard">
              <a className={styles.linkItem}>
                <GitHubIcon className={styles.icon} />
                <span>Source</span>
              </a>
            </Link>
          </footer>
        </Container>
      </main>
    </>
  );
};

export default Home;
