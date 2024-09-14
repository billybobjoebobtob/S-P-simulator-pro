import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
const formatPercentage = (value) => new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2 }).format(value);

// Condensed S&P 500 historical data (monthly closes)
const sp500HistoricalData = [
  { date: '2022-01-01', price: 4766.18 },
  { date: '2022-02-01', price: 4373.94 },
  { date: '2022-03-01', price: 4530.41 },
  { date: '2022-04-01', price: 4131.93 },
  { date: '2022-05-01', price: 4132.15 },
  { date: '2022-06-01', price: 3785.38 },
  { date: '2022-07-01', price: 4130.29 },
  { date: '2022-08-01', price: 3955.00 },
  { date: '2022-09-01', price: 3585.62 },
  { date: '2022-10-01', price: 3871.98 },
  { date: '2022-11-01', price: 4080.11 },
  { date: '2022-12-01', price: 3839.50 },
  { date: '2023-01-01', price: 4076.60 },
  { date: '2023-02-01', price: 3970.15 },
  { date: '2023-03-01', price: 4109.31 },
  { date: '2023-04-01', price: 4169.48 },
  { date: '2023-05-01', price: 4179.83 },
  { date: '2023-06-01', price: 4450.38 },
  { date: '2023-07-01', price: 4588.96 },
  { date: '2023-08-01', price: 4507.66 },
  { date: '2023-09-01', price: 4288.05 },
  // Add more recent data as needed
];

const App = () => {
  const [timeRange, setTimeRange] = useState('ALL');
  const [chartData, setChartData] = useState([]);
  const [investment, setInvestment] = useState({ amount: 2500, date: '2022-03-01', symbol: 'AFAIX' });

  useEffect(() => {
    const filteredData = filterDataByRange(sp500HistoricalData, timeRange);
    const investmentData = calculateInvestmentValue(filteredData, investment);
    setChartData(investmentData);
  }, [timeRange, investment]);

  const filterDataByRange = (data, range) => {
    const endDate = new Date(data[data.length - 1].date);
    let startDate = new Date(endDate);
    
    switch(range) {
      case '1M': startDate.setMonth(startDate.getMonth() - 1); break;
      case '3M': startDate.setMonth(startDate.getMonth() - 3); break;
      case '6M': startDate.setMonth(startDate.getMonth() - 6); break;
      case '1Y': startDate.setFullYear(startDate.getFullYear() - 1); break;
      case '3Y': startDate.setFullYear(startDate.getFullYear() - 3); break;
      default: return data;
    }
    
    return data.filter(item => new Date(item.date) >= startDate);
  };

  const calculateInvestmentValue = (data, inv) => {
    const startIndex = data.findIndex(d => d.date >= inv.date);
    const startPrice = data[startIndex].price;
    return data.slice(startIndex).map(d => ({
      date: d.date,
      value: inv.amount * (d.price / startPrice)
    }));
  };

  const currentValue = chartData[chartData.length - 1]?.value || investment.amount;
  const totalReturn = (currentValue / investment.amount - 1) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">S&P 500 Portfolio Simulator Pro</h1>
      
      <div className="mb-4">
        {['1M', '3M', '6M', '1Y', '3Y', 'ALL'].map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`mr-2 px-3 py-1 rounded ${timeRange === range ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          >
            {range}
          </button>
        ))}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8" style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value) => [formatCurrency(value), "Investment Value"]} />
            <Line type="monotone" dataKey="value" stroke="#3498db" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Investment Summary</h2>
        <div className="text-3xl font-bold text-blue-600 mb-2">
          {formatCurrency(currentValue)}
        </div>
        <div className="text-lg">
          Initial Investment: {formatCurrency(investment.amount)} on {investment.date}
        </div>
        <div className="text-lg">
          Total Return: {formatPercentage(totalReturn / 100)} ({totalReturn.toFixed(2)}%)
        </div>
      </div>
    </div>
  );
};

export default App;
