export class StockQuote {
  public name: string;
  public symbol: string;
  public curPrice: number;
  public curPriceChange: number;
  public curPercentChange: number;
  public dayLow: number;
  public dayHigh: number;
  public previousClose: number;
  public openPrice: number;
  public week52High: number;
  public week52Low: number;
  public ytdChange: number;

  constructor(
    name: string,
    symbol: string,
    curPrice: number,
    curPriceChange: number,
    curPercentChange: number,
    dayLow: number,
    dayHigh: number,
    previousClose: number,
    openPrice: number,
    week52High: number,
    week52Low: number,
    ytdChange: number
  ) {
    this.name = name;
    this.symbol = symbol;
    this.curPrice = curPrice;
    this.curPriceChange = curPriceChange;
    this.curPercentChange = curPercentChange;
    this.dayLow = dayLow;
    this.dayHigh = dayHigh;
    this.previousClose = previousClose;
    this.openPrice = openPrice;
    this.week52High = week52High;
    this.week52Low = week52Low;
    this.ytdChange = ytdChange;
  }
}
