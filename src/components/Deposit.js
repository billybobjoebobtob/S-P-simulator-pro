import React, { useState } from 'react';

const Deposit = ({ portfolio, setPortfolio, formatCurrency }) => {
  const [amount, setAmount] = useState('');

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setPortfolio(prev => ({
      ...prev,
      cash: prev.cash + depositAmount
    }));

    setAmount('');
    alert(`Successfully deposited ${formatCurrency(depositAmount)}`);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">Deposit Funds</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-white mb-2">Amount to Deposit</label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 rounded bg-white/20 text-white"
          />
        </div>
        <button 
          onClick={handleDeposit}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Deposit
        </button>
        <p className="text-white">Current Cash Balance: {formatCurrency(portfolio.cash)}</p>
      </div>
    </div>
  );
};

export default Deposit;
