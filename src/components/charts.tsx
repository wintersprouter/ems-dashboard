import { useCallback, useEffect, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { z } from "zod";
import { overviewResponse } from "../services/apis/web";
import { getTimeFormat } from "../util/getTime";
import { limitDecimalToOnePlace } from "../util/limitDecimalToOnePlace";
import RoundedBar from "./rounedBar";
type Props = {
  listPowerMaxKW: z.infer<typeof overviewResponse>["listPowerMaxKW"];
  listPowerAverageKW: z.infer<typeof overviewResponse>["listPowerAverageKW"];
  deviceUsageList?: z.infer<typeof overviewResponse>["deviceUsageList"];
  monitorPeriodMinute: z.infer<typeof overviewResponse>["monitorPeriodMinute"];
};
function CustomCursor(props: {
  stroke?: string;
  pointerEvents?: string | number;
  height?: number;
  points: { x: number; y: number }[];
  className?: string;
}) {
  const { stroke, pointerEvents, height, points, className } = props;

  const { x, y } = points[0];
  return (
    <>
      <Rectangle
        x={x + 2.5}
        y={y}
        fillOpacity={0}
        stroke={stroke}
        pointerEvents={pointerEvents}
        width={1}
        height={height}
        points={JSON.stringify(points)}
        className={className}
        type='linear'
      />
    </>
  );
}

interface FormattedData {
  [key: string]: number | string;
  time: string;
  kWh: number;
  average_kW: number;
  max_kW: number;
}

function Charts({
  deviceUsageList,
  monitorPeriodMinute,
  listPowerMaxKW,
  listPowerAverageKW,
}: Props) {
  const [chartData, setChartData] = useState<FormattedData[]>([]);
  function formatDeviceUsageList(
    deviceUsageList: z.infer<typeof overviewResponse>["deviceUsageList"],
    monitorPeriodMinute: number,
    listPowerMaxKW: z.infer<typeof overviewResponse>["listPowerMaxKW"],
    listPowerAverageKW: z.infer<typeof overviewResponse>["listPowerAverageKW"]
  ): FormattedData[] {
    const result: FormattedData[] = [];

    // 假設所有 usage 的長度相同
    const usageLength = deviceUsageList?.[0]?.usage.length || 0;

    for (let i = 0; i < usageLength; i++) {
      const entry: FormattedData = {
        time: getTimeFormat(i * monitorPeriodMinute),
        kWh: 0,
        average_kW: 0,
        max_kW: 0,
      };

      deviceUsageList?.forEach((deviceUsage, index) => {
        entry[`ch${index}`] = deviceUsage.usage[i];
        entry.kWh += limitDecimalToOnePlace(deviceUsage.usage[i]);
        entry.average_kW == limitDecimalToOnePlace(listPowerAverageKW?.[i]);
        entry.max_kW === limitDecimalToOnePlace(listPowerMaxKW?.[i]);
      });

      entry.average_kW /= deviceUsageList?.length || 1;
      entry.max_kW /= deviceUsageList?.length || 1;

      result.push(entry);
    }

    return result;
  }
  const handleChartData = useCallback(() => {
    if (deviceUsageList) {
      const result = formatDeviceUsageList(
        deviceUsageList,
        monitorPeriodMinute,
        listPowerMaxKW,
        listPowerAverageKW
      );
      setChartData(result);
    }
  }, [
    deviceUsageList,
    listPowerAverageKW,
    listPowerMaxKW,
    monitorPeriodMinute,
  ]);

  useEffect(() => {
    handleChartData();
  }, [handleChartData]);

  return (
    <section
      id='charts'
      className='bg-white rounded-xl my-6 px-8 mx-2 py-6 container'
    >
      <h1 className='font-semibold text-gray-800 text-3xl'>Energy Charts</h1>
      <ResponsiveContainer width='100%' height='100%' aspect={16 / 6}>
        <ComposedChart
          width={500}
          height={400}
          data={chartData}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <Tooltip
            cursor={<CustomCursor points={[]} />}
            wrapperStyle={{
              backgroundColor: "#1F2937",
              borderRadius: "10px",
              fontSize: "14px",
              lineHeight: "1.5",
              width: "243px",
              padding: "12px 16px",
            }}
            contentStyle={{
              backgroundColor: "#1F2937",
              color: "#fff",
              border: "none",
            }}
            formatter={(value, name) => {
              if (name === "time") {
                return `${value}:00`;
              } else if (name === "ch2" || name === "ch1" || name === "ch0") {
                return `${limitDecimalToOnePlace(Number(value) ?? 0)} kwh`;
              } else if (name === "Max(kW)" || name === "Average(kW)") {
                return `${value} kw`;
              }
            }}
            filterNull={true}
          />
          <CartesianGrid vertical={false} />
          <XAxis dataKey='time' scale='band' type='category' name='time' />
          <YAxis
            dataKey='kWh'
            yAxisId='left'
            scale='auto'
            type='number'
            unit='kWh'
            orientation='left'
            stroke='#16A34A'
            name='kWh'
            tickCount={12}
            axisLine={false}
          />
          <YAxis
            dataKey='max_kW'
            yAxisId='right'
            orientation='right'
            scale='auto'
            type='number'
            unit='kW'
            stroke='#9CA3AF'
            name='kW'
            tickCount={12}
            axisLine={false}
          />
          <Legend
            verticalAlign='top'
            align='right'
            layout='horizontal'
            wrapperStyle={{
              position: "absolute",
              top: -30,
            }}
            payload={[
              {
                value: "ch0 kwh",
                type: "circle",
                id: "ch0",
                color: "#4ADE80",
              },
              {
                value: "ch1 kwh",
                type: "circle",
                id: "ch1",
                color: "#22C55E",
              },
              {
                value: "ch2 kwh",
                type: "circle",
                id: "ch2",
                color: "#15803D",
              },
              {
                value: "Average(kW)",
                type: "line",
                id: "Average(kW)",
                color: "#FACC15",
              },
              {
                value: "Max(kW)",
                type: "line",
                id: "Max(kW)",
                color: "#3B82F6",
              },
            ]}
          />

          <Bar
            dataKey='ch2'
            stackId='time'
            fill='#15803D'
            yAxisId='left'
            name='ch2'
          />
          <Bar
            dataKey='ch1'
            stackId='time'
            fill='#22C55E'
            yAxisId='left'
            name='ch1'
          />
          <Bar
            dataKey='ch0'
            stackId='time'
            fill='#4ADE80'
            yAxisId='left'
            name='ch0'
            shape={<RoundedBar dataKey='ch0' />}
          />
          <Line
            type='linear'
            dataKey='average_kW'
            strokeWidth={3}
            stroke='#FACC15'
            yAxisId='right'
            dot={{ stroke: "#CA8A04", strokeWidth: 2 }}
            name='Average(kW)'
          />
          <Line
            legendType='triangle'
            type='linear'
            dataKey='max_kW'
            strokeWidth={3}
            stroke='#3B82F6'
            yAxisId='right'
            dot={{ stroke: "#1E40AF", strokeWidth: 2 }}
            name='Max(kW)'
          />
        </ComposedChart>
      </ResponsiveContainer>
    </section>
  );
}
export default Charts;
