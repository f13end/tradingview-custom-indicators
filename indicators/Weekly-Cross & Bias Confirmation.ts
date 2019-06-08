//@version=3
// This indicator plots the weekly and daily open in addition to a current close price line.
// It also signals when price closes above or below the daily and weekly opens.
// Also, the bull/bear bias is painted on this indicator as well.
study("Weekly/Daily Cross & Bias Confirmation", overlay=false)
weekOpen = security(tickerid, 'W', open, lookahead=barmerge.lookahead_on)
lastWeekOpen = security(tickerid, 'W', open[1])
weekClose = security(tickerid, 'W', close)
lastWeekClose = security(tickerid, 'W', close[1])
weekHigh = security(tickerid, 'W', high, lookahead=barmerge.lookahead_on)
lastWeekHigh = security(tickerid, 'W', high[1])
weekLow = security(tickerid, 'W', low, lookahead=barmerge.lookahead_on)
lastWeekLow = security(tickerid, 'W', low[1])
// Day
dayOpen = security(tickerid, 'D', open, lookahead=barmerge.lookahead_on)
dayClose = security(tickerid, 'D', close, lookahead=barmerge.lookahead_on)
dayHigh = security(tickerid, 'D', high, lookahead=barmerge.lookahead_on)
dayLow = security(tickerid, 'D', low, lookahead=barmerge.lookahead_on)
// Other
currentClose = close
curATR = atr(14)


plot(dayOpen ? dayOpen : na, title="Day Open", style=line, linewidth=2, color=silver, transp=0)
plot(dayClose ? dayClose : na, title="Day Close", style=line, linewidth=1, color=orange, transp=0)
plot(dayHigh ? dayHigh : na, title="Day High", style=cross, linewidth=1, color=purple,transp=0)
plot(dayLow ? dayLow : na, title="Day Low", style=cross, linewidth=1, color=yellow,transp=0)
dayOpenCrossOverSignal = crossover(currentClose, dayOpen)
plotshape(series=dayOpenCrossOverSignal, title="Day Cross Above Signal", location=location.belowbar, color=aqua, text="", size=size.tiny, style=shape.triangleup)
alertcondition(dayOpenCrossOverSignal, title='Move Above Daily Open', message='Daily open above cross')
dayOpenCrossUnderSignal = crossunder(currentClose, dayOpen)
plotshape(series=dayOpenCrossUnderSignal, title="Day Cross Below Signal", location=location.abovebar, color=aqua, text="", size=size.tiny, style=shape.triangledown)
alertcondition(dayOpenCrossUnderSignal, title='Move Below Daily Open', message='Daily open below cross')

// Day Bias
dayBullCond = (dayOpen < currentClose)
dayBearCond = (dayOpen > currentClose)
dayDailyBcolor = dayBearCond ? color(red,50) : dayBullCond ? color(green,50) : na
bgcolor(title="Daily Bull/Bear Background", color=dayDailyBcolor)

plot(weekOpen ? weekOpen : na, title="Weekly Open", style=line, linewidth=2, color=black, transp=0)
plot(weekHigh ? weekHigh : na, title="Weekly High", style=circles, linewidth=1, color=green,transp=0)
plot(weekLow ? weekLow : na, title="Weekly Low", style=circles, linewidth=1, color=red,transp=0)
plot(currentClose, title="Close Price", linewidth=2, color=blue)

weeklyOpenCrossOverSignal = crossover(currentClose, weekOpen)
plotshape(series=weeklyOpenCrossOverSignal, title="Week Open Cross Above Signal", location=location.belowbar, color=black, text="", size=size.tiny, style=shape.triangleup)
alertcondition(weeklyOpenCrossOverSignal, title='Move Above Weekly Open', message='Weekly open above cross')
weeklyOpenCrossUnderSignal = crossunder(currentClose, weekOpen)
plotshape(series=weeklyOpenCrossUnderSignal, title="Week Open Cross Below Signal", location=location.abovebar, color=black, text="", size=size.tiny, style=shape.triangledown)
alertcondition(weeklyOpenCrossUnderSignal, title='Move Below Weekly Open', message='Weekly open below cross')

weeklyBullCond = (weekOpen < currentClose)
weeklyBearCond = (weekOpen > currentClose)
//plotshape(series=weeklyBullCond, title="Long Signal", location=location.top, color=black, text="", size=size.tiny, style=shape.circle, transp=70)
weeklyDailyBcolor = weeklyBearCond ? color(red,50) : weeklyBullCond ? color(green,50) : na
bgcolor(title="Daily Bull/Bear Background", color=weeklyDailyBcolor)
