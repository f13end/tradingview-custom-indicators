//@version=3

// BTC WORLD PRICE (Multi-Exchange VWAP)
//  Multi-exchange volume-weighted average price
//  Release: 2018-03-20
//  Author: Phil Ledru
//  Email: mail@phil.world
//  GitHub: https://github.com/PhilWorld/tradingview-indicators

// PURPOSE
//  Quotes BTC price and volume from 8 exchanges, and returns weighted averages.
//  Includes USD, EUR, JPY, KRW and USDT sources.

// FEATURES
//  - Display Candles (regular) or Heikin-Ashi (averaged).
//  - OHLC price available for other indicators.

// REMARKS:
//  - To have the chart go back as far as possible in history, use "BITSTAMP:BTCUSD" as the main TradingView Chart Symbol (top-left corner).
//  - In Format > Style, uncheck everything but "Candles" and "Wicks" to clear all the clutter (scale values etc.) 

// EXCHANGES (Total: >30% of reported volume on CoinMarketCap, 2018-03-11)
//  Rank Exchange   Vol %   TV TICKER           Start Date  Currency
//  00   Bitmex     (~50%)  BITMEX:XBTUSD       2017-01-01  USD Contracts (note: volume in USD, others in BTC)
//  01   Bitfinex   10.75%  BITFINEX:BTCUSD     2013-03-31  USD
//  02   Binance    6.40%   BINANCE:BTCUSDT     2017-08-17  USDT
//  03   bitFlyer   3.55%   BITFLYER:BTCJPY     2015-06-24  JPY
//  04   Bithumb    3.26%   BITHUMB:BTCKRW      2013-12-27  KRW
//  05   Coinbase   3.00%   COINBASE:BTCUSD     2014-12-01  USD
//  06   Bitstamp	2.84%   BITSTAMP:BTCUSD     2011-08-18  USD
//  08   Kraken     1.97%   KRAKEN:XBTEUR       2013-09-10  EUR (included for EUR quote)

// Unfortunately we cannot work with these, because Pine Script is limited to 40 security calls.
// Here for reference and quick edits.
//  07   Kraken     2.09%   KRAKEN:XBTUSD       2013-10-06  USD
//  09   HitBTC	    0.87%	HITBTC:BTCUSD	    2013-12-27	USD
//  10   Bittrex    0.70%	BITTREX:BTCUSDT	    2015-12-12	USDT
//  11   Bitfinex	0.60%	BITFINEX:BTCEUR	    2017-11-14	EUR
//  12   Poloniex	0.59%	POLONIEX:BTCUSDT	2015-02-19	USDT
//  13   Bitstamp	0.55%	BITSTAMP:BTCEUR	    2016-04-16	EUR
//  14   Coinbase	0.51%	COINBASE:BTCEUR	    2015-04-23	EUR
//  15   CEX.io	    0.36%	CEXIO:BTCUSD	    2014-07-18	USD
//  16   Korbit	    0.34%	KORBIT:BTCKRW	    2013-09-03	KRW

// INDICATOR PARAMETERS
sTitle      = "BTC World Price: Multi-Exchange VWAP"
sShort      = "BTC World Price (USD)"
sRelease    = "2018-03-20"
sOverlay    = true
sScale      = scale.right
sPrecision  = 6     
// Precision 0 is fine for BTCUSD, but 6 is better for FOREX calls (e.g. JPYUSD).
// Change Decimals Places to 1/1 in "Scale Properties" > "Scale" to clean the Right/Left Axis.

study(title=sTitle+" [v"+sRelease+"]", shorttitle=sShort, overlay=sOverlay, scale=sScale, precision=sPrecision)



// ________________________
// ________ INPUTS ________

// Chart Type: Candlesticks (default) or Heikin Ashi (average)
candlesType = input(title="Candles Type", type=string, options=["Candles (regular)", "Heikin Ashi"], defval="Candles (regular)")


// Selection of which symbols to use
ticker1Exchange = input(title="Ticker 1 Exchange", type=string, defval="BITMEX")
ticker1Symbol   = input(title="Ticker 1 Symbol"  , type=string, defval="XBT")
ticker1Currency = input(title="Ticker 1 Currency", type=string, defval="USD")
ticker1 = ticker1Exchange + ":" + ticker1Symbol + ticker1Currency

