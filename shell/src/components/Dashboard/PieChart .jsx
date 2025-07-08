import { useTheme } from "@mui/material";
import { ResponsivePie } from "@nivo/pie";
import { mockPieData as data } from "../../../Services/data";
import { tokens } from "../../../config/theme";

const PieChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <div style={{ height: '100%' }}>
      <ResponsivePie
        data={data}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: colors.grey[100],
              },
            },
            legend: {
              text: {
                fill: colors.grey[100],
              },
            },
            ticks: {
              line: {
                stroke: colors.grey[100],
                strokeWidth: 1,
              },
              text: {
                fill: colors.grey[100],
              },
            },
          },
          legends: {
            text: {
              fill: colors.grey[100],
            },
          },
        }}
        margin={{ top: 60, right: 20, bottom: 100, left: 55 }}
        innerRadius={0}
        padAngle={0.1} // Adjust spacing between segments
        cornerRadius={3}
        activeOuterRadiusOffset={9}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={colors.grey[100]}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        enableArcLabels={true}
        arcLabelsRadiusOffset={0.5} // Adjust label distance from the center
        arcLabelsSkipAngle={5} // Lower this value to show more labels
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        legends={[]} // Remove legends to ensure it doesn't interfere with visibility
      />
    </div>
  );
};

export default PieChart;
