import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { type HeartRateReading } from '../types';

interface HeartRateChartProps {
  data: HeartRateReading[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-700 p-2 border border-slate-600 rounded-md shadow-lg text-sm">
        <p className="text-slate-300">{`Time: ${new Date(label).toLocaleTimeString()}`}</p>
        <p className="text-cyan-400 font-semibold">{`HR: ${payload[0].value} BPM`}</p>
      </div>
    );
  }
  return null;
};

const HeartRateChart: React.FC<HeartRateChartProps> = ({ data }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-4 pt-8 shadow-lg h-80">
      <h3 className="text-lg font-semibold text-slate-300 mb-4 px-2">Heart Rate Trend (24h)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: -10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="timestamp"
            stroke="#64748b"
            tickFormatter={(timeStr) => new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            tick={{ fontSize: 12 }}
            angle={-30}
            textAnchor="end"
          />
          <YAxis stroke="#64748b" domain={[40, 'dataMax + 10']} tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={60} stroke="#4ade80" strokeDasharray="3 3" />
          <ReferenceLine y={100} label={{ value: 'Resting Range', position: 'insideTopLeft', fill: '#4ade80', dy: -10 }} stroke="#4ade80" strokeDasharray="3 3" />
          <Line type="monotone" dataKey="heartRate" stroke="#fb7185" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HeartRateChart;
