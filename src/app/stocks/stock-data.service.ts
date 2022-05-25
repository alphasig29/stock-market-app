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
    if (!(stockList.length === 0)) {
      console.log('No stocks in the wishlist!');
    }
    // send request to get current data
    console.log('stock data service: symbols array', stockList);
    this.stockApiService.getStockDataForList(stockList).subscribe(returnData => {
      this.refreshStockData = returnData;
      console.log('stock-data-service: new refresh data = ', this.refreshStockData);
      this.loadStockQuoteArrayWithNewData(this.stockQuotes,this.refreshStockData);

      // return a copy of the data to prevent external updates
      console.log("new Stock Data array:", this.stockQuotes.slice());
      this.stockDataChanged.next(this.stockQuotes.slice());
    }, error => {
      console.log('Error Retrieving Stock data: ' + error);
    });

  }


    private loadStockQuoteArrayWithNewData(sourceArray: StockQuote[],
      newDataArray: APIStockQuotes[]) {
      // only attempt to load the data if the source is not null
      console.log('loadStaockQuoteArayWithNewData.sourceArray', sourceArray);
      if (sourceArray.length === 0) {
        console.log('stock watch list array is null');
        // return;

      }
      // loop through the newDataArray
      Object.keys(newDataArray).forEach((key) => {
        //locate the object[key=symbol] in the source Array
        let stockObject: StockQuote = sourceArray.find(obj => {
          // console.log('loadStockQArrayNewDAta: located object', key, stockObject);
          return obj.symbol === key;
        })
        console.log('stock data service: updating array: found symbol is ', stockObject);
        //if the symbol was located, update it's data
        if (stockObject !== undefined) {
          console.log('updating existing object in the stock arrayy', key)
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
          console.log('adding new symbol to the stock data array', key);
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
