import React, { useEffect, useState } from "react";
import { Text, useTheme } from "@rneui/themed";
import { View, Dimensions, StyleSheet } from "react-native";
import { ContributionGraph } from "react-native-chart-kit";
import { useTrackingStore } from "../../../store/TrackingStore";

const { width } = Dimensions.get("window");

export default function MealComponent({
  selectedDate,
}: {
  selectedDate: Date;
}) {
  const { theme } = useTheme();
  const { trackingMeal } = useTrackingStore();

  const [mealData, setMealData] = useState<{ date: Date; count?: number }[]>(
    []
  );

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month + 1, 0);

  useEffect(() => {
    if (trackingMeal.length === 0) return;
    const startClone = new Date(startDate);
    const endClone = new Date(endDate);

    const data = trackingMeal.reduce((acc, meal) => {
      const mealDate = new Date(meal.datecreated);
      mealDate.setHours(0, 0, 0, 0);

      if (mealDate >= startClone && mealDate <= endClone) {
        const existingEntry = acc.find(
          (entry) => entry.date.toDateString() === mealDate.toDateString()
        );

        if (existingEntry) {
          existingEntry.count = (existingEntry.count || 0) + 1;
        } else {
          acc.push({ date: mealDate, count: 1 });
        }
      }

      return acc;
    }, [] as { date: Date; count?: number }[]);

    for (
      let date = new Date(startClone);
      date <= endClone;
      date.setDate(date.getDate() + 1)
    ) {
      const dateStr = date.toDateString();
      if (!data.find((entry) => entry.date.toDateString() === dateStr)) {
        data.push({ date: new Date(date), count: 0 });
      }
    }

    data.sort((a, b) => a.date.getTime() - b.date.getTime());

    setMealData(data);
  }, [selectedDate, trackingMeal]);

  const chartConfig = {
    backgroundGradientFrom: theme.colors.background,
    backgroundGradientTo: theme.colors.background,
    color: (opacity = 1) => theme.colors.primary,
    strokeWidth: 2,
  };

  const styles = StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
    chart: {
      marginVertical: 8,
      borderRadius: 16,
    },
  });

  const getTooltipDataAttrs = (value: { date: Date; count?: number }) => {
    const intensity = value.count ? Math.min(value.count / 5, 1) : 0;
    return {
      fill: value.count
        ? `rgba(0, 0, 255, ${intensity})`
        : theme.colors.background,
      fontSize: 12,
      stroke: theme.colors.primary,
      strokeWidth: 1,
      text: value.count ? `${value.count} workouts` : "No workouts",
    };
  };

  return (
    <View style={styles.container}>
      <ContributionGraph
        values={mealData}
        endDate={endDate}
        numDays={
          Math.floor(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          ) + 1
        }
        width={width - 20}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
        squareSize={20}
        gutterSize={4}
        tooltipDataAttrs={getTooltipDataAttrs}
      />
    </View>
  );
}
