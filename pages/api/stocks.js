export default async function handler(req, res) {
  const symbols = [
    'AMZN', 'AAPL', 'GOOGL', 'MSFT', 'NVDA', 'META', 'TSLA',
    'MU', 'SNDK', 'TSM', 'AVGO', 'CRWD', 'PANW', 'MSTR', 'PLTR',
    'PYPL', 'QQQ', 'BTC-USD'
  ];

  try {
    const stockData = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const response = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`,
            { headers: { 'User-Agent': 'Mozilla/5.0' } }
          );
          const data = await response.json();
          const meta = data.chart?.result?.[0]?.meta;
          if (!meta) return null;

          const price = meta.regularMarketPrice || 0;
          const prevClose = meta.previousClose || price;
          const change = price - prevClose;
          const changePct = prevClose ? (change / prevClose) * 100 : 0;
          const ah = meta.postMarketPrice;

          return {
            symbol: symbol.replace('-', ''),
            name: meta.shortName || symbol,
            price, change, changePercent: changePct,
            dayHigh: meta.regularMarketDayHigh,
            dayLow: meta.regularMarketDayLow,
            fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh,
            fiftyTwoWeekLow: meta.fiftyTwoWeekLow,
            volume: meta.regularMarketVolume,
            marketCap: meta.marketCap,
            afterHours: ah ? {
              price: ah,
              change: ah - price,
              changePercent: ((ah - price) / price) * 100
            } : null
          };
        } catch (e) { return null; }
      })
    );

    res.status(200).json({
      stocks: stockData.filter(s => s),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
}
