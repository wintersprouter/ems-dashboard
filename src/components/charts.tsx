import { add, subtract } from "mathjs";
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

interface CustomBarShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  dataKey: string;
}

const CustomBarShape: React.FC<CustomBarShapeProps> = (props) => {
  const { x, y, width, height, fill } = props;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} />
      <line
        x1={x}
        y1={y}
        x2={x ?? 0 + (width ?? 0)}
        y2={y}
        stroke='#8e8e8e'
        strokeWidth={0.1}
      />
      <line
        x1={x}
        y1={y ?? 0 + (height ?? 0)}
        x2={x ?? 0 + (width ?? 0)}
        y2={(y ?? 0) + (height ?? 0)}
        stroke='#8e8e8e'
        strokeWidth={0.1}
      />
    </g>
  );
};

type Props = {
  mainDeviceUsage: z.infer<typeof overviewResponse>["mainDeviceUsage"];
  listPowerMaxKW: z.infer<typeof overviewResponse>["listPowerMaxKW"];
  listPowerAverageKW: z.infer<typeof overviewResponse>["listPowerAverageKW"];
  deviceUsageList?: z.infer<typeof overviewResponse>["deviceUsageList"];
  monitorPeriodMinute: z.infer<typeof overviewResponse>["monitorPeriodMinute"];
};
const mainColor = "#93ff93";
const subColors = [
  "#79ff79",
  "#53ff53",
  "#28ff28",
  "#00ec00",
  "#00db00",
  "#00bb00",
  "#00a600",
  "#009100",
  "#007500",
  "#006000",
];
// const subColors = ["#8884d8", "#ffc658", "#ff8042", "#ff4d4f", "#ff85c0"];
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
  [key: string]: number;
  time: number;
  average_kW: number;
  max_kW: number;
  main: number;
  diff: number;
  subSum: number;
}

