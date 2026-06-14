import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatPrice } from '../utils/format';

interface MonthlyValuePoint {
  month: string;
  value: number;
  change: number | null;
}

const CollectionValueChart = () => {
  const [data, setData] = useState<MonthlyValuePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonthlyValue = async () => {
      try {
        const res = await fetch('/api/stats/monthly-value');
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch monthly value:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMonthlyValue();
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 font-retro">
        加载中...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 font-retro">
        暂无数据
      </div>
    );
  }

  const latestChange = data[data.length - 1]?.change;
  const chartData = data.map((item) => ({
    ...item,
    displayMonth: item.month.split('-')[1] + '月',
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as MonthlyValuePoint & { displayMonth: string };
      return (
        <div className="bg-darker-navy border-2 border-neon-purple/50 p-3 rounded">
          <p className="font-retro text-gray-300 mb-1">{item.month}</p>
          <p className="font-retro text-white">
            收藏总价值: {formatPrice(item.value)}
          </p>
          {item.change !== null && (
            <p
              className={`font-retro text-sm ${
                item.change >= 0 ? 'text-neon-green' : 'text-neon-red'
              }`}
            >
              环比: {item.change >= 0 ? '+' : ''}
              {item.change}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {latestChange !== null && latestChange !== undefined && (
            <>
              {latestChange >= 0 ? (
                <TrendingUp className="w-5 h-5 text-neon-green" />
              ) : (
                <TrendingDown className="w-5 h-5 text-neon-red" />
              )}
              <span
                className={`font-pixel text-sm ${
                  latestChange >= 0 ? 'text-neon-green' : 'text-neon-red'
                }`}
              >
                {latestChange >= 0 ? '+' : ''}
                {latestChange}%
              </span>
              <span className="font-retro text-gray-400 text-sm">较上月</span>
            </>
          )}
        </div>
      </div>

      <div className="w-full" style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis
              dataKey="displayMonth"
              stroke="#6b7280"
              tick={{ fill: '#9ca3af', fontSize: 14, fontFamily: 'VT323' }}
              axisLine={{ stroke: '#374151' }}
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fill: '#9ca3af', fontSize: 12, fontFamily: 'VT323' }}
              tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
              axisLine={{ stroke: '#374151' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.change !== null && entry.change < 0
                      ? '#ef4444'
                      : index === chartData.length - 1
                      ? '#06b6d4'
                      : '#8b5cf6'
                  }
                  fillOpacity={index === chartData.length - 1 ? 1 : 0.7}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {chartData.slice(-3).map((item) => (
          <div key={item.month} className="text-center p-2 rounded bg-gray-800/40">
            <p className="font-retro text-gray-400 text-xs">{item.displayMonth}</p>
            <p className="font-pixel text-sm text-white">{formatPrice(item.value)}</p>
            {item.change !== null && (
              <p
                className={`font-retro text-xs ${
                  item.change >= 0 ? 'text-neon-green' : 'text-neon-red'
                }`}
              >
                {item.change >= 0 ? '+' : ''}
                {item.change}%
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionValueChart;
