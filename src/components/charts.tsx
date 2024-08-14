import { add } from "mathjs";
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
import { limitDecimalToOnePlace } from "../util/limitDecimalToOnePlace";
type Props = {
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

type Data = {
  ch0: number;
  ch1: number;
  ch2: number;
  time: string;
  kWh: number;
  average_kW: number;
  max_kW: number;
};
type Item = {
  id: number;
  name: string;
  usage: number[];
};

function getTimeFormat(minute: number) {
  const hour = Math.floor(minute / 60);
  const min = minute % 60;
  return `${hour > 9 ? "" : "0"}${hour}:${min > 9 ? "" : "0"}${min}`;
}
function Charts({ deviceUsageList, monitorPeriodMinute }: Props) {
  const [chartData, setChartData] = useState<Data[]>([]);

  const handleChartData = useCallback(() => {
    if (deviceUsageList) {
      const itemList: Item[] = [];
      for (const [key, value] of Object.entries(deviceUsageList)) {
        console.log("key", key);
        itemList.push(value);
      }
      console.log("itemList", JSON.stringify(itemList, null, 2));
      const dataList = itemList[0].usage.map((_, index) => {
        const ch0 = itemList[0].usage[index];
        const ch1 = itemList[1].usage[index];
        const ch2 = itemList[2].usage[index];
        const kWh = limitDecimalToOnePlace(add(ch0, ch1, ch2));
        const average_kW = 0;
        const max_kW = 0;
        return {
          ch0,
          ch1,
          ch2,
          time: getTimeFormat(index * monitorPeriodMinute),
          kWh,
          average_kW,
          max_kW,
        };
      });
      setChartData(dataList);
    }
  }, [deviceUsageList, monitorPeriodMinute]);

  useEffect(() => {
    handleChartData();
  }, [handleChartData]);

  return (
    <section
      id='chart'
      className='bg-white rounded-xl my-6 py-3 px-8 mx-2 pt-12'
    >
      <h1 className='font-semibold text-gray-800 text-3xl'>Energy Charts</h1>
      <ResponsiveContainer width='100%' height='100%' aspect={1250 / 444}>
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

          <Legend verticalAlign='top' align='right' iconType='line' />
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
export default Charts;
