import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { type TemperatureReading } from '../types';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from './IconComponents';

interface TemperatureChartProps {
  data: TemperatureReading[];
}

const CustomTooltip = ({ active, payload, label, data }: any) => {
  if (active && payload && payload.length && data) {
    const currentTimestamp = label;
    const currentIndex = data.findIndex((d: TemperatureReading) => d.timestamp === currentTimestamp);
    let trend = 'stable';
    let trendColor = 'text-slate-400';
    let TrendIcon = MinusIcon;

    if (currentIndex > 0) {
      const currentTemp = payload[0].value;
      const prevTemp = data[currentIndex - 1].temperature;
      if (currentTemp > prevTemp) {
        trend = 'rising';
        trendColor = 'text-red-400';
        TrendIcon = ArrowUpIcon;
      } else if (currentTemp < prevTemp) {
        trend = 'falling';
        trendColor = 'text-blue-400';
        TrendIcon = ArrowDownIcon;
      }
    }

    return (
      <div className="bg-slate-700 p-2 border border-slate-600 rounded-md shadow-lg text-sm">
        <p className="text-slate-300">{`Time: ${new Date(label).toLocaleTimeString()}`}</p>
        <p className="text-cyan-400 font-semibold">{`Temp: ${payload[0].value.toFixed(1)}°F`}</p>
        <div className={`flex items-center gap-1 mt-1 ${trendColor}`}>
            <TrendIcon className="w-4 h-4" />
            <span className="text-xs font-medium">{trend.charAt(0).toUpperCase() + trend.slice(1)}</span>
        </div>
      </div>
    );
  }
  return null;
};

const TemperatureChart: React.FC<TemperatureChartProps> = ({ data }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-4 pt-8 shadow-lg h-80">
      <h3 className="text-lg font-semibold text-slate-300 mb-4 px-2">Temperature Trend (24h)</h3>
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
          <YAxis stroke="#64748b" domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip data={data} />} />
          <ReferenceLine y={98.6} label={{ value: 'Normal', position: 'insideTopLeft', fill: '#4ade80' }} stroke="#4ade80" strokeDasharray="3 3" />
          <ReferenceLine y={100.4} label={{ value: 'Fever', position: 'insideTopLeft', fill: '#f97316' }} stroke="#f97316" strokeDasharray="3 3" />
          <Line type="monotone" dataKey="temperature" stroke="#22d3ee" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;