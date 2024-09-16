const API_KEY = 'A1AKPGQAATPJJYN1';

export const fetchQuote = async (symbol) => {
  const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
  const data = await response.json();
  if (data['Error Message']) {
    throw new Error(data['Error Message']);
  }
  return {
    symbol: data['Global Quote']['01. symbol'],
    price: parseFloat(data['Global Quote']['05. price']),
    change: parseFloat(data['Global Quote']['09. change']),
    changePercent: parseFloat(data['Global Quote']['10. change percent'].replace('%', '')) / 100,
  };
};

export const fetchHistoricalData = async (symbol, startDate, endDate) => {
  const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=full&apikey=${API_KEY}`);
  const data = await response.json();
  if (data['Error Message']) {
    throw new Error(data['Error Message']);
  }
  const timeSeries = data['Time Series (Daily)'];
  
  return Object.entries(timeSeries)
    .filter(([date]) => date >= startDate && date <= endDate)
    .map(([date, values]) => ({
      date,
      price: parseFloat(values['5. adjusted close']),
    }))
    .reverse();
};

export const fetchCurrentPrice = async (symbol) => {
  const quote = await fetchQuote(symbol);
  return quote.price;
};