ticker2Exchange = input(title="Ticker 2 Exchange", type=string, defval="BITFINEX")
ticker2Symbol   = input(title="Ticker 2 Symbol"  , type=string, defval="BTC")
ticker2Currency = input(title="Ticker 2 Currency", type=string, defval="USD")
ticker2 = ticker2Exchange + ":" + ticker2Symbol + ticker2Currency

ticker3Exchange = input(title="Ticker 3 Exchange", type=string, defval="BINANCE")
ticker3Symbol   = input(title="Ticker 3 Symbol"  , type=string, defval="BTC")
ticker3Currency = input(title="Ticker 3 Currency", type=string, defval="USDT")
ticker3 = ticker3Exchange + ":" + ticker3Symbol + ticker3Currency

ticker4Exchange = input(title="Ticker 4 Exchange", type=string, defval="BITFLYER")
ticker4Symbol   = input(title="Ticker 4 Symbol"  , type=string, defval="BTC")
ticker4Currency = input(title="Ticker 4 Currency", type=string, defval="JPY")
ticker4 = ticker4Exchange + ":" + ticker4Symbol + ticker4Currency

ticker5Exchange = input(title="Ticker 5 Exchange", type=string, defval="BITHUMB")
ticker5Symbol   = input(title="Ticker 5 Symbol"  , type=string, defval="BTC")
ticker5Currency = input(title="Ticker 5 Currency", type=string, defval="KRW")
ticker5 = ticker5Exchange + ":" + ticker5Symbol + ticker5Currency

ticker6Exchange = input(title="Ticker 6 Exchange", type=string, defval="COINBASE")
ticker6Symbol   = input(title="Ticker 6 Symbol"  , type=string, defval="BTC")
ticker6Currency = input(title="Ticker 6 Currency", type=string, defval="USD")
ticker6 = ticker6Exchange + ":" + ticker6Symbol + ticker6Currency

ticker7Exchange = input(title="Ticker 7 Exchange", type=string, defval="BITSTAMP")
ticker7Symbol   = input(title="Ticker 7 Symbol"  , type=string, defval="BTC")
ticker7Currency = input(title="Ticker 7 Currency", type=string, defval="USD")
ticker7 = ticker7Exchange + ":" + ticker7Symbol + ticker7Currency

ticker8Exchange = input(title="Ticker 8 Exchange", type=string, defval="KRAKEN")
ticker8Symbol   = input(title="Ticker 8 Symbol"  , type=string, defval="XBT")
ticker8Currency = input(title="Ticker 8 Currency", type=string, defval="EUR")
ticker8 = ticker8Exchange + ":" + ticker8Symbol + ticker8Currency


// if Heikin Ashi, request Heikin-Ashi data using the special ticker identifier, otherwise normal ticker
tickerID1 = iff(candlesType == "Heikin Ashi", heikinashi(ticker1), ticker1 )
tickerID2 = iff(candlesType == "Heikin Ashi", heikinashi(ticker2), ticker2 )
tickerID3 = iff(candlesType == "Heikin Ashi", heikinashi(ticker3), ticker3 )
tickerID4 = iff(candlesType == "Heikin Ashi", heikinashi(ticker4), ticker4 )
tickerID5 = iff(candlesType == "Heikin Ashi", heikinashi(ticker5), ticker5 )
tickerID6 = iff(candlesType == "Heikin Ashi", heikinashi(ticker6), ticker6 )
tickerID7 = iff(candlesType == "Heikin Ashi", heikinashi(ticker7), ticker7 )
tickerID8 = iff(candlesType == "Heikin Ashi", heikinashi(ticker8), ticker8 )



// ________________________
// ________ QUOTES ________

// FOREX CURRENCY CONVERSION RATES

// The following 7 lines are a little weird: for some reason, if this variable is not a valid security tickerID for tickerNForexClose, 
//   the script will "error: can't resolve", even though in such a case the security call would never happen (point of the iff statement in tickerNForexClose).
// This is a HACK: it uses the built-in ticker variable, even though it will never be used except for comparison in tickerNForexClose.

