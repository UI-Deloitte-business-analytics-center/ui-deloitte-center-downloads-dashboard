import { Box } from "@mui/material";
import clsx from "clsx";
import { AutoSizer } from "react-virtualized";
import { XAxis, YAxis, LineChart, Line, LabelList } from "recharts";
import styles from "./SummaryCharts.module.scss";

interface ISummaryLineChartProps {
  height?: number;
  data: object[];
  xDataKey: string;
  yDataKey: string;
}

export default function SummaryLineChart({
  height = 600,
  data,
  xDataKey,
  yDataKey,
}: ISummaryLineChartProps) {
  return (
    <Box className={clsx(styles.chartWrapper, styles.line)} sx={{ height }}>
      <AutoSizer>
        {({ width, height }) => (
          <LineChart width={width} height={height} data={data}>
            <Line
              type="monotone"
              dataKey={yDataKey}
              stroke="#333333"
              strokeWidth={3}
              animationBegin={0}
            >
              <LabelList dataKey={yDataKey} position="top" offset={15} />
            </Line>
            <XAxis dataKey={xDataKey} />
            <YAxis />
          </LineChart>
        )}
      </AutoSizer>
    </Box>
  );
}
