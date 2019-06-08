study(title="Daily Crossings [Yield]", shorttitle="Daily Crossings [Yield]", overlay=true, precision=0, linktoseries=true, scale=scale.none)
xo1 = input(false, title="Show Close/SMA200")
xo2 = input(false, title="Show Close/SMA250")
xo3 = input(false, title="Show SMA50/SMA200")
xo4 = input(true, title="Show SMA20/SMA200")
xo5 = input(false, title="Show SMA50/SMA100")
xoshort = input(true, title="Show SMA20/SMA50")
usealma = input(true, title="Use ALMA?(SMA)")
useha = input(false, title="Use Heikin?")
ha_close = security(heikinashi(tickerid), "D", close)
t = tickerid(syminfo.prefix, ticker)
//realC = security(t, period, close)
realC = security(t, "D", close)
price = useha ? ha_close : realC


offset = input(0.55, step=0.05, minval=0)
sigma = input(1, step=1, minval=1)

ma20 = usealma ? alma(price, 20, offset, sigma) : sma(price, 20)
ma50 = usealma ? alma(price, 50, offset, sigma) : sma(price, 50)
ma100 = usealma ? alma(price, 100, offset, sigma) : sma(price, 100)
ma200 = usealma ? alma(price, 200, offset, sigma) : sma(price, 200)
ma250 = usealma ? alma(price, 250, offset, sigma) : sma(price, 250)

ma1color = #1FBF00
ma2color = #C8AD00
ma3color = #D20015
ma4color = #CB00DB
ma5color = #0009E5

plot(isdaily ? ma20 : na, title="MA 20", linewidth=2, color=ma1color, editable=true, transp=0)
plot(isdaily ? ma50 : na, title="MA 50", linewidth=2, color=ma2color, editable=true, transp=0)
plot(isdaily ? ma100 : na, title="MA 100", linewidth=2, color=ma3color, editable=true, transp=0)
plot(isdaily ? ma200 : na, title="MA 200", linewidth=2, color=ma4color, editable=true, transp=0)
plot(isdaily ? ma250 : na, title="MA 250", linewidth=2, color=ma5color, editable=true, transp=0)


plotshape(xo1 and isdaily ? crossover(close, ma200) : na, style=shape.triangleup, location=location.belowbar, color=ma4color, text="1", transp=0, editable=false, size=size.small, title="XO 1")
plotshape(xo1 and isdaily ? crossunder(close, ma200) : na, style=shape.triangledown, location=location.abovebar, color=ma4color, text="1", transp=0, editable=false, size=size.small, title="XO 1")

plotshape(xo2 and isdaily ? crossover(close, ma250) : na, style=shape.triangleup, location=location.belowbar, color=ma5color, text="2", transp=0, editable=false, size=size.small, title="XO 2")
plotshape(xo2 and isdaily ? crossunder(close, ma250) : na, style=shape.triangledown, location=location.abovebar, color=ma5color, text="2", transp=0, editable=false, size=size.small, title="XO 2")

plotshape(xo3 and isdaily ? crossover(ma50, ma200) : na, style=shape.triangleup, location=location.belowbar, color=ma4color, text="3", transp=0, editable=false, size=size.small, title="XO 3")
plotshape(xo3 and isdaily ? crossunder(ma50, ma200) : na, style=shape.triangledown, location=location.abovebar, color=ma4color, text="3", transp=0, editable=false, size=size.small, title="XO 3")

plotshape(xo4 and isdaily ? crossover(ma20, ma200) : na, style=shape.triangleup, location=location.belowbar, color=ma4color, text="4", transp=0, editable=false, size=size.small, title="XO 4")
plotshape(xo4 and isdaily ? crossunder(ma20, ma200) : na, style=shape.triangledown, location=location.abovebar, color=ma4color, text="4", transp=0, editable=false, size=size.small, title="XO 4")

plotshape(xo5 and isdaily ? crossover(ma50, ma100) : na, style=shape.triangleup, location=location.belowbar, color=ma3color, text="5", transp=0, editable=false, size=size.small, title="XO 5")
plotshape(xo5 and isdaily ? crossunder(ma50, ma100) : na, style=shape.triangledown, location=location.abovebar, color=ma3color, text="5", transp=0, editable=false, size=size.small, title="XO 5")

plotshape(xoshort and isdaily ? crossover(ma20, ma50) : na, style=shape.circle, location=location.belowbar, color=#006400, text="+", transp=0, editable=false, size=size.small, title="20vs50")
plotshape(xoshort and isdaily ? crossunder(ma20, ma50) : na, style=shape.circle, location=location.abovebar, color=#8B0000, text="-", transp=0, editable=false, size=size.small, title="20vs50")

alertcondition(crossover(ma20, ma200), title="20 vs 200", message="SMA 20 crossing with SMA 200")
alertcondition(crossover(ma50, ma100), title="50 vs 100", message="SMA 50 crossing with SMA 100")