// Create a FOREX ticker ID if necessary (tickerN currency different from USD)
// forexNTickerID is a concatenation of tickerNCurrency (e.g. "EUR") and "USD" => e.g. "EURUSD"
forex1TickerID = iff(ticker1Currency=="USD", ticker, ticker1Currency + "USD" )
forex2TickerID = iff(ticker2Currency=="USD", ticker, ticker2Currency + "USD" )
forex3TickerID = iff(ticker3Currency=="USD", ticker, ticker3Currency + "USD" )
forex4TickerID = iff(ticker4Currency=="USD", ticker, ticker4Currency + "USD" )
forex5TickerID = iff(ticker5Currency=="USD", ticker, ticker5Currency + "USD" )
forex6TickerID = iff(ticker6Currency=="USD", ticker, ticker6Currency + "USD" )
forex7TickerID = iff(ticker7Currency=="USD", ticker, ticker7Currency + "USD" )
forex8TickerID = iff(ticker8Currency=="USD", ticker, ticker8Currency + "USD" )
// (Again, pay attention that the built-in 'ticker' variable, used in the 8 lines above and below,
//   makes no sense in this context and is used solely for comparison, 
//   it is a HACK to make the script resolve correctly.)

// If necessary, call the FOREX currency conversion rate (e.g. "EURUSD"), otherwise we leave it at 1.
// Notice that identical security calls (e.g. twice "EURUSD") should be optimized as only 1 call, during compilation). From my tests, it does not...

// Call the FOREX conversion rate, otherwise assign 1 to the variable (which mathematically means: no conversion)
ticker1ForexClose = iff(forex1TickerID==ticker, 1, security(forex1TickerID, period, close))
ticker2ForexClose = iff(forex2TickerID==ticker, 1, security(forex2TickerID, period, close))
ticker3ForexClose = iff(forex3TickerID==ticker, 1, security(forex3TickerID, period, close))
ticker4ForexClose = iff(forex4TickerID==ticker, 1, security(forex4TickerID, period, close))
ticker5ForexClose = iff(forex5TickerID==ticker, 1, security(forex5TickerID, period, close))
ticker6ForexClose = iff(forex6TickerID==ticker, 1, security(forex6TickerID, period, close))
ticker7ForexClose = iff(forex7TickerID==ticker, 1, security(forex7TickerID, period, close))
ticker8ForexClose = iff(forex8TickerID==ticker, 1, security(forex8TickerID, period, close))

// Open FOREX values are extracted from the previous close, to reduce the number of security calls, and improve consistency (a "good enough" trade-off)
ticker1ForexOpen = offset(ticker1ForexClose, 1)
ticker2ForexOpen = offset(ticker2ForexClose, 1)
ticker3ForexOpen = offset(ticker3ForexClose, 1)
ticker4ForexOpen = offset(ticker4ForexClose, 1)
ticker5ForexOpen = offset(ticker5ForexClose, 1)
ticker6ForexOpen = offset(ticker6ForexClose, 1)
ticker7ForexOpen = offset(ticker7ForexClose, 1)
ticker8ForexOpen = offset(ticker8ForexClose, 1)

// Tickers Highs and Lows will be converted using a FOREX average of each open and close
ticker1ForexAvg = (ticker1ForexClose + ticker1ForexOpen) / 2
ticker2ForexAvg = (ticker2ForexClose + ticker2ForexOpen) / 2
ticker3ForexAvg = (ticker3ForexClose + ticker3ForexOpen) / 2
ticker4ForexAvg = (ticker4ForexClose + ticker4ForexOpen) / 2
ticker5ForexAvg = (ticker5ForexClose + ticker5ForexOpen) / 2
ticker6ForexAvg = (ticker6ForexClose + ticker6ForexOpen) / 2
ticker7ForexAvg = (ticker7ForexClose + ticker7ForexOpen) / 2
ticker8ForexAvg = (ticker8ForexClose + ticker8ForexOpen) / 2


// TICKER CALLS

