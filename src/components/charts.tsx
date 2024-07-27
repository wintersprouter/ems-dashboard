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
  monitorDeviceUsageList?: z.infer<
    typeof overviewResponse
  >["monitorDeviceUsageList"];
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
// const generateData = () => {
//   const data = [];
//   for (let i = 0; i < 25; i++) {
//     const time = `${i.toString().padStart(2, "0")}:00`;
//     const ch0 = Math.floor(Math.random() * 20);
//     const ch1 = Math.floor(Math.random() * 20);
//     const ch2 = Math.floor(Math.random() * 20);
//     const kWh = ch0 + ch1 + ch2;
//     const kW = Math.floor(Math.random() * 110);
//     const average_kW = Math.floor(Math.random() * 50);
//     const max_kW = Math.floor(Math.random() * 100);
//     data.push({ time, kWh, ch0, ch1, ch2, kW, average_kW, max_kW });
//   }
//   return data;
// };
// const data = generateData();

type Data = {
  ch0: number;
  ch1: number;
  ch2: number;
  time: string;
  kWh: number;
  average_kW: number;
  max_kW: number;
};
function Charts({ monitorDeviceUsageList, monitorPeriodMinute }: Props) {
  const [chartData, setChartData] = useState<Data[]>([]);

  const handleChartData = useCallback(() => {
    if (monitorDeviceUsageList) {
      const dataList: Data[] = [];
      for (const [key, value] of Object.entries(monitorDeviceUsageList)) {
        if (key === "0") {
          value.forEach((element, index) => {
            dataList.push({
              ch0: limitDecimalToOnePlace(element),
              ch1: 0,
              ch2: 0,
              time: `${index * monitorPeriodMinute} min`,
              kWh: 0,
              average_kW: 0,
              max_kW: 0,
            });
          });
        }
        if (key === "1") {
          value.forEach((element, index) => {
            dataList[index].ch1 = limitDecimalToOnePlace(element);
          });
        }
        if (key === "2") {
          value.forEach((element, index) => {
            dataList[index].ch2 = limitDecimalToOnePlace(element);
          });
        }
      }
      dataList.map((data) => {
        data.kWh = limitDecimalToOnePlace(add(data.ch0, data.ch1, data.ch2));
        //data.average_kW = Math.round(data.kWh / 3);
        //data.max_kW = Math.round(Math.max(data.ch0, data.ch1, data.ch2));
        return data;
      });
      setChartData(dataList);
    }
  }, [monitorDeviceUsageList, monitorPeriodMinute]);

  useEffect(() => {
    handleChartData();
  }, [handleChartData]);

  return (
    <section
      id='chart'
      className='bg-white rounded-xl my-6 py-3 px-8 mx-2 pt-12 h-full'
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
            active={true}
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
                return `${value}mins `;
              } else if (name === "ch2" || name === "ch1" || name === "ch0") {
                return `${value}kwh`;
              } else if (name === "Max(kW)" || name === "Average(kW)") {
                return `${value}kw`;
              }
            }}
            filterNull={false}
            allowEscapeViewBox={{ x: true, y: true }}
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
