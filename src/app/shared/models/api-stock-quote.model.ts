// using this class to create the layout of the JSON
// object that the API will be returning.
export class APIAllSectorStockQuote{
  [key:string]: {quote: APIStockQuote};
}

export class APIStockQuotes{
  [key:string]: {quote: APIStockQuote};
}

// export class APIAllSEctorStockQuote{
//   XLC: {quote: APIStockQuote};
//   XLY: {quote: APIStockQuote};
//   XLP: {quote: APIStockQuote};
//   XLE: {quote: APIStockQuote};
//   XLF: {quote: APIStockQuote};
//   XLV: {quote: APIStockQuote};
//   XLI: {quote: APIStockQuote};
//   XLB: {quote: APIStockQuote};
//   XLRE: {quote: APIStockQuote};
//   XLK: {quote: APIStockQuote};
//   XLU: {quote: APIStockQuote};
// }



export class APIStockQuote{
  public avgTotalVolume: number;
  public calculationPrice: string;
  public change: number;
  public changePercent: number;
  public close: number;
  public closeSource: string;
  public closeTime?: string | null;
  public companyName: string;
  public currency: string;
  public delayedPrice?: number | null;
  public delayedPriceTime?: string | null;
  public extendedChange?: number| null;
  public extendedChangePercent?: number | null;
  public extendedPrice?: number | null;
  public extendedPriceTime?: string | null;
  public high: number;
  public highSource: string;
  public highTime: number;
  public iexAskPrice: number;
  public iexAskSize: number;
  public iexBidPrice: number;
  public iexBidSize: number;
  public iexClose: number;
  public iexCloseTime: number;
  public iexLastUpdated: number;
  public iexMarketPercent: number;
  public iexOpen: number;
  public iexOpenTime: number;
  public iexRealtimePrice: number;
  public iexRealtimeSize: number;
  public iexVolume: number;
  public lastTradeTime: number;
  public latestPrice: number;
  public latestSource: string;
  public latestTime: string;
  public latestUpdate: number;
  public latestVolume?: number | null;
  public low: number;
  public lowSource: string;
  public lowTime: number;
  public marketCap: number;
  public oddLotDelayedPrice?: number | null;
  public oddLotDelayedPriceTime?: string | null;
  public open: number;
  public openTime?: string | null;
  public openSource: string;
  public peRatio?: number |null;
  public previousClose: number;
  public previousVolume: number;
  public primaryExchange: string;
  public symbol: string;
  public volume?:number | null;
  public week52High: number;
  public week52Low: number;
  public ytdChange: number;
  public isUSMarketOpen: boolean

constructor (
  avgTotalVolume: number,
  calculationPrice: string,
  change: number,
  changePercent: number,
  close: number,
  closeSource: string,
  companyName: string,
  currency: string,
  high: number,
  highSource: string,
  highTime: number,
  iexAskPrice: number,
  iexAskSize: number,
  iexBidPrice: number,
  iexBidSize: number,
  iexClose: number,
  iexCloseTime: number,
  iexLastUpdated: number,
  iexMarketPercent: number,
  iexOpen: number,
  iexOpenTime: number,
  iexRealtimePrice: number,
  iexRealtimeSize: number,
  iexVolume: number,
  lastTradeTime: number,
  latestPrice: number,
  latestSource: string,
  latestTime: string,
  latestUpdate: number,
  low: number,
  lowSource: string,
  lowTime: number,
  marketCap: number,
  open: number,
  openSource: string,
  previousClose: number,
  previousVolume: number,
  primaryExchange: string,
  symbol: string,
  week52High: number,
  week52Low: number,
  ytdChange: number,
  isUSMarketOpen: boolean,
  closeTime?: string | null,
  delayedPrice?: number | null,
  delayedPriceTime?: string | null,
  extendedChange?: number| null,
  extendedChangePercent?: number | null,
  extendedPrice?: number | null,
  extendedPriceTime?: string | null,
  latestVolume?: number | null,
  oddLotDelayedPrice?: number | null,
  oddLotDelayedPriceTime?: string | null,
  openTime?: string | null,
  peRatio?: number |null,
  volume?:number | null
) {
  this.avgTotalVolume= avgTotalVolume;
  this.calculationPrice= calculationPrice;
  this.change= change;
  this.changePercent= changePercent;
  this.close= close;
  this.closeSource= closeSource;
  this.companyName= companyName;
  this.currency= currency;
  this.high= high;
  this.highSource= highSource;
  this.highTime= highTime;
  this.iexAskPrice= iexAskPrice;
  this.iexAskSize= iexAskSize;
  this.iexBidPrice= iexBidPrice;
  this.iexBidSize= iexBidSize;
  this.iexClose= iexClose;
  this.iexCloseTime= iexCloseTime;
  this.iexLastUpdated= iexLastUpdated;
  this.iexMarketPercent= iexMarketPercent;
  this.iexOpen= iexOpen;
  this.iexOpenTime= iexOpenTime;
  this.iexRealtimePrice= iexRealtimePrice;
  this.iexRealtimeSize= iexRealtimeSize;
  this.iexVolume= iexVolume;
  this.lastTradeTime= lastTradeTime;
  this.latestPrice= latestPrice;
  this.latestSource= latestSource;
  this.latestTime= latestTime;
  this.latestUpdate= latestUpdate;
  this.low= low;
  this.lowSource= lowSource;
  this.lowTime= lowTime;
  this.marketCap= marketCap;
  this.open= open;
  this.openSource= openSource;
  this.previousClose= previousClose;
  this.previousVolume= previousVolume;
  this.primaryExchange= primaryExchange;
  this.symbol= symbol;
  this.week52High= week52High;
  this.week52Low= week52Low;
  this.ytdChange= ytdChange;
  this.isUSMarketOpen= isUSMarketOpen;
  this.closeTime= closeTime;
  this.delayedPrice= delayedPrice;
  this.delayedPriceTime= delayedPriceTime;
  this.extendedChange= extendedChange;
  this.extendedChangePercent= extendedChangePercent;
  this.extendedPrice= extendedPrice;
  this.extendedPriceTime= extendedPriceTime;
  this.latestVolume= latestVolume;
  this.oddLotDelayedPrice= oddLotDelayedPrice;
  this.oddLotDelayedPriceTime= oddLotDelayedPriceTime;
  this.openTime= openTime;
  this.peRatio= peRatio;
  this.volume= volume;
}


}


