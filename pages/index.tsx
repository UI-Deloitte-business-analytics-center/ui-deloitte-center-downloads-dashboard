import type { NextPage, GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { Box, Container, Typography } from "@mui/material";
import {
  VictoryBar,
  VictoryPie,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryStack,
  VictoryLabel,
} from "victory";
import { GridColDef } from "@mui/x-data-grid";
import { retrieveSummary } from "../utils/retrieveSummary";
const SummaryDataGrid = dynamic(() => import("../components/SummaryDataGrid"), {
  ssr: false,
});

const Home: NextPage = (props: any) => {
  const {
    dfByContent,
    dfByContentType,
    dfByMemberType,
    dfByUniversity,
    dfByYearMonth,
  } = props;

  const dfByContentColumns: GridColDef[] = [
    { field: "title", headerName: "Content Title", width: 400 },
    { field: "downloadCount", headerName: "Unique Downloads", width: 150 },
    { field: "university", headerName: "Universities", width: 150 },
    { field: "country", headerName: "Countries", width: 150 },
    { field: "state", headerName: "States (US)", width: 150 },
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>UI-Deloitte Center Dashboard</title>
      </Head>

      <main className={styles.main}>
        <Container maxWidth="lg">
          <Box>
            <h1>UI-Deloitte Center Downloads Summary</h1>
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

          <SummaryDataGrid
            title="Stats by Distributed Content"
            data={dfByContent}
            columns={dfByContentColumns}
          />

          <Box>
            <VictoryChart domainPadding={20} height={800}>
              <VictoryAxis
                width={200}
                tickLabelComponent={
                  <VictoryLabel verticalAnchor="middle" textAnchor="start" />
                }
                style={{
                  tickLabels: {
                    fontSize: 10,
                  },
                }}
              />
              {/* <VictoryAxis dependentAxis tickValues={dfByContent["title"]} /> */}
              <VictoryBar
                horizontal={true}
                data={dfByContent}
                y={"downloadCount"}
                x={"title"}
              />
            </VictoryChart>
          </Box>

          <Box>
            <VictoryPie />
          </Box>

          <Box>
            <pre>{JSON.stringify(props, null, 2)}</pre>
          </Box>
        </Container>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const summary = retrieveSummary();

  return {
    props: summary,
  };
};

export default Home;
