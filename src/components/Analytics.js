import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Analytics = ({ portfolio, chartData, formatCurrency, formatPercentage }) => {
  const currentPrice = chartData[chartData.length - 1]?.price || 0;
  const stockValue = portfolio.stocks.FXAIX.shares * currentPrice;
  const totalValue = stockValue + portfolio.cash;

  const data = [
    { name: 'FXAIX', value: stockValue },
    { name: 'Cash', value: portfolio.cash }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">Portfolio Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-white">Asset Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2 text-white">Portfolio Summary</h3>
          <p className="text-white">Total Value: {formatCurrency(totalValue)}</p>
          <p className="text-white">FXAIX Value: {formatCurrency(stockValue)} ({formatPercentage(stockValue / totalValue)})</p>
          <p className="text-white">Cash: {formatCurrency(portfolio.cash)} ({formatPercentage(portfolio.cash / totalValue)})</p>
          <p className="text-white">FXAIX Shares: {portfolio.stocks.FXAIX.shares.toFixed(2)}</p>
          <p className="text-white">Average Buy Price: {formatCurrency(portfolio.stocks.FXAIX.averagePrice)}</p>
          <p className="text-white">Current FXAIX Price: {formatCurrency(currentPrice)}</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
