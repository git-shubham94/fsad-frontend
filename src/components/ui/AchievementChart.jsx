import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import '../../styles/chart.css';

const AchievementChart = ({ achievements }) => {
  const data = [
    {
      name: 'Awards',
      value: achievements.filter((a) => a.category === 'award').length,
      color: '#534AB7',
    },
    {
      name: 'Recognitions',
      value: achievements.filter((a) => a.category === 'recognition').length,
      color: '#1D9E75',
    },
    {
      name: 'Participations',
      value: achievements.filter((a) => a.category === 'participation').length,
      color: '#BA7517',
    },
  ].filter((d) => d.value > 0);

  if (!data.length) {
    return null;
  }

  return (
    <motion.div
      className="chart-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>Achievement Distribution</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              borderColor: '#E0DED8',
              borderRadius: '8px',
              color: '#111827'
            }}
            itemStyle={{ color: '#111827' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default AchievementChart;