// Each series is denominated symN (i.e. "symbol", N=1~7).
// Candles require the Open, High, Low and Close values.
// Volume-weighting requires quoting the volume as well.
// We "cheat" slightly by using the previous Close as the Open of the next tick (to reduce the amount of security calls).

// Each "symN" series contains the price converted to the reference currency.
// When a symbol is called prior to its introduction in TradingView (see dates in comments, table at the top of this script),
//   the resulting value is "NaN". It needs to be converted to zero using the nz() function, for computations below.
//   Failing to do so would limit the chart to the most recent ticker.

// High
sym1High = nz( security(tickerID1, period, high) * ticker1ForexAvg )
sym2High = nz( security(tickerID2, period, high) * ticker2ForexAvg )
sym3High = nz( security(tickerID3, period, high) * ticker3ForexAvg )
sym4High = nz( security(tickerID4, period, high) * ticker4ForexAvg )
sym5High = nz( security(tickerID5, period, high) * ticker5ForexAvg )
sym6High = nz( security(tickerID6, period, high) * ticker6ForexAvg )
sym7High = nz( security(tickerID7, period, high) * ticker7ForexAvg )
sym8High = nz( security(tickerID8, period, high) * ticker8ForexAvg )

// Low
sym1Low = nz( security(tickerID1, period, low) * ticker1ForexAvg )
sym2Low = nz( security(tickerID2, period, low) * ticker2ForexAvg )
sym3Low = nz( security(tickerID3, period, low) * ticker3ForexAvg )
sym4Low = nz( security(tickerID4, period, low) * ticker4ForexAvg )
sym5Low = nz( security(tickerID5, period, low) * ticker5ForexAvg )
sym6Low = nz( security(tickerID6, period, low) * ticker6ForexAvg )
sym7Low = nz( security(tickerID7, period, low) * ticker7ForexAvg )
sym8Low = nz( security(tickerID8, period, low) * ticker8ForexAvg )

// Close
sym1Close = nz( security(tickerID1, period, close) * ticker1ForexClose )
sym2Close = nz( security(tickerID2, period, close) * ticker2ForexClose )
sym3Close = nz( security(tickerID3, period, close) * ticker3ForexClose )
sym4Close = nz( security(tickerID4, period, close) * ticker4ForexClose )
sym5Close = nz( security(tickerID5, period, close) * ticker5ForexClose )
sym6Close = nz( security(tickerID6, period, close) * ticker6ForexClose )
sym7Close = nz( security(tickerID7, period, close) * ticker7ForexClose )
sym8Close = nz( security(tickerID8, period, close) * ticker8ForexClose )

// Open [NOTE: Small cheat here: using previous close value, to limit security calls.]
sym1Open = offset(sym1Close, 1)     // formally should be: nz( security(tickerID1, period, open) * ticker1ForexOpen )
sym2Open = offset(sym2Close, 1)     // formally should be: nz( security(tickerID2, period, open) * ticker2ForexOpen )
sym3Open = offset(sym3Close, 1)     // formally should be: nz( security(tickerID3, period, open) * ticker3ForexOpen )
sym4Open = offset(sym4Close, 1)     // formally should be: nz( security(tickerID4, period, open) * ticker4ForexOpen )
sym5Open = offset(sym5Close, 1)     // formally should be: nz( security(tickerID5, period, open) * ticker5ForexOpen )
sym6Open = offset(sym6Close, 1)     // formally should be: nz( security(tickerID6, period, open) * ticker6ForexOpen )
sym7Open = offset(sym7Close, 1)     // formally should be: nz( security(tickerID7, period, open) * ticker7ForexOpen )
sym8Open = offset(sym8Close, 1)     // formally should be: nz( security(tickerID8, period, open) * ticker8ForexOpen )

// Volume (in BTC units)
sym1Vol   = nz( security(tickerID1, period, volume) )
sym2Vol   = nz( security(tickerID2, period, volume) )
sym3Vol   = nz( security(tickerID3, period, volume) )
sym4Vol   = nz( security(tickerID4, period, volume) )
sym5Vol   = nz( security(tickerID5, period, volume) )
sym6Vol   = nz( security(tickerID6, period, volume) )
sym7Vol   = nz( security(tickerID7, period, volume) )
sym8Vol   = nz( security(tickerID8, period, volume) )

