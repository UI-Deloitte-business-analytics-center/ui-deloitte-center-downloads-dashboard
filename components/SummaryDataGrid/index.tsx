import { Box } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import clsx from "clsx";
import styles from "./SummaryDataGrid.module.scss";

interface ISummaryDataGridProps {
  title: string;
  height?: number;
  data: object[];
  columns: GridColDef[];
}

export default function SummaryDataGrid({
  title,
  height = 600,
  data,
  columns,
}: ISummaryDataGridProps) {
  return (
    <Box className={styles.dataGridWrapper}>
      <h2>{title}</h2>

      <Box
        className={clsx({
          isLoading: !data,
        })}
        sx={{ height }}
      >
        {data ? (
          <DataGrid
            rows={data.map((o, id) => Object.assign(o, { id }))}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            disableSelectionOnClick
          />
        ) : (
          <Box className={styles.loadingBox}>Loading</Box>
        )}
      </Box>
    </Box>
  );
}
