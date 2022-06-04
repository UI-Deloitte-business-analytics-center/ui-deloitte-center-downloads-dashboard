import React from "react";
import type { NextPage, GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { Box, Container, Typography, Tabs, Tab } from "@mui/material";
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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Home: NextPage = (props: any) => {
  const {
    dfByContent,
    dfByContentType,
    dfByMemberType,
    dfByUniversity,
    dfByYearMonth,
  } = props;

  const [tabIndex, setTabIndex] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newTabIndex: number) => {
    setTabIndex(newTabIndex);
  };

  const dfByContentColumns: GridColDef[] = [
    { field: "title", headerName: "Content Title", width: 400 },
    { field: "downloadCount", headerName: "Unique Downloads", width: 200 },
    { field: "university", headerName: "Universities", width: 150 },
    { field: "country", headerName: "Countries", width: 150 },
    { field: "state", headerName: "States (US)", width: 150 },
  ];

  const dfByContentTypeColumns: GridColDef[] = [
    { field: "typePlural", headerName: "Content Type", width: 400 },
    { field: "downloadCount", headerName: "Unique Downloads", width: 200 },
    { field: "numMaterials", headerName: "Number of Items", width: 200 },
  ];

  const dfByMemberTypeColumns: GridColDef[] = [
    { field: "memberType", headerName: "Member Type", width: 400 },
    { field: "downloadCount", headerName: "Unique Downloads", width: 200 },
  ];

  const dfByUniversityColumns: GridColDef[] = [
    { field: "university", headerName: "University", width: 400 },
    { field: "downloadCount", headerName: "Unique Downloads", width: 200 },
  ];

  const dfByYearMonthColumns: GridColDef[] = [
    { field: "yearMonth", headerName: "Year-Month", width: 400 },
    { field: "downloadCount", headerName: "Unique Downloads", width: 200 },
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>UI-Deloitte Center Dashboard</title>
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

          <Box className={styles.tabsWrapper}>
            <Tabs
              value={tabIndex}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Content" {...a11yProps(0)} />
              <Tab label="Content Type" {...a11yProps(1)} />
              <Tab label="Member Type" {...a11yProps(2)} />
              <Tab label="University" {...a11yProps(1)} />
              <Tab label="Monthly" {...a11yProps(2)} />
            </Tabs>
          </Box>

          <Box>
            {tabIndex === 0 && (
              <SummaryDataGrid
                title="Downloads by Distributed Content"
                data={dfByContent}
                columns={dfByContentColumns}
              />
            )}
            {tabIndex === 1 && (
              <SummaryDataGrid
                title="Downloads by Content Type"
                height={400}
                data={dfByContentType}
                columns={dfByContentTypeColumns}
              />
            )}
            {tabIndex === 2 && (
              <SummaryDataGrid
                title="Downloads by Member Type"
                height={455}
                data={dfByMemberType}
                columns={dfByMemberTypeColumns}
              />
            )}
            {tabIndex === 3 && (
              <SummaryDataGrid
                title="Downloads by University (Top 100)"
                data={dfByUniversity}
                columns={dfByUniversityColumns}
              />
            )}
            {tabIndex === 4 && (
              <SummaryDataGrid
                title="Monthly Downloads"
                data={dfByYearMonth}
                columns={dfByYearMonthColumns}
              />
            )}
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
