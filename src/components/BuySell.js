import React, { useState } from 'react';

const BuySell = ({ portfolio, setPortfolio, currentPrice, formatCurrency }) => {
  const [action, setAction] = useState('buy');
  const [amount, setAmount] = useState('');

  const handleTransaction = () => {
    const shareAmount = parseFloat(amount);
    if (isNaN(shareAmount) || shareAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const totalCost = shareAmount * currentPrice;

    if (action === 'buy') {
      if (totalCost > portfolio.cash) {
        alert('Insufficient funds');
        return;
      }
      setPortfolio(prev => ({
        ...prev,
        cash: prev.cash - totalCost,
        stocks: {
          FXAIX: {
            shares: prev.stocks.FXAIX.shares + shareAmount,
            averagePrice: (prev.stocks.FXAIX.shares * prev.stocks.FXAIX.averagePrice + totalCost) / (prev.stocks.FXAIX.shares + shareAmount)
          }
        }
      }));
    } else {
      if (shareAmount > portfolio.stocks.FXAIX.shares) {
        alert('Insufficient shares');
        return;
      }
      setPortfolio(prev => ({
        ...prev,
        cash: prev.cash + totalCost,
        stocks: {
          FXAIX: {
            shares: prev.stocks.FXAIX.shares - shareAmount,
            averagePrice: prev.stocks.FXAIX.averagePrice
          }
        }
      }));
    }

    setAmount('');
    alert(`Successfully ${action === 'buy' ? 'bought' : 'sold'} ${shareAmount} shares of FXAIX`);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">Buy/Sell FXAIX</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-white mb-2">Action</label>
          <select 
            value={action} 
            onChange={(e) => setAction(e.target.value)}
            className="w-full p-2 rounded bg-white/20 text-white"
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>
        <div>
          <label className="block text-white mb-2">Amount (shares)</label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 rounded bg-white/20 text-white"
          />
        </div>
        <div>
          <p className="text-white">Current Price: {formatCurrency(currentPrice)}</p>
          <p className="text-white">Total Cost: {formatCurrency(parseFloat(amount) * currentPrice)}</p>
        </div>
        <button 
          onClick={handleTransaction}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          {action === 'buy' ? 'Buy' : 'Sell'} FXAIX
        </button>
      </div>
    </div>
  );
};

export default BuySell;
