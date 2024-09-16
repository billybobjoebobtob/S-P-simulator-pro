import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';

const Dashboard = ({ portfolio, chartData, currentValue, totalReturn, formatCurrency, formatPercentage }) => {
  const [showHistorical, setShowHistorical] = useState(false);

  const filteredData = useMemo(() => {
    if (showHistorical) return chartData;
    return chartData.filter(d => new Date(d.date) >= new Date(portfolio.investmentDate));
  }, [chartData, portfolio.investmentDate, showHistorical]);

  const portfolioData = useMemo(() => {
    return filteredData.map(d => ({
      ...d,
      portfolioValue: (portfolio.stocks.FXAIX.shares * d.price)
    }));
  }, [filteredData, portfolio.stocks.FXAIX.shares]);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-2xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Portfolio: FXAIX</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/20 rounded-lg p-4">
          <h2 className="text-lg font-semibold">Initial Investment</h2>
          <p className="text-3xl font-bold">{formatCurrency(portfolio.initialInvestment)}</p>
        </div>
        <div className="bg-white/20 rounded-lg p-4">
          <h2 className="text-lg font-semibold">Current Value</h2>
          <p className="text-3xl font-bold">{formatCurrency(currentValue)}</p>
        </div>
        <div className="bg-white/20 rounded-lg p-4">
          <h2 className="text-lg font-semibold">Total Return</h2>
          <p className="text-3xl font-bold">{formatPercentage(totalReturn)}</p>
        </div>
      </div>
      
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => setShowHistorical(!showHistorical)}
          className="px-3 py-1 rounded bg-green-500 text-white"
        >
          {showHistorical ? 'Hide Historical' : 'Show Historical'}
        </button>
      </div>
      
      <div style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={portfolioData}>
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip
              formatter={(value, name) => [
                formatCurrency(value),
                name === 'price' ? 'FXAIX Price' : 'Portfolio Value'
              ]}
            />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="price" stroke="#8884d8" dot={false} name="FXAIX Price" />
            <Line yAxisId="right" type="monotone" dataKey="portfolioValue" stroke="#82ca9d" dot={false} name="Portfolio Value" />
            <ReferenceLine yAxisId="left" x={portfolio.investmentDate} stroke="red" label="Purchase Date" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
