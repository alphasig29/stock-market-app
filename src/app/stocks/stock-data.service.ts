import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { StockAPIService } from "../shared/api/stock-api-service";
import { APIStockQuotes } from "../shared/models/api-stock-quote.model";
import { StockQuote } from "../shared/models/stock-quote.model";

@Injectable({
  providedIn: 'root'
})

export class StockDataService {

  // provide a subjec to subscribe to
  stockDataChanged = new Subject<StockQuote[]>();
  private refreshStockData: APIStockQuotes[];
  // private variable to house the watch list of stocks
  private stockQuotes: StockQuote[] = [];

  constructor(private stockApiService: StockAPIService) { }

  getStockQuotes(): StockQuote[] {
    // return a copy of the data to prevent external updates
    return this.stockQuotes.slice();
    this.stockDataChanged.next(this.stockQuotes.slice());
  }

  refreshStockQuotes(stockList: string[]) {
    if (!(stockList.length > 0)) {
      return null;
    }
    // send request to get current data
    this.stockApiService.getStockDataForList(stockList).subscribe(returnData => {
      this.refreshStockData = returnData;
      this.loadStockQuoteArrayWithNewData(this.stockQuotes,this.refreshStockData);

      // return a copy of the data to prevent external updates
      this.stockDataChanged.next(this.stockQuotes.slice());
    }, error => {
      console.log('Error Retrieving Stock data: ' + error);
    });

  }


    private loadStockQuoteArrayWithNewData(sourceArray: StockQuote[],
      newDataArray: APIStockQuotes[]){
      // loop through the newDataArray
      Object.keys(newDataArray).forEach((key) => {
        //locate the object[key=symbol] in the source Array
        let sectorObject: StockQuote = sourceArray.find( obj => {
          return obj.symbol === key;
        })
        //update that object
        sectorObject.curPercentChange = (newDataArray[key].quote.changePercent * 100);
        sectorObject.curPrice = newDataArray[key].quote.iexRealtimePrice;
        sectorObject.curPriceChange = newDataArray[key].quote.change;
        sectorObject.dayHigh = newDataArray[key].quote.high;
        sectorObject.dayLow = newDataArray[key].quote.low;
        sectorObject.openPrice = newDataArray[key].quote.open;
        sectorObject.previousClose = newDataArray[key].quote.close;
        sectorObject.week52High = newDataArray[key].quote.week52High;
        sectorObject.week52Low = newDataArray[key].quote.week52Low;
        sectorObject.ytdChange = newDataArray[key].quote.ytdChange;

      });

    }

}
