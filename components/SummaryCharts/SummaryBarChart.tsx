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
  height = 1000,
  tickWidth = 360,
  data,
  xDataKey,
  yDataKey,
}: ISummaryBarChartProps) {
  return (
    <Box className={clsx(styles.chartWrapper, styles.bar)} sx={{ height }}>
      <AutoSizer>
        {({ width, height }) => (
          <BarChart
            layout="vertical"
            width={width}
            height={height}
            data={data}
            margin={{ right: 32 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              tick={{ width: tickWidth }}
              tickFormatter={(value) =>
                value.toLocaleString().replace(/ /g, "\u00A0")
              }
              width={tickWidth + 10}
              dataKey={yDataKey}
            />
            <Bar
              barSize={24}
              dataKey={xDataKey}
              fill="#333333"
              label={{ position: "right" }}
              animationBegin={0}
            />
          </BarChart>
        )}
      </AutoSizer>
    </Box>
  );
}
