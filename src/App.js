import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Papa from 'papaparse';
import Dashboard from './components/Dashboard';
import BuySell from './components/BuySell';
import Deposit from './components/Deposit';
import Analytics from './components/Analytics';

const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
const formatPercentage = (value) => new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2 }).format(value);

const App = () => {
  const [portfolio, setPortfolio] = useState({
    cash: 0,
    stocks: { FXAIX: { shares: 0, averagePrice: 0 } },
    initialInvestment: 2500,
    investmentDate: '2023-03-01'
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    console.log('Fetching CSV data...');
    fetch('/data/fxaix.csv')
      .then(response => response.text())
      .then(csvString => {
        console.log('CSV data fetched, parsing...');
        Papa.parse(csvString, {
          header: true,
          complete: (results) => {
            console.log('Parsing complete, processing data...');
            const processedData = results.data
              .filter(row => row.Date && row.Close)
              .map(row => ({
                date: row.Date,
                price: parseFloat(row.Close)
              }))
              .sort((a, b) => new Date(a.date) - new Date(b.date));

            console.log('Processed data:', processedData);
            setChartData(processedData);

            const investmentDateData = processedData.find(d => d.date === portfolio.investmentDate);
            console.log('Investment date data:', investmentDateData);
            if (investmentDateData) {
              const sharesBought = portfolio.initialInvestment / investmentDateData.price;
              console.log('Shares bought:', sharesBought);
              setPortfolio(prev => ({
                ...prev,
                stocks: { FXAIX: { shares: sharesBought, averagePrice: investmentDateData.price } }
              }));
            }
          }
        });
      })
      .catch(error => console.error('Error fetching or parsing CSV:', error));
  }, []);

  useEffect(() => {
    console.log('Updated portfolio:', portfolio);
    console.log('Updated chart data:', chartData);
  }, [portfolio, chartData]);

  const currentPrice = chartData[chartData.length - 1]?.price || 0;
  const currentValue = portfolio.stocks.FXAIX.shares * currentPrice;
  const totalReturn = (currentValue - portfolio.initialInvestment) / portfolio.initialInvestment;

  console.log('Current price:', currentPrice);
  console.log('Current value:', currentValue);
  console.log('Total return:', totalReturn);

  return (
    <Router>
      {/* ... rest of your component ... */}
    </Router>
  );
};

export default App;
