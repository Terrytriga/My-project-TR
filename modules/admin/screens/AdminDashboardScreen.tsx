import { useTheme } from "@rneui/themed";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  BarChart,
  LineChart,
  PieChart,
  ProgressChart,
} from "react-native-chart-kit";

const { width } = Dimensions.get("window");
export default function AdminDashboardScreen() {
  const { theme } = useTheme();
  const chartConfig = {
    backgroundGradientFrom: theme.colors.background,
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: theme.colors.senary,
    backgroundGradientToOpacity: 0.5,
    // color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    color: (opacity = 1) => theme.colors.black,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };
  const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
    },
    barChart: {
      marginVertical: 8,
      borderRadius: 16,
    },
  });
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Pie Chart</Text>
      <PieChart
        data={pieChartData}
        width={width}
        height={220}
        chartConfig={chartConfig}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"0"}
        center={[0, 0]}
        absolute
      />
      <Text>Bar Chart</Text>
      <BarChart
        style={styles.barChart}
        data={barChartData}
        width={width}
        height={220}
        yAxisLabel="$"
        yAxisSuffix=""
        chartConfig={chartConfig}
        verticalLabelRotation={30}
      />
      <Text>Line Chart</Text>
      <LineChart
        data={lineChartData}
        width={width}
        height={220}
        chartConfig={chartConfig}
        bezier
      />
      <Text>Progress Chart</Text>
      <ProgressChart
        data={progressChartData}
        width={width}
        height={220}
        strokeWidth={16}
        radius={32}
        chartConfig={chartConfig}
        hideLegend={false}
      />
    </ScrollView>
  );
}

const progressChartData = {
  labels: ["Swim", "Bike", "Run"], // optional
  data: [0.4, 0.6, 0.8],
};

const lineChartData = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
      strokeWidth: 2, // optional
    },
  ],
  legend: ["Rainy Days"], // optional
};

const barChartData = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
    },
  ],
};

const pieChartData = [
  {
    name: "Seoul",
    population: 21500000,
    color: "rgba(131, 167, 234, 1)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
  {
    name: "Toronto",
    population: 2800000,
    color: "#F00",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
  {
    name: "Beijing",
    population: 527612,
    color: "red",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
  {
    name: "New York",
    population: 8538000,
    color: "green",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
  {
    name: "Moscow",
    population: 11920000,
    color: "rgb(0, 0, 255)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
];