function Charts({
  deviceUsageList,
  monitorPeriodMinute,
  listPowerMaxKW,
  listPowerAverageKW,
  mainDeviceUsage,
}: Props) {
  const [chartData, setChartData] = useState<FormattedData[]>([]);

  const formatDeviceUsageList = useCallback(
    (
      mainDeviceUsage: z.infer<typeof overviewResponse>["mainDeviceUsage"],
      deviceUsageList: z.infer<typeof overviewResponse>["deviceUsageList"],
      monitorPeriodMinute: number,
      listPowerMaxKW: z.infer<typeof overviewResponse>["listPowerMaxKW"],
      listPowerAverageKW: z.infer<typeof overviewResponse>["listPowerAverageKW"]
    ): FormattedData[] => {
      const result: FormattedData[] = [];
      const barData: FormattedData = {
        time: 0,
        max_kW: 0,
        average_kW: 0,
        main: 0,
        diff: 0,
        subSum: 0,
      };
      if (deviceUsageList?.length === 0) {
        return mainDeviceUsage.usage.map((usage, i) => {
          return {
            diff: 0,
            subSum: 0,
            time: monitorPeriodMinute > 0 ? i * monitorPeriodMinute : i,
            main: limitDecimalToOnePlace(usage),
            average_kW: limitDecimalToOnePlace(listPowerAverageKW?.[i] ?? 0),
            max_kW: limitDecimalToOnePlace(listPowerMaxKW?.[i] ?? 0),
          };
        });
      }

      deviceUsageList?.forEach((deviceUsage) => {
        if (typeof deviceUsage.id === "string") {
          barData[`${deviceUsage.id}`] = 0;
        }
      });

      deviceUsageList?.forEach((deviceUsage) => {
        deviceUsage.usage.forEach((usage, i) => {
          if (result[i]) {
            result[i] = {
              ...result[i],
              time:
                monitorPeriodMinute > 0
                  ? i * deviceUsage.monitorPeriodMinute
                  : i,
              [`${deviceUsage.id}`]: limitDecimalToOnePlace(usage),
              // diff: limitDecimalToOnePlace(subtract(result[i].diff, usage)),
            };
          } else {
            result[i] = {
              ...barData,
              time:
                deviceUsage.monitorPeriodMinute > 0
                  ? i * deviceUsage.monitorPeriodMinute
                  : i,
              average_kW: limitDecimalToOnePlace(listPowerAverageKW?.[i] ?? 0),
              max_kW: limitDecimalToOnePlace(listPowerMaxKW?.[i] ?? 0),
              [`${deviceUsage.id}`]: limitDecimalToOnePlace(usage),
              main: limitDecimalToOnePlace(mainDeviceUsage?.usage[i]),
            };
          }
        });
      });

      return result.map((item) => {
        const subValues = Object.keys(item)
          .filter(
            (key) =>
              ![
                "time",
                "max_kW",
                "average_kW",
                "main",
                "diff",
                "subSum",
              ].includes(key)
          )
          .map((key) => item[key]);

        // 使用 mathjs 計算 subSum
        const subSum: number = limitDecimalToOnePlace(
          subValues.reduce((acc: number, cur: number) => add(acc, cur), 0)
        );

        // 使用 mathjs 計算 diff
        const diff = limitDecimalToOnePlace(subtract(item.main, subSum));

        // 返回更新後的物件
        return {
          ...item,
          subSum,
          diff,
        };
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  useEffect(() => {
    const getBarData = () => {
      const result = formatDeviceUsageList(
        mainDeviceUsage ?? null,
        deviceUsageList ?? [],
        monitorPeriodMinute,
        listPowerMaxKW,
        listPowerAverageKW
      );
      setChartData([...result]);
    };

    getBarData();
  }, [
    deviceUsageList,
    formatDeviceUsageList,
    listPowerAverageKW,
    listPowerMaxKW,
    mainDeviceUsage,
    monitorPeriodMinute,
  ]);
  console.log("chartData", JSON.stringify(chartData, null, 2));
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
              if (name === "diff") {
                return [`${value} `, `main ${name}`];
              }
              return [value, name];
            }}
            filterNull={false}
            labelFormatter={(label) => {
              return `${getTimeFormat(label)}~${getTimeFormat(
                add(label, monitorPeriodMinute)
              )}`;
            }}
          />
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey='time'
            scale='band'
            type='category'
            name='time'
            tickFormatter={(value) => {
              return getTimeFormat(value);
            }}
          />
          <YAxis
            domain={["dataMin", (dataMax: number) => dataMax * 1.2]}
            dataKey='main'
            yAxisId='left'
            scale='auto'
            type='number'
            unit='kWh'
            orientation='left'
            stroke='#16A34A'
            name='main'
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
          {deviceUsageList?.length ? (
            <Bar
              key={"diff"}
              dataKey={"diff"}
              stackId='time'
              fill={mainColor}
              yAxisId='left'
              unit='kWh'
              name={"diff"}
              // shape={(props) => {
              //   return (
              //     props.payload.value !== 0 && <RoundedBar dataKey={"main"} />
              //   );
              // }}
            />
          ) : (
            <Bar
              key={"main"}
              dataKey={"main"}
              stackId='time'
              fill={mainColor}
              yAxisId='left'
              unit='kWh'
              name={"main"}
            />
          )}
          {deviceUsageList
            ?.map((deviceUsage, index) => (
              <Bar
                key={deviceUsage.name}
                dataKey={deviceUsage.id.toString()}
                stackId='time'
                fill={subColors[index]}
                yAxisId='left'
                name={deviceUsage.name}
                layout='vertical'
                unit='kWh'
                stroke='#8e8e8e'
                strokeWidth={1}
                shape={<CustomBarShape dataKey={deviceUsage.id.toString()} />}
              />
            ))
            .reverse()}

          <Line
            type='linear'
            dataKey='average_kW'
            strokeWidth={3}
            stroke='#FACC15'
            yAxisId='right'
            dot={{ stroke: "#CA8A04", strokeWidth: 2 }}
            name='Average(kW)'
            unit='kW'
          />
          <Line
            legendType='triangle'
            type='linear'
            dataKey='max_kW'
            strokeWidth={3}
            stroke='#3B82F6'
            yAxisId='right'
            unit='kW'
            dot={{ stroke: "#1E40AF", strokeWidth: 2 }}
            name='Max(kW)'
          />
        </ComposedChart>
      </ResponsiveContainer>
    </section>
  );
}
export default Charts;
