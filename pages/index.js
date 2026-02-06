import { useState, useEffect } from "react";
import Head from "next/head";

const STOCKS = {
  AMZN: {
    name: "Amazon.com",
    regularPrice: 229.15,
    regularChange: -3.53,
    regularPct: -1.52,
    regularTime: "4:00 PM",
    afterPrice: 200.02,
    afterChange: -29.13,
    afterPct: -12.71,
    afterTime: "7:45 PM",
    analysisTime: "Feb 5, 2026 8:15 PM ET",
    marketContext: { market: 40, stock: 60 },
    contextType: "EARNINGS SHOCK",
    contextNarrative: "AMZN crash is 60% stock-specific (capex shock) and 40% market. AWS +20% ignored as $200B spending terrifies investors.",
    attribution: [
      { factor: "$200B capex guidance", pct: 45, why: "Massive AI spend spooked investors" },
      { factor: "Slight EPS miss", pct: 25, why: "Even 2-cent misses punished" },
      { factor: "AWS +20% overlooked", pct: -15, why: "Best cloud quarter providing floor" }
    ],
    signal: { action: "BUY THE PANIC", confidence: 72, reasoning: "-12% after-hours on slight miss is panic. AWS +20% phenomenal." },
    summary: "Crashing on $200B capex shock. AWS crushed it but AI spending fears dominate.",
    news: [
      { headline: "CRASHES 12% after-hours on capex shock", source: "CNBC", url: "https://cnbc.com", age: "30m", weight: 100, sent: "neg" },
      { headline: "AWS beats +20.2% YoY", source: "TechCrunch", url: "https://techcrunch.com", age: "1h", weight: 85, sent: "pos" }
    ]
  },
  GOOGL: {
    name: "Alphabet Inc",
    regularPrice: 318.55,
    regularChange: -14.49,
    regularPct: -4.35,
    regularTime: "4:00 PM",
    afterPrice: 318.00,
    afterChange: -0.55,
    afterPct: -0.17,
    afterTime: "7:45 PM",
    analysisTime: "Feb 5, 2026 8:15 PM ET",
    marketContext: { market: 50, stock: 50 },
    contextType: "POST-EARNINGS",
    contextNarrative: "GOOGL is 50/50 market vs stock. Half is hyperscaler capex contagion, half is digesting $175-185B capex.",
    attribution: [
      { factor: "Capex digestion", pct: 45, why: "55% higher than expected" },
      { factor: "Cloud +48% overlooked", pct: -25, why: "Best cloud growth ignored" }
    ],
    signal: { action: "BUY", confidence: 72, reasoning: "Cloud +48% justifies capex. Entry $310-325, target $400." },
    summary: "Down 4% digesting $175-185B capex guidance. Cloud +48% phenomenal but overshadowed.",
    news: [
      { headline: "Capex shocked market", source: "Bloomberg", url: "https://bloomberg.com", age: "1d", weight: 95, sent: "neg" },
      { headline: "Cloud revenue +48% YoY", source: "CNBC", url: "https://cnbc.com", age: "1d", weight: 90, sent: "pos" }
    ]
  },
  MSFT: {
    name: "Microsoft Corp",
    regularPrice: 393.67,
    regularChange: -20.12,
    regularPct: -4.86,
    regularTime: "4:00 PM",
    afterPrice: 392.50,
    afterChange: -1.17,
    afterPct: -0.30,
    afterTime: "7:45 PM",
    analysisTime: "Feb 5, 2026 8:15 PM ET",
    marketContext: { market: 60, stock: 40 },
    contextType: "SOFTWARE MASSACRE",
    contextNarrative: "MSFT is 60% market (software down 28%) and 40% stock-specific. At 25.7x PE, CHEAPER than SP average.",
    attribution: [
      { factor: "Software sector massacre", pct: 35, why: "IGV ETF crushed" },
      { factor: "Post-earnings selloff", pct: 30, why: "Still falling after earnings" }
    ],
    signal: { action: "STRONG BUY", confidence: 78, reasoning: "Best enterprise software at 25.7x PE. Entry $390-405, target $480." },
    summary: "Down 28% from $555 high. Software being destroyed but MSFT has best AI positioning.",
    news: [
      { headline: "Software stocks in freefall", source: "Motley Fool", url: "https://fool.com", age: "2h", weight: 95, sent: "neg" }
    ]
  },
  NVDA: {
    name: "NVIDIA Corp",
    regularPrice: 171.81,
    regularChange: -8.39,
    regularPct: -4.66,
    regularTime: "4:00 PM",
    afterPrice: 170.50,
    afterChange: -1.31,
    afterPct: -0.76,
    afterTime: "7:45 PM",
    analysisTime: "Feb 5, 2026 8:15 PM ET",
    marketContext: { market: 55, stock: 45 },
    contextType: "MEMORY CRUNCH",
    contextNarrative: "NVDA is 55% market (tech rotation) and 45% stock-specific (gaming GPU delay).",
    attribution: [
      { factor: "Gaming GPU delay in 2026", pct: 40, why: "All HBM going to datacenter" },
      { factor: "Tech sector rotation", pct: 35, why: "High-multiple semis sold" }
    ],
    signal: { action: "ACCUMULATE", confidence: 75, reasoning: "Best AI play at -18% from highs. Buy $165-175, target $200+." },
    summary: "Down 4.7% on gaming GPU delay. Stock -18% from $212 high.",
    news: [
      { headline: "No new gaming GPU in 2026", source: "Reuters", url: "https://reuters.com", age: "4h", weight: 95, sent: "neg" }
    ]
  },
  AAPL: {
    name: "Apple Inc",
    regularPrice: 275.91,
    regularChange: 0.59,
    regularPct: 0.21,
    regularTime: "4:00 PM",
    afterPrice: 275.50,
    afterChange: -0.41,
    afterPct: -0.15,
    afterTime: "7:45 PM",
    analysisTime: "Feb 5, 2026 8:15 PM ET",
    marketContext: { market: 30, stock: 70 },
    contextType: "SAFE HAVEN",
    contextNarrative: "AAPL is 70% stock-specific (flight to quality). Apple trades at 28x with hardware moat.",
    attribution: [
      { factor: "Flight to quality", pct: 45, why: "Rotating from high-PE to stable" },
      { factor: "No AI capex overhang", pct: 30, why: "AI via partnerships not $200B spend" }
    ],
    signal: { action: "HOLD", confidence: 68, reasoning: "Safe haven in tech storm. Wait for $265-270 to add." },
    summary: "Outperforming during $1.2T tech wipeout. Flight to quality in action.",
    news: [
      { headline: "Outperforms during tech wipeout", source: "Bloomberg", url: "https://bloomberg.com", age: "5h", weight: 95, sent: "pos" }
    ]
  },
  TSLA: {
    name: "Tesla Inc",
    regularPrice: 397.21,
    regularChange: -8.80,
    regularPct: -2.17,
    regularTime: "4:00 PM",
    afterPrice: 395.00,
    afterChange: -2.21,
    afterPct: -0.56,
    afterTime: "7:45 PM",
    analysisTime: "Feb 5, 2026 8:15 PM ET",
    marketContext: { market: 40, stock: 60 },
    contextType: "SALES COLLAPSE",
    contextNarrative: "TSLA is 60% stock-specific (EU sales cratering). At 377x PE, valuation assumes robotics success.",
    attribution: [
      { factor: "EU sales collapse", pct: 40, why: "Brand damage in Europe" },
      { factor: "US sales slowing", pct: 25, why: "Competition from BYD" }
    ],
    signal: { action: "AVOID", confidence: 55, reasoning: "377x PE for declining sales. Wait for $350." },
    summary: "Down 2.2% as EU sales crater. At 377x PE, valuation disconnected.",
    news: [
      { headline: "EU sales collapse France -42%", source: "FT", url: "https://ft.com", age: "3d", weight: 90, sent: "neg" }
    ]
  },
  META: {
    name: "Meta Platforms",
    regularPrice: 655.00,
    regularChange: -14.00,
    regularPct: -2.09,
    regularTime: "4:00 PM",
    afterPrice: 652.00,
    afterChange: -3.00,
    afterPct: -0.46,
    afterTime: "7:45 PM",
    analysisTime: "Feb 5, 2026 8:15 PM ET",
    marketContext: { market: 50, stock: 50 },
    contextType: "CAPEX FEARS",
    contextNarrative: "META is 50/50. Half is hyperscaler capex contagion, half is $115-135B guidance concerns.",
    attribution: [
      { factor: "AI capex concerns", pct: 40, why: "Massive spending scaring investors" },
      { factor: "Post-earnings profit-taking", pct: 25, why: "Stock ran now giving back" }
    ],
    signal: { action: "BUY", confidence: 70, reasoning: "Best ad company at pre-earnings prices. Buy $640-660, target $750." },
    summary: "Down 10% from high despite crushing Q4. Capex concerns weighing.",
    news: [
      { headline: "Down 10% despite Q4 beat", source: "Bloomberg", url: "https://bloomberg.com", age: "1d", weight: 90, sent: "neg" }
    ]
  },
  PLTR: {
    name: "Palantir Tech",
    regularPrice: 140.80,
    regularChange: 1.26,
    regularPct: 0.90,
    regularTime: "4:00 PM",
    afterPrice: 139.00,
    afterChange: -1.80,
    afterPct: -1.28,
    afterTime: "7:45 PM",
    analysisTime: "Feb 5, 2026 8:15 PM ET",
    marketContext: { market: 40, stock: 60 },
    contextType: "DEAD CAT BOUNCE",
    contextNarrative: "PLTR is 60% stock-specific (221x PE, -12% yesterday). The +0.9% is dead cat bounce.",
    attribution: [
      { factor: "Dead cat bounce", pct: 45, why: "Oversold bounce shorts covering" },
      { factor: "Extreme valuation", pct: 35, why: "Priced for 10x growth" }
    ],
    signal: { action: "AVOID", confidence: 58, reasoning: "At 221x PE, still overvalued. Wait for $100-110." },
    summary: "Bouncing after -12% bloodbath. 70% growth great but 221x PE extreme.",
    news: [
      { headline: "Bouncing after -12% crash", source: "CNBC", url: "https://cnbc.com", age: "2h", weight: 90, sent: "pos" }
    ]
  },
  QQQ: {
    name: "Invesco QQQ Trust",
    regularPrice: 527.00,
    regularChange: -11.50,
    regularPct: -2.14,
    regularTime: "4:00 PM",
    afterPrice: 522.00,
    afterChange: -5.00,
    afterPct: -0.95,
    afterTime: "7:45 PM",
    analysisTime: "Feb 5, 2026 8:15 PM ET",
    marketContext: { market: 90, stock: 10 },
    contextType: "TECH INDEX",
    contextNarrative: "QQQ is 90% market dynamics. $1.2T tech wipeout driven by AI capex fears.",
    attribution: [
      { factor: "Big Tech capex fears", pct: 35, why: "$500B+ combined capex terrifying" },
      { factor: "Software sector massacre", pct: 25, why: "AI disruption fears" }
    ],
    signal: { action: "NIBBLE", confidence: 65, reasoning: "Oversold but trend down. Small buys okay." },
    summary: "$1.2T tech wipeout. Capex fears software massacre crypto crash hitting at once.",
    news: [
      { headline: "$1.2T tech wipeout this week", source: "Bloomberg", url: "https://bloomberg.com", age: "1d", weight: 95, sent: "neg" }
    ]
  }
};
export default function Dashboard() {
  var stocks = useState(STOCKS)[0];
  var setStocks = useState(STOCKS)[1];
  var watchlistState = useState(Object.keys(STOCKS));
  var watchlist = watchlistState[0];
  var setWatchlist = watchlistState[1];
  var selectedState = useState("AMZN");
  var selected = selectedState[0];
  var setSelected = selectedState[1];
  var tickerState = useState("");
  var newTicker = tickerState[0];
  var setNewTicker = tickerState[1];
  var refreshState = useState(null);
  var lastRefresh = refreshState[0];
  var setLastRefresh = refreshState[1];
  var marketState = useState(false);
  var isMarketOpen = marketState[0];
  var setIsMarketOpen = marketState[1];

  function checkMarketOpen() {
    var now = new Date();
    var et = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
    var day = et.getDay();
    var hour = et.getHours();
    var min = et.getMinutes();
    var timeNum = hour * 100 + min;
    var open = day >= 1 && day <= 5 && timeNum >= 930 && timeNum < 1600;
    setIsMarketOpen(open);
    return open;
  }

  function fetchPrices() {
    fetch("/api/stocks")
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.stocks) {
          setStocks(function(prev) {
            var updated = Object.assign({}, prev);
            data.stocks.forEach(function(s) {
              if (updated[s.symbol]) {
                updated[s.symbol] = Object.assign({}, updated[s.symbol], {
                  regularPrice: s.price,
                  regularChange: s.change,
                  regularPct: s.changePercent
                });
              }
            });
            return updated;
          });
        }
      })
      .catch(function() {});
    setLastRefresh(new Date());
  }

  useEffect(function() {
    checkMarketOpen();
    fetchPrices();
    var a = setInterval(checkMarketOpen, 60000);
    var b = setInterval(function() { if (checkMarketOpen()) fetchPrices(); }, 1800000);
    return function() { clearInterval(a); clearInterval(b); };
  }, []);

  function addTicker() {
    var t = newTicker.toUpperCase().trim();
    if (t && watchlist.indexOf(t) === -1) {
      if (stocks[t]) {
        setWatchlist(watchlist.concat([t]));
      } else {
        setStocks(function(prev) {
          var n = Object.assign({}, prev);
          n[t] = {
            name: t, regularPrice: 0, regularChange: 0, regularPct: 0, regularTime: "--",
            afterPrice: 0, afterChange: 0, afterPct: 0, afterTime: "--", analysisTime: "Pending",
            marketContext: { market: 50, stock: 50 }, contextType: "NEW", contextNarrative: "Analysis pending.",
            attribution: [], signal: { action: "ANALYZE", confidence: 0, reasoning: "Ask Claude to analyze." },
            summary: "No data yet.", news: []
          };
          return n;
        });
        setWatchlist(watchlist.concat([t]));
      }
      setNewTicker("");
    }
  }

  function removeTicker(t) {
    setWatchlist(watchlist.filter(function(x) { return x !== t; }));
    if (selected === t) setSelected(watchlist.filter(function(x) { return x !== t; })[0] || "AMZN");
  }

  function sigColor(a) {
    if (!a) return "#6b7280";
    if (a.indexOf("BUY") !== -1 || a.indexOf("ACCUMULATE") !== -1) return "#22c55e";
    if (a.indexOf("AVOID") !== -1) return "#ef4444";
    if (a.indexOf("WAIT") !== -1 || a.indexOf("HOLD") !== -1 || a.indexOf("NIBBLE") !== -1) return "#eab308";
    return "#f59e0b";
  }

  function sentColor(x) { return x === "pos" ? "#22c55e" : x === "neg" ? "#ef4444" : "#6b7280"; }

  var s = stocks[selected];
  if (!s) return null;

  function fmt(p) { return p > 1000 ? p.toLocaleString(undefined, {maximumFractionDigits: 0}) : p.toFixed(2); }
  return (
    <div>
      <Head><title>Stock Dashboard</title></Head>
      <div style={{minHeight: "100vh", background: "#0f172a", padding: 12, fontFamily: "system-ui", color: "white"}}>
        <div style={{marginBottom: 12}}>
          <h1 style={{fontSize: 18, fontWeight: "bold", margin: 0}}>Stock Dashboard</h1>
          <div style={{fontSize: 10, color: "#64748b"}}>{isMarketOpen ? "Market Open" : "Market Closed"} | Last: {lastRefresh ? lastRefresh.toLocaleTimeString() : "--"}</div>
        </div>
        <div style={{display: "flex", gap: 8, marginBottom: 12}}>
          <input type="text" value={newTicker} onChange={function(e) { setNewTicker(e.target.value.toUpperCase()); }} onKeyDown={function(e) { if (e.key === "Enter") addTicker(); }} placeholder="Add ticker..." style={{flex: 1, maxWidth: 150, background: "#1e293b", border: "1px solid #334155", borderRadius: 6, padding: "8px 12px", color: "white", fontSize: 14}} />
          <button onClick={addTicker} style={{background: "#22c55e", border: "none", borderRadius: 6, padding: "8px 16px", color: "white", fontWeight: "bold"}}>+</button>
        </div>
        <div style={{display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 16}}>
          {watchlist.map(function(sym) {
            var d = stocks[sym]; if (!d) return null; var isSel = sym === selected; var up = d.regularChange >= 0;
            return (<div key={sym} onClick={function() { setSelected(sym); }} style={{minWidth: 140, flexShrink: 0, background: isSel ? "#1e3a5f" : "#1e293b", border: "2px solid " + (isSel ? "#22d3ee" : "#334155"), borderRadius: 8, padding: 10, cursor: "pointer", position: "relative"}}>
              <button onClick={function(e) { e.stopPropagation(); removeTicker(sym); }} style={{position: "absolute", top: 4, right: 4, background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 14}}>X</button>
              <div style={{fontWeight: "bold", fontSize: 14}}>{sym}</div>
              <div style={{fontSize: 9, color: "#64748b", marginBottom: 4}}>{d.contextType}</div>
              <div style={{fontWeight: "bold", fontSize: 15}}>${fmt(d.regularPrice)}</div>
              <div style={{fontSize: 11, color: up ? "#22c55e" : "#ef4444"}}>{up ? "+" : ""}{d.regularPct.toFixed(2)}% close</div>
              {d.afterChange !== 0 && <div style={{fontSize: 10, color: d.afterChange >= 0 ? "#22c55e" : "#ef4444"}}>{d.afterChange >= 0 ? "+" : ""}{d.afterPct.toFixed(2)}% AH</div>}
            </div>);
          })}
        </div>
        <div style={{background: "#1e293b", borderRadius: 12, padding: 16, border: "1px solid #334155"}}>
          <div style={{marginBottom: 16}}>
            <div style={{display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8}}>
              <div>
                <h2 style={{fontSize: 24, fontWeight: "bold", margin: 0}}>{selected}</h2>
                <div style={{fontSize: 12, color: "#94a3b8"}}>{s.name}</div>
                <span style={{fontSize: 10, background: "#334155", padding: "2px 8px", borderRadius: 4}}>{s.contextType}</span>
              </div>
              <div style={{textAlign: "right"}}>
                <div style={{fontSize: 28, fontWeight: "bold"}}>${fmt(s.regularPrice)}</div>
                <div style={{fontSize: 14, color: s.regularChange >= 0 ? "#22c55e" : "#ef4444"}}>{s.regularChange >= 0 ? "+" : ""}{s.regularChange.toFixed(2)} ({s.regularPct >= 0 ? "+" : ""}{s.regularPct.toFixed(2)}%)</div>
                <div style={{fontSize: 10, color: "#64748b"}}>Close @ {s.regularTime}</div>
                {s.afterChange !== 0 && <div><div style={{fontSize: 12, color: s.afterChange >= 0 ? "#22c55e" : "#ef4444", marginTop: 4}}>AH: {s.afterChange >= 0 ? "+" : ""}{s.afterChange.toFixed(2)} ({s.afterPct >= 0 ? "+" : ""}{s.afterPct.toFixed(2)}%)</div><div style={{fontSize: 10, color: "#64748b"}}>After-hours @ {s.afterTime}</div></div>}
              </div>
            </div>
            <div style={{fontSize: 9, color: "#475569", marginTop: 8}}>Analysis: {s.analysisTime}</div>
          </div>
          <div style={{background: "#111827", borderRadius: 8, padding: 12, marginBottom: 12, borderLeft: "4px solid " + sigColor(s.signal.action)}}>
            <div style={{display: "flex", justifyContent: "space-between", marginBottom: 6}}>
              <div><div style={{fontSize: 9, color: "#9ca3af"}}>SIGNAL</div><div style={{color: sigColor(s.signal.action), fontWeight: 700, fontSize: 15}}>{s.signal.action}</div></div>
              <div style={{textAlign: "right"}}><div style={{fontSize: 9, color: "#9ca3af"}}>CONFIDENCE</div><div style={{fontWeight: 700, fontSize: 16}}>{s.signal.confidence}%</div></div>
            </div>
            <div style={{fontSize: 12, color: "#d1d5db"}}>{s.signal.reasoning}</div>
          </div>
          <div style={{background: "#111827", borderRadius: 8, padding: 12, marginBottom: 12}}>
            <div style={{fontSize: 11, color: "#9ca3af", marginBottom: 8}}>MARKET vs STOCK</div>
            <div style={{display: "flex", height: 8, borderRadius: 4, overflow: "hidden", marginBottom: 6}}><div style={{width: s.marketContext.market + "%", background: "#3b82f6"}}></div><div style={{width: s.marketContext.stock + "%", background: "#f59e0b"}}></div></div>
            <div style={{display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 8}}><span style={{color: "#3b82f6"}}>Market: {s.marketContext.market}%</span><span style={{color: "#f59e0b"}}>Stock: {s.marketContext.stock}%</span></div>
            <div style={{fontSize: 11, color: "#94a3b8"}}>{s.contextNarrative}</div>
          </div>
          {s.attribution.length > 0 && <div style={{marginBottom: 12}}><div style={{fontSize: 11, color: "#9ca3af", marginBottom: 8}}>WHY ITS MOVING</div>{s.attribution.map(function(a, i) { return (<div key={i} style={{background: "#111827", borderRadius: 6, padding: 8, marginBottom: 6}}><div style={{display: "flex", justifyContent: "space-between", marginBottom: 2}}><span style={{fontWeight: 600, fontSize: 11}}>{a.factor}</span><span style={{background: a.pct > 0 ? "#7f1d1d" : "#14532d", color: a.pct > 0 ? "#fca5a5" : "#86efac", padding: "1px 6px", borderRadius: 4, fontSize: 10, fontWeight: 600}}>{a.pct > 0 ? "+" : ""}{a.pct}%</span></div><div style={{fontSize: 10, color: "#9ca3af"}}>{a.why}</div></div>); })}</div>}
          <div style={{background: "#111827", borderRadius: 8, padding: 10, marginBottom: 12}}><div style={{fontSize: 10, color: "#9ca3af", marginBottom: 4}}>SUMMARY</div><div style={{fontSize: 12, color: "#d1d5db"}}>{s.summary}</div></div>
          {s.news.length > 0 && <div><div style={{fontSize: 11, color: "#9ca3af", marginBottom: 8}}>NEWS SOURCES</div>{s.news.map(function(n, i) { return (<div key={i} style={{display: "flex", alignItems: "flex-start", gap: 8, padding: 8, background: i % 2 === 0 ? "#111827" : "transparent", borderRadius: 6, marginBottom: 2}}><div style={{width: 6, height: 6, borderRadius: "50%", background: sentColor(n.sent), marginTop: 4, flexShrink: 0}}></div><div style={{flex: 1}}><div style={{fontSize: 11}}>{n.headline}</div><div style={{fontSize: 9, color: "#6b7280", marginTop: 2}}><a href={n.url} target="_blank" rel="noopener noreferrer" style={{color: "#22d3ee", textDecoration: "none"}}>{n.source}</a> | {n.age} | Wt:{n.weight}</div></div></div>); })}</div>}
        </div>
        <div style={{textAlign: "center", marginTop: 12, fontSize: 9, color: "#475569"}}>Not financial advice</div>
      </div>
    </div>
  );
}
