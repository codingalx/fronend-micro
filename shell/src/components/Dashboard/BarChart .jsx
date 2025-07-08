import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { mockBarData as data } from "../../../Services/data";
import { tokens } from "../../../config/theme";

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <div style={{ width: "100%", maxWidth: "1200px", height: "300px" }}> {/* Increase width to extend the axis */}
      <ResponsiveBar
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
        keys={["Male", "Female"]} // representing gender for each category
        indexBy="status" // categorize based on employee status like 'Onleave', 'Termination', etc.
        margin={{ top: 50, right: 50, bottom: 50, left: 30 }} // keep margins similar
        padding={0.2} // increase padding for more gaps between bars
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "nivo" }}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "#38bcb2",
            size: 5,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "#eed312",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        borderColor={{
          from: "color",
          modifiers: [["darker", "1.6"]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : "Status", // updated legend
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : "Employees", // updated legend
          legendPosition: "middle",
          legendOffset: -40,
        
        }}
        enableLabel={false}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 10,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 10,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        role="application"
        barAriaLabel={function (e) {
          return e.id + ": " + e.formattedValue + " in status: " + e.indexValue;
        }}
      />
    </div>
  );
};

export default BarChart;



