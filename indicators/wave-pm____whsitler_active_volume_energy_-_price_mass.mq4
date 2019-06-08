//+------------------------------------------------------------------+
//|        Whistler Active Volatility Energy - Price Mass | WAVE-PM  |
//|                        Copyright 2009, MetaQuotes Software Corp. |
//|                                  Authors: Mark Whistler/EcTrader |
//|                                      Mark@WallStreetRockStar.com |
//|                www.WallStreetRockStar.com / www.fxVolatility.com |
//|                                                                  |
//+------------------------------------------------------------------+
#property copyright "Copyright 2009, Mark Whistler/WallStreetRockStar.com"
#property link      "http://www.wallstreetrockstar.com"

#property indicator_separate_window
#property indicator_buffers 6
#property indicator_maximum 1
#property indicator_minimum 0
#property indicator_color5 Blue
#property indicator_color6 Red

//---- indicator parameters
extern int    ShortBandsPeriod=14;
extern int    ShortBandsShift=0;
extern double ShortBandsDeviations=2.2;
extern int    LongBandsPeriod=55;
extern int    LongBandsShift=0;
extern double LongBandsDeviations=2.2;
extern int PERIODS_CHARACTERISTIC=100;
//---- buffers
double ShortMovingBuffer[];
double LongMovingBuffer[];
double ShortDev[];
double LongDev[];
double Shortoscillator[];
double Longoscillator[];
//+------------------------------------------------------------------+
//| Custom indicator initialization function                         |
//+------------------------------------------------------------------+
int init()
  {
//---- indicators
   SetIndexStyle(0,DRAW_NONE);
   SetIndexBuffer(0,ShortMovingBuffer);
   SetIndexStyle(1,DRAW_NONE);
   SetIndexBuffer(1,LongMovingBuffer);
   SetIndexStyle(2,DRAW_NONE);
   SetIndexBuffer(2,ShortDev);
   SetIndexStyle(3,DRAW_NONE);
   SetIndexBuffer(3,LongDev);
   SetIndexStyle(4,DRAW_LINE);
   SetIndexBuffer(4,Shortoscillator);
   SetIndexStyle(5,DRAW_LINE);
   SetIndexBuffer(5,Longoscillator);
//----
   SetIndexDrawBegin(0,ShortBandsPeriod+ShortBandsShift);
   SetIndexDrawBegin(1,LongBandsPeriod+LongBandsShift);
   SetIndexDrawBegin(2,ShortBandsPeriod+ShortBandsShift);
   SetIndexDrawBegin(3,LongBandsPeriod+LongBandsShift);
   SetIndexDrawBegin(4,ShortBandsPeriod+ShortBandsShift);
   SetIndexDrawBegin(5,LongBandsPeriod+LongBandsShift);
//----
   return(0);
  }
//+------------------------------------------------------------------+
//| Bollinger Bands                                                  |
//+------------------------------------------------------------------+
int start()
  {
   int    i,k,counted_bars=IndicatorCounted();
   double deviation;
   double sum,oldval,newres;
//----
   if(Bars<=LongBandsPeriod) return(0);
//---- initial zero
   if(counted_bars<1)
     {
      for(i=1;i<=ShortBandsPeriod;i++)
        {
         ShortMovingBuffer[Bars-i]=EMPTY_VALUE;
        }
      for(i=1;i<=LongBandsPeriod;i++)
        {
         LongMovingBuffer[Bars-i]=EMPTY_VALUE;
        }
     }
//----
   int limit=Bars-counted_bars;
   if(counted_bars>0) limit++;
   for(i=0; i<limit; i++)
     { 
       ShortMovingBuffer[i]=iMA(NULL,0,ShortBandsPeriod,ShortBandsShift,MODE_SMA,PRICE_CLOSE,i);
       LongMovingBuffer[i]=iMA(NULL,0,LongBandsPeriod,LongBandsShift,MODE_SMA,PRICE_CLOSE,i);       
     }
//----
   i=Bars-ShortBandsPeriod+1;
   if(counted_bars>ShortBandsPeriod-1) i=Bars-counted_bars-1;
   while(i>=0)
     {
      sum=0.0;
      k=i+ShortBandsPeriod-1;
      oldval=ShortMovingBuffer[i];
      while(k>=i)
        {
         newres=Close[k]-oldval;
         sum+=newres*newres;
         k--;
        }
      ShortDev[i]=ShortBandsDeviations*MathSqrt(sum/ShortBandsPeriod);
      Shortoscillator[i]=OscillatorLine(ShortDev,i);
      //UpperBuffer[i]=oldval+deviation;
      //LowerBuffer[i]=oldval-deviation;
      i--;
     }
//----
   i=Bars-LongBandsPeriod+1;
   if(counted_bars>LongBandsPeriod-1) i=Bars-counted_bars-1;
   while(i>=0)
     {
      sum=0.0;
      k=i+LongBandsPeriod-1;
      oldval=LongMovingBuffer[i];
      while(k>=i)
        {
         newres=Close[k]-oldval;
         sum+=newres*newres;
         k--;
        }
      LongDev[i]=LongBandsDeviations*MathSqrt(sum/LongBandsPeriod);
      Longoscillator[i]=OscillatorLine(LongDev,i);
      //UpperBuffer[i]=oldval+deviation;
      //LowerBuffer[i]=oldval-deviation;
      i--;
     }
//----
   return(0);
  }

double OscillatorLine(double indicator[], int StartBar)
  {
      double S=0;
      int ArrayLong=PERIODS_CHARACTERISTIC;
      double Result;
      for(int j=StartBar;j<ArrayLong+StartBar;j++) 
        {S+=MathPow((indicator[j]/Point),2);}
      
      S/=ArrayLong;
      S=MathSqrt(S)*Point;
      if(S!=0) 
        {Result=indicator[StartBar]/S;}
      Result=MathTanh(Result);
      return (Result);
  }
double MathTanh(double x)
{ 
   double exp;
   double returnNum;
   if(x>0)
     {
       exp=MathExp(-2*x);
       returnNum= (1-exp)/(1+exp);
       return (returnNum);
     }
   else
     {
       exp=MathExp(2*x);
       returnNum=(exp-1)/(1+exp);
       return (returnNum);
     }
}