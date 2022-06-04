import { Box } from "@mui/material";
import { AutoSizer } from "react-virtualized";
import { PieChart, Pie, Cell } from "recharts";
import styles from "./SummaryCharts.module.scss";
import tinygradient from "tinygradient";
import clsx from "clsx";

interface ISummaryPieChartProps {
  height?: number;
  data: object[];
  dataKey: string;
  nameKey: string;
}

const renderCustomizedLabel = (entry) => {
  return `${entry.name} - ${(entry.percent * 100).toFixed(0)}%`;
};

export default function SummaryPieChart({
  height = 400,
  data,
  dataKey,
  nameKey,
}: ISummaryPieChartProps) {
  var gradient = tinygradient(["#FF8042", "#3099f7"]);
  const COLORS = gradient.rgb(data.length).map((o) => o.toHexString());

  return (
    <Box className={clsx(styles.chartWrapper, styles.pie)} sx={{ height }}>
      <AutoSizer>
        {({ width, height }) => (
          <PieChart width={width} height={height}>
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              animationBegin={0}
              animationDuration={500}
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        )}
      </AutoSizer>
    </Box>
  );
}
