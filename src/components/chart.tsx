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
import { deviceUsageSchema } from "../services/apis/web";
import { getTimeFormat } from "../util/getTime";
import { limitDecimalToOnePlace } from "../util/limitDecimalToOnePlace";
import RoundedBar from "./rounedBar";
type Props = {
  deviceUsage: z.infer<typeof deviceUsageSchema>;
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

type Data = {
  device: number;
  time: number | string;
  kWh: number;
  average_kW: number;
  max_kW: number;
};

function Chart({ deviceUsage }: Props) {
  const [chartData, setChartData] = useState<Data[]>([]);
  // console.log("deviceUsage", deviceUsage);
  const handleChartData = useCallback(() => {
    const data = deviceUsage.usage
      .map((i, index) => {
        const device = i;
        const kWh = limitDecimalToOnePlace(i);
        return {
          device,
          time:
            deviceUsage.monitorPeriodMinute > 0
              ? getTimeFormat(index * deviceUsage.monitorPeriodMinute)
              : index,
          kWh,
        };
      })
      .map((item, index) => {
        return {
          ...item,
          average_kW: limitDecimalToOnePlace(
            deviceUsage.listPowerAverageKW[index]
          ),
          max_kW: limitDecimalToOnePlace(deviceUsage.listPowerMaxKW[index]),
        };
      });
    setChartData([...data]);
  }, [
    deviceUsage.listPowerAverageKW,
    deviceUsage.listPowerMaxKW,
    deviceUsage.monitorPeriodMinute,
    deviceUsage.usage,
  ]);
  // console.log("chartData", chartData);
  useEffect(() => {
    handleChartData();
  }, [handleChartData]);

  return (
    <section id='chart' className='bg-white rounded-xl my-6 px-8 mx-2 py-6'>
      <h1 className='font-semibold text-gray-800 text-3xl'>Energy Charts</h1>
      <ResponsiveContainer width='100%' height='100%' aspect={16 / 8.1}>
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
                //format time
                //00:00
                return `${value}:00`;
              } else if (name === "device") {
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
          <YAxis
            dataKey='kW'
            yAxisId='right'
            scale='pow'
            type='number'
            unit='kW'
            orientation='right'
            stroke='#9CA3AF'
            name='kW'
            tickCount={12}
            axisLine={false}
          />
          <Legend
            wrapperStyle={{
              position: "absolute",
              top: -30,
            }}
            verticalAlign='top'
            align='right'
            iconType='line'
            payload={[
              {
                value: "kWh",
                type: "circle",
                id: "device",
                color: "#16A34A",
              },
              {
                value: "Average(kW)",
                type: "line",
                id: "average_kW",
                color: "#FACC15",
              },
              {
                value: "Max(kW)",
                type: "line",
                id: "max_kW",
                color: "#3B82F6",
              },
            ]}
          />
          <Bar
            dataKey='device'
            stackId='time'
            fill='#16A34A'
            yAxisId='left'
            name='device'
            shape={<RoundedBar dataKey='device' />}
          />
          <Line
            type='linear'
            dataKey='average_kW'
            strokeWidth={3}
            stroke='#FACC15'
            yAxisId='left'
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
export default Chart;
