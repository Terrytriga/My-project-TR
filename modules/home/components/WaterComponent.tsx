import { Text, useTheme } from "@rneui/themed";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import { useTrackingStore } from "../../../store/TrackingStore";
import { useEffect, useState } from "react";
import { LineChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

export default function WaterComponent({ filter }: { filter: string }) {
  const { theme } = useTheme();
  const { trackingWater } = useTrackingStore();

  const [lineChartData, setLineChartData] = useState<{
    labels: string[];
    datasets: { data: number[]; color: () => string }[];
    legend: string[];
  }>({
    labels: [],
    datasets: [{ data: [0], color: () => theme.colors.primary }],
    legend: ["Water Intake"],
  });

  useEffect(() => {
    if (trackingWater.length === 0) return;
    const legend = filter === "week" ? "Bottles per day" : "Bottles per week";
    let filteredData: { [key: string]: number } = {};

    if (filter === "week") {
      // Determine the most recent date in the trackingWater
      const mostRecentDate = new Date(
        Math.max(
          ...trackingWater.map((water) => new Date(water.datecreated).getTime())
        )
      );

      // Calculate the start of the 7-day range based on the most recent date
      const startDate = new Date(mostRecentDate);
      startDate.setDate(mostRecentDate.getDate() - 6); // Ensure the start date is 6 days prior to the most recent date

      // Ensure dates are considered in the correct range, even if spanning the previous month
      filteredData = trackingWater.reduce((acc, water) => {
        const waterDate = new Date(water.datecreated);
        // Check if waterDate falls within the 7-day range
        if (waterDate >= startDate && waterDate <= mostRecentDate) {
          const dayLabel = waterDate.toLocaleDateString("en-US", {
            weekday: "short",
          });
          acc[dayLabel] = (acc[dayLabel] || 0) + water.bottles; // Assuming 'bottles' is the count of water intake
        }
        return acc;
      }, {} as { [key: string]: number });

      // Generate ordered week days from startDate to mostRecentDate
      const orderedWeekDays: string[] = [];
      for (let i = 6; i >= 0; i--) {
        const day = new Date(mostRecentDate);
        day.setDate(mostRecentDate.getDate() - i);
        const dayLabel = day.toLocaleDateString("en-US", { weekday: "short" });
        orderedWeekDays.push(dayLabel);

        if (!filteredData[dayLabel]) {
          filteredData[dayLabel] = 0;
        }
      }

      // Order data according to the ordered week days with today as the last day
      const sortedData = orderedWeekDays.reduce((acc, dayLabel) => {
        acc[dayLabel] = filteredData[dayLabel];
        return acc;
      }, {} as { [key: string]: number });

      const labels = Object.keys(sortedData);
      const data = Object.values(sortedData);

      setLineChartData({
        labels: labels,
        datasets: [
          {
            data: data,
            color: () => theme.colors.secondary,
          },
        ],
        legend: [legend],
      });
    } else if (filter === "month") {
      // Determine the most recent date in the trackingWater
      const mostRecentDate = new Date(
        Math.max(
          ...trackingWater.map((water) => new Date(water.datecreated).getTime())
        )
      );

      // Get the first day of the month of the most recent date
      const startDate = new Date(
        mostRecentDate.getFullYear(),
        mostRecentDate.getMonth(),
        1
      );

      // Initialize weekly aggregated data
      filteredData = trackingWater.reduce((acc, water) => {
        const waterDate = new Date(water.datecreated);

        if (waterDate >= startDate && waterDate <= mostRecentDate) {
          // Calculate the week number for the given date
          const weekStart = new Date(waterDate);
          weekStart.setDate(waterDate.getDate() - waterDate.getDay()); // Set to the first day of the week (Sunday)

          const weekLabel = weekStart.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }); // e.g., "Jan 1"

          acc[weekLabel] = (acc[weekLabel] || 0) + water.bottles;
        }
        return acc;
      }, {} as { [key: string]: number });

      // Ensure all weeks of the month are represented, even with 0 water intake
      const currentDate = new Date(startDate);
      while (currentDate <= mostRecentDate) {
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay()); // Set to the first day of the week (Sunday)

        const weekLabel = weekStart.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        if (!filteredData[weekLabel]) {
          filteredData[weekLabel] = 0;
        }

        // Move to the next week
        currentDate.setDate(currentDate.getDate() + 7);
      }
      const labels = Object.keys(filteredData);
      const data = Object.values(filteredData);

      // Update the line chart data with the new format
      if (labels.length > 0 && data.length > 0) {
        setLineChartData({
          labels: labels,
          datasets: [
            {
              data: data,
              color: () => theme.colors.secondary,
            },
          ],
          legend: [legend],
        });
      }
    }
  }, [filter, trackingWater]);

  const chartConfig = {
    backgroundGradientFrom: theme.colors.background,
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: theme.colors.background,
    backgroundGradientToOpacity: 0,
    color: () => theme.colors.primary,
    strokeWidth: 2,
    decimalPlaces: 0,
    fillShadowGradient: theme.colors.secondary,
    fillShadowGradientOpacity: 1,
    useShadowColorFromDataset: false,
    propsForBackgroundLines: {
      stroke: "#e3e3e3",
      strokeDasharray: "",
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: theme.colors.primary,
    },
  };

  const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      width: Platform.OS !== "web" ? "100%" : "50%",
      alignSelf: "center",
    },
    lineChart: {
      marginVertical: 8,
      borderRadius: 16,
    },
    textContainer: {
      paddingVertical: 40,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <View style={styles.container}>
      {trackingWater.length !== 0 ? (
        <LineChart
          data={lineChartData}
          width={width - 22}
          height={220}
          chartConfig={chartConfig}
          bezier
        />
      ) : (
        <View style={styles.textContainer}>
          <Text>Record some Water Consumption!</Text>
        </View>
      )}
    </View>
  );
}