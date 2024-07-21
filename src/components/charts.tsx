import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const generateData = () => {
  const data = [];
  for (let i = 0; i < 25; i++) {
    const time = `${i.toString().padStart(2, "0")}:00`;
    const chA = Math.floor(Math.random() * 20);
    const chB = Math.floor(Math.random() * 20);
    const chC = Math.floor(Math.random() * 20);
    const kWh = chA + chB + chC;
    const kW = Math.floor(Math.random() * 110);
    const average_kW = Math.floor(Math.random() * 50);
    const max_kW = Math.floor(Math.random() * 100);
    data.push({ time, kWh, chA, chB, chC, kW, average_kW, max_kW });
  }
  return data;
};
const data = generateData();
function Charts() {
  return (
    <section
      id='chart'
      className='bg-white rounded-xl my-6 py-3 px-8 mx-2 pt-12'
    >
      <h1 className='font-semibold text-gray-800 text-3xl'>Energy Charts</h1>
      <ResponsiveContainer width='100%' height='100%' aspect={4 / 3}>
        <ComposedChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <Tooltip />
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
            dataKey='chC'
            stackId='time'
            fill='#15803D'
            yAxisId='left'
            name='chC'
          />
          <Bar
            dataKey='chB'
            stackId='time'
            fill='#22C55E'
            yAxisId='left'
            name='chB'
          />
          <Bar
            dataKey='chA'
            stackId='time'
            fill='#4ADE80'
            yAxisId='left'
            name='chA'
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