// SPECIAL CASE: BITMEX
// BITMEX quotes BTC volume in USD units, not BTC (because these are leveraged contracts, not actual BTC traded).
// It overall represents ~50% of the daily BTC trading amount, which is considerable. 
// A case can be made to aggregate it (by default, this script does).
// We therefore need to filter out this exchange and convert its volume to BTC, using BITMEX BTC Price (close).

// The formula is simple: 
//   IF the exchange is BITMEX, 
//   THEN divide Volume (in USD) by Price (BTC:USD ratio) to obtain Volume (in BTC). IMPORTANT: there may be divisions by zero, so use nz().
//   ELSE do nothing (use same value)
sym1Vol := ticker1Exchange=="BITMEX" ? nz( (sym1Vol / sym1Close) ) : sym1Vol
sym2Vol := ticker2Exchange=="BITMEX" ? nz( (sym2Vol / sym2Close) ) : sym2Vol
sym3Vol := ticker3Exchange=="BITMEX" ? nz( (sym3Vol / sym3Close) ) : sym3Vol
sym4Vol := ticker4Exchange=="BITMEX" ? nz( (sym4Vol / sym4Close) ) : sym4Vol
sym5Vol := ticker5Exchange=="BITMEX" ? nz( (sym5Vol / sym5Close) ) : sym5Vol
sym6Vol := ticker6Exchange=="BITMEX" ? nz( (sym6Vol / sym6Close) ) : sym6Vol
sym7Vol := ticker7Exchange=="BITMEX" ? nz( (sym7Vol / sym7Close) ) : sym7Vol
sym8Vol := ticker8Exchange=="BITMEX" ? nz( (sym8Vol / sym8Close) ) : sym8Vol



// ________________________
// ______ CALCULATE _______

// The formula to obtain a VWAP, with V=Volume and P=Price, is the SUM for i = (1 to N), of (P_i * V_i) / (Total Volume)
// It can be distributed to an addition of terms (fractions): 
//   [(P_1 * V_1) / (Total Volume)] + [(P_2 * V_2) / (Total Volume)] + ... + [(P_N * V_N) / (Total Volume)]
// In this formula, assuming there is at least one symbol, the total volume (denominator) cannot be zero.
// Computing is as such (1 term for each symbol) ensures that "NaN" values (i.e. no data), once replaced by zero (nz() function), will yield a zero term for the sum.

// Calculate the total volume. It is never equal to zero once at least 1 symbol is traded (after 2011-08-18)
totalVolume = sym1Vol + sym2Vol + sym3Vol + sym4Vol + sym5Vol + sym6Vol + sym7Vol + sym8Vol

// Calculate VWAP terms for each symbol. Each term is a fraction of the actual VWAP. 
//   A term is equal to zero if the symbol is not yet traded (history).
// From here on, for consistency, the script is typically ordered: O, H, L, C.

// Open VWAP terms
term1Open = sym1Open * sym1Vol / totalVolume
term2Open = sym2Open * sym2Vol / totalVolume
term3Open = sym3Open * sym3Vol / totalVolume
term4Open = sym4Open * sym4Vol / totalVolume
term5Open = sym5Open * sym5Vol / totalVolume
term6Open = sym6Open * sym6Vol / totalVolume
term7Open = sym7Open * sym7Vol / totalVolume
term8Open = sym8Open * sym8Vol / totalVolume

// High VWAP terms
term1High = sym1High * sym1Vol / totalVolume
term2High = sym2High * sym2Vol / totalVolume
term3High = sym3High * sym3Vol / totalVolume
term4High = sym4High * sym4Vol / totalVolume
term5High = sym5High * sym5Vol / totalVolume
term6High = sym6High * sym6Vol / totalVolume
term7High = sym7High * sym7Vol / totalVolume
term8High = sym8High * sym8Vol / totalVolume

// Low VWAP terms
term1Low = sym1Low * sym1Vol / totalVolume
term2Low = sym2Low * sym2Vol / totalVolume
term3Low = sym3Low * sym3Vol / totalVolume
term4Low = sym4Low * sym4Vol / totalVolume
term5Low = sym5Low * sym5Vol / totalVolume
term6Low = sym6Low * sym6Vol / totalVolume
term7Low = sym7Low * sym7Vol / totalVolume
term8Low = sym8Low * sym8Vol / totalVolume

