import React from "react";
import dynamic from "next/dynamic";
import styles from "./DownloadsSummary.module.scss";
import { Box, Tabs, Tab } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import SummaryBarChart from "../SummaryCharts/SummaryBarChart";
import SummaryLineChart from "../SummaryCharts/SummaryLineChart";
import SummaryPieChart from "../SummaryCharts/SummaryPieChart";
const SummaryDataGrid = dynamic(() => import("../SummaryDataGrid"), {
  ssr: false,
});

function getTabProps(index: number) {
  return {
    id: `summary-tab-${index}`,
  };
}
import { IDownloadsSummary } from "../../types/downloads-summary";

interface IDownloadsSummaryProps {
  data: IDownloadsSummary;
}

export default function DownloadsSummary(props: IDownloadsSummaryProps) {
  const {
    dfByContent,
    dfByContentType,
    dfByMemberType,
    dfByUniversity,
    dfByYearMonth,
  } = props.data;

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
    <Box className={styles.downloadsSummary}>
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

            <SummaryDataGrid data={dfByContent} columns={dfByContentColumns} />
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
    </Box>
  );
}
