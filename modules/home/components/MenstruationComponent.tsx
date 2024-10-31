import React, { useEffect, useState } from "react";
import { Text, useTheme } from "@rneui/themed";
import { View, Dimensions, StyleSheet } from "react-native";
import { ContributionGraph } from "react-native-chart-kit";
import { useTrackingStore } from "../../../store/TrackingStore";

const { width } = Dimensions.get("window");

export default function MenstruationComponent({
  selectedDate,
}: {
  selectedDate: Date;
}) {
  const { theme } = useTheme();
  const { trackingMenstruation } = useTrackingStore();

  const [menstruationData, setMenstruationData] = useState<
    { date: Date; count?: number; color?: string }[]
  >([]);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const startDate = new Date(year, month - 2, 1);
  const endDate = new Date(year, month + 1, 0);

  useEffect(() => {
    if (trackingMenstruation.length === 0) return;

    const completedCycles = trackingMenstruation.filter(
      (cycle) =>
        cycle.periodstart &&
        cycle.periodend &&
        cycle.periodlength &&
        cycle.cyclelength
    );

    const data: { date: Date; count?: number; color?: string }[] = [];

    completedCycles.forEach((cycle) => {
      const { periodstart, periodend, cyclelength } = cycle;
      const periodStartDate = new Date(periodstart);
      const periodEndDate = new Date(periodend!);

      //fertility window
      const ovulationDay = new Date(periodStartDate);
      ovulationDay.setDate(periodStartDate.getDate() + cyclelength! - 14);
      const fertilityStartDate = new Date(ovulationDay);
      fertilityStartDate.setDate(ovulationDay.getDate() - 5);
      const fertilityEndDate = new Date(ovulationDay);
      fertilityEndDate.setDate(ovulationDay.getDate() + 1);

      // Add period window days
      for (
        let date = new Date(periodStartDate);
        date <= periodEndDate;
        date.setDate(date.getDate() + 1)
      ) {
        if (date >= startDate && date <= endDate) {
          data.push({
            date: new Date(date),
            count: 4,
            color: theme.colors.error,
          });
        }
      }

      // Add fertility window days
      for (
        let date = new Date(fertilityStartDate);
        date <= fertilityEndDate;
        date.setDate(date.getDate() + 1)
      ) {
        if (
          date >= startDate &&
          date <= endDate &&
          !data.find(
            (entry) => entry.date.toDateString() === date.toDateString()
          )
        ) {
          data.push({
            date: new Date(date),
            count: 1,
            color: theme.colors.warning,
          });
        }
      }

      const cycleEndDate = new Date(periodStartDate);
      cycleEndDate.setDate(periodStartDate.getDate() + cyclelength! - 1);

      for (
        let date = new Date(periodEndDate);
        date <= cycleEndDate;
        date.setDate(date.getDate() + 1)
      ) {
        if (
          date >= startDate &&
          date <= endDate &&
          !data.find(
            (entry) => entry.date.toDateString() === date.toDateString()
          )
        ) {
          data.push({
            date: new Date(date),
            count: 0,
            color: theme.colors.background,
          });
        }
      }
    });

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const dateStr = date.toDateString();
      if (!data.find((entry) => entry.date.toDateString() === dateStr)) {
        data.push({
          date: new Date(date),
          count: 0,
          color: theme.colors.background,
        });
      }
    }

    data.sort((a, b) => a.date.getTime() - b.date.getTime());

    setMenstruationData(data);
  }, [selectedDate, trackingMenstruation]);

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

  const getTooltipDataAttrs = (value: {
    date: Date;
    count?: number;
    color?: string;
  }) => {
    const intensity = value.count ? Math.min(value.count / 5, 1) : 0;
    return {
      fill: value.count
        ? `rgba(0, 0, 255, ${intensity})`
        : theme.colors.background,
      fontSize: 12,
      stroke: theme.colors.primary,
      strokeWidth: 1,
      text: value.count ? `${value.count} day` : "No data",
    };
  };

  return (
    <View style={styles.container}>
      <ContributionGraph
        values={menstruationData}
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