// Close VWAP terms
term1Close = sym1Close * sym1Vol / totalVolume
term2Close = sym2Close * sym2Vol / totalVolume
term3Close = sym3Close * sym3Vol / totalVolume
term4Close = sym4Close * sym4Vol / totalVolume
term5Close = sym5Close * sym5Vol / totalVolume
term6Close = sym6Close * sym6Vol / totalVolume
term7Close = sym7Close * sym7Vol / totalVolume
term8Close = sym8Close * sym8Vol / totalVolume

// Finally, sum up all terms to obtain the actual VWAP for Open, High, Low and Close.
symOpen  = term1Open  + term2Open  + term3Open  + term4Open  + term5Open  + term6Open  + term7Open  + term8Open
symHigh  = term1High  + term2High  + term3High  + term4High  + term5High  + term6High  + term7High  + term8High
symLow   = term1Low   + term2Low   + term3Low   + term4Low   + term5Low   + term6Low   + term7Low   + term8Low
symClose = term1Close + term2Close + term3Close + term4Close + term5Close + term6Close + term7Close + term8Close

// Additional values: HL2, HLC3, OHLC4.
symHL2   = (symHigh + symLow) / 2
symHLC3  = (symHigh + symLow + symClose) / 3
symOHLC4 = (symOpen + symHigh + symLow + symClose) / 4



// ________________________
// _________ DRAW _________

// Draw VWAP Candles
// Regular or Heikin-Ashi is selected in Format > Inputs.
symChartCandles = plotcandle(symOpen, symHigh, symLow, symClose, title="Candles", color=symClose >= symOpen ? #5EB986 : #EB4C5C, wickcolor=#808080)

// VWAP Open, High, Low, Close
// Especially useful as a source for other indicators (e.g. MA, RSI, etc.)
// Transparent by default
symChartOpen  = plot(symOpen,  title="Open" , color=#555555, transp=100, linewidth=1)
symChartHigh  = plot(symHigh,  title="High" , color=#5EB986, transp=100, linewidth=1)
symChartLow   = plot(symLow,   title="Low"  , color=#EB4C5C, transp=100, linewidth=1)
symChartClose = plot(symClose, title="Close", color=#AAAAAA, transp=100, linewidth=1)

// HL2, HLC3, OHLC4
// Transparent by default
symChartHL2   = plot(symHL2  , title="(H+L)/2", color=#808080, transp=100, linewidth=1)
symChartHLC3  = plot(symHLC3 , title="(H+L+C)/3", color=#808080, transp=100, linewidth=1)
symChartOHLC4 = plot(symOHLC4, title="(O+H+L+C)/4", color=#808080, transp=100, linewidth=1)

// Per-exchange (close only to limit the clutter)
// Transparent by default
sym1ChartClose = plot(sym1Close, title="Ticker 1 Close", style=linebr, color=#00FFFF, transp=100, linewidth=1)
sym2ChartClose = plot(sym2Close, title="Ticker 2 Close", style=linebr, color=#0080FF, transp=100, linewidth=1)
sym3ChartClose = plot(sym3Close, title="Ticker 3 Close", style=linebr, color=#0000FF, transp=100, linewidth=1)
sym4ChartClose = plot(sym4Close, title="Ticker 4 Close", style=linebr, color=#8000FF, transp=100, linewidth=1)
sym5ChartClose = plot(sym5Close, title="Ticker 5 Close", style=linebr, color=#FF00FF, transp=100, linewidth=1)
sym6ChartClose = plot(sym6Close, title="Ticker 6 Close", style=linebr, color=#FF0080, transp=100, linewidth=1)
sym7ChartClose = plot(sym7Close, title="Ticker 7 Close", style=linebr, color=#FF8000, transp=100, linewidth=1)
sym8ChartClose = plot(sym8Close, title="Ticker 8 Close", style=linebr, color=#FFFF00, transp=100, linewidth=1)
