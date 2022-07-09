import { Box } from "@mui/material";
import clsx from "clsx";
import { AutoSizer } from "react-virtualized";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import styles from "./SummaryCharts.module.scss";

interface ISummaryBarChartProps {
  tickWidth: number;
  height?: number;
  data: object[];
  xDataKey: string;
  yDataKey: string;
}

export default function SummaryBarChart({
  height = 900,
  tickWidth = 350,
  data,
  xDataKey,
  yDataKey,
}: ISummaryBarChartProps) {
  return (
    <Box className={clsx(styles.chartWrapper, styles.bar)} sx={{ height }}>
      <AutoSizer>
        {({ width, height }) => (
          <BarChart
            layout="horizontal"
            width={width}
            height={height}
            data={data}
            margin={{ right: 32 }}
          >
            <YAxis type="number" hide />
            <XAxis
              type="category"
              tick={{ width: tickWidth }}
              tickFormatter={(value) =>
                value.toLocaleString().replace(/ /g, "\u00A0")
              }
              width={tickWidth + 5}
              dataKey={xDataKey}
            />
            <Bar
              barSize={24}
              dataKey={yDataKey}
              fill="#333333"
              label={{ position: "top" }}
              animationBegin={0}
            />
          </BarChart>
        )}
      </AutoSizer>
    </Box>
  );
}
