import React from "react";
import type { NextPage, GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { Box, Container, Tabs, Tab } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { retrieveSummary } from "../utils/retrieveSummary";
import {
  IContentDownloadSummary,
  IContentTypeDownloadsSummary,
  IMemberTypeDownloadsSummary,
  IUniversityDownloadsSummary,
  IYearMonthDownloadsSummary,
} from "../types/downloads-summary";
import SummaryBarChart from "../components/SummaryCharts/SummaryBarChart";
import SummaryLineChart from "../components/SummaryCharts/SummaryLineChart";
import SummaryPieChart from "../components/SummaryCharts/SummaryPieChart";
const SummaryDataGrid = dynamic(() => import("../components/SummaryDataGrid"), {
  ssr: false,
});

function getTabProps(index: number) {
  return {
    id: `summary-tab-${index}`,
  };
}

interface IHomePageProps {
  dfByContent: IContentDownloadSummary[];
  dfByContentType: IContentTypeDownloadsSummary[];
  dfByMemberType: IMemberTypeDownloadsSummary[];
  dfByUniversity: IUniversityDownloadsSummary[];
  dfByYearMonth: IYearMonthDownloadsSummary[];
}

const Home: NextPage = (props: IHomePageProps) => {
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
              aria-label="summary criteria tabs"
            >
              <Tab label="Content" {...getTabProps(0)} />
              <Tab label="Content Type" {...getTabProps(1)} />
              <Tab label="Member Type" {...getTabProps(2)} />
              <Tab label="University" {...getTabProps(3)} />
              <Tab label="Monthly" {...getTabProps(4)} />
            </Tabs>
          </Box>

          <Box>
            {tabIndex === 0 && (
              <Box className={styles.tabContent}>
                <h2>Downloads by Distributed Content</h2>

                <SummaryBarChart
                  height={1200}
                  tickWidth={340}
                  data={dfByContent}
                  xDataKey="downloadCount"
                  yDataKey="title"
                />

                <SummaryDataGrid
                  data={dfByContent}
                  columns={dfByContentColumns}
                />
              </Box>
            )}
            {tabIndex === 1 && (
              <Box className={styles.tabContent}>
                <h2>Downloads by Content Type</h2>

                <SummaryPieChart
                  data={dfByContentType}
                  dataKey="downloadCount"
                  nameKey="typePlural"
                />

                <SummaryDataGrid
                  height={400}
                  data={dfByContentType}
                  columns={dfByContentTypeColumns}
                />
              </Box>
            )}
            {tabIndex === 2 && (
              <Box className={styles.tabContent}>
                <h2>Downloads by Member Type</h2>

                <SummaryPieChart
                  data={dfByMemberType}
                  dataKey="downloadCount"
                  nameKey="memberType"
                />

                <SummaryDataGrid
                  height={455}
                  data={dfByMemberType}
                  columns={dfByMemberTypeColumns}
                />
              </Box>
            )}
            {tabIndex === 3 && (
              <Box className={styles.tabContent}>
                <h2>Downloads by University (Top 100)</h2>

                <SummaryBarChart
                  height={4000}
                  tickWidth={340}
                  data={dfByUniversity}
                  xDataKey="downloadCount"
                  yDataKey="university"
                />

                <SummaryDataGrid
                  data={dfByUniversity}
                  columns={dfByUniversityColumns}
                />
              </Box>
            )}
            {tabIndex === 4 && (
              <Box className={styles.tabContent}>
                <h2>Monthly Downloads</h2>

                <SummaryLineChart
                  data={dfByYearMonth}
                  height={500}
                  xDataKey="yearMonth"
                  yDataKey="downloadCount"
                />

                <SummaryDataGrid
                  data={dfByYearMonth}
                  columns={dfByYearMonthColumns}
                />
              </Box>
            )}
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
