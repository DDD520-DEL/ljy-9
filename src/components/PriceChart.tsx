import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { PriceHistory } from '../types';
import { formatPrice } from '../utils/format';

interface PriceChartProps {
  priceHistory: PriceHistory[];
  height?: number;
}

const platformColors: Record<string, string> = {
  '雅虎拍卖': '#8b5cf6',
  Mercari: '#06b6d4',
  eBay: '#ec4899',
  '闲鱼': '#10b981',
};

const PriceChart = ({ priceHistory, height = 300 }: PriceChartProps) => {
  const aggregatedData = priceHistory.reduce((acc: any[], item) => {
    const existingDate = acc.find((d) => d.date === item.date);
    if (existingDate) {
      existingDate[item.source] = item.price;
    } else {
      acc.push({
        date: item.date,
        [item.source]: item.price,
      });
    }
    return acc;
  }, []);

  aggregatedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const sources = [...new Set(priceHistory.map((p) => p.source))];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-darker-navy border-2 border-neon-purple/50 p-3 rounded">
          <p className="font-retro text-gray-300 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 font-retro">
              <span style={{ color: entry.color }}>{entry.name}</span>
              <span className="text-white">{formatPrice(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={aggregatedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            tick={{ fill: '#9ca3af', fontSize: 12, fontFamily: 'VT323' }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis
            stroke="#6b7280"
            tick={{ fill: '#9ca3af', fontSize: 12, fontFamily: 'VT323' }}
            tickFormatter={(value) => `¥${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              fontFamily: 'VT323',
              fontSize: '16px',
            }}
          />
          {sources.map((source) => (
            <Line
              key={source}
              type="monotone"
              dataKey={source}
              stroke={platformColors[source] || '#8b5cf6'}
              strokeWidth={2}
              dot={{ fill: platformColors[source] || '#8b5cf6', r: 3 }}
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
