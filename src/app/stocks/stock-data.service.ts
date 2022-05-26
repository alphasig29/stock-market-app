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

  stockSymbolExists(symbol: string): boolean {
    let boolStockExists: boolean = false;
    // call the Stock API to get a quick quote..
    this.stockApiService.getStockQuote(symbol).subscribe(
      returnData => { boolStockExists = true },
      errorData => { boolStockExists = false });
    return boolStockExists;
  }

  refreshStockQuotes(stockList: string[]) {
    if (!(stockList.length === 0)) {
      // console.log('No stocks in the wishlist!');
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
      newDataArray: APIStockQuotes[]) {
      // loop through the newDataArray
      Object.keys(newDataArray).forEach((key) => {
        //locate the object[key=symbol] in the source Array
        let stockObject: StockQuote = sourceArray.find(obj => {
          // console.log('loadStockQArrayNewDAta: located object', key, stockObject);
          return obj.symbol === key;
        })

        //if the symbol was located, update it's data
        if (stockObject !== undefined) {
          //update that object
          stockObject.curPercentChange = +(newDataArray[key].quote.changePercent * 100).toFixed(2);
          stockObject.curPrice = newDataArray[key].quote.iexRealtimePrice.toFixed(2);
          stockObject.curPriceChange = newDataArray[key].quote.change.toFixed(3);
          stockObject.dayHigh = newDataArray[key].quote.high.toFixed(2);
          stockObject.dayLow = newDataArray[key].quote.low.toFixed(2);
          stockObject.openPrice = newDataArray[key].quote.open.toFixed(2);
          stockObject.previousClose = newDataArray[key].quote.close.toFixed(2);
          stockObject.week52High = newDataArray[key].quote.week52High.toFixed(2);
          stockObject.week52Low = newDataArray[key].quote.week52Low.toFixed(2);
          stockObject.ytdChange = +(newDataArray[key].quote.ytdChange * 100).toFixed(2);
        } else {
          // add the object to the source array
          sourceArray.push(new StockQuote(
            newDataArray[key].quote.companyName,
            newDataArray[key].quote.symbol,
            +(newDataArray[key].quote.changePercent * 100).toFixed(2),
            newDataArray[key].quote.iexRealtimePrice.toFixed(2),
            newDataArray[key].quote.change.toFixed(3),
            newDataArray[key].quote.high.toFixed(2),
            newDataArray[key].quote.low.toFixed(2),
            newDataArray[key].quote.open.toFixed(2),
            newDataArray[key].quote.close.toFixed(2),
            newDataArray[key].quote.week52High.toFixed(2),
            newDataArray[key].quote.week52Low.toFixed(2),
            +(newDataArray[key].quote.ytdChange * 100).toFixed(2)
          ));
        }

      });

    }

}
