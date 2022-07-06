import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { StockAPIService } from "../shared/api/stock-api-service";
import { APIStockQuotes } from "../shared/models/api-stock-quote.model";
import { StockQuote } from "../shared/models/stock-quote.model";
import { StockList } from "../shared/models/stock-list.model";

@Injectable({
  providedIn: 'root'
})

export class StockDataService {

  // provide a subject to subscribe to
  stockDataChanged = new Subject<StockQuote[]>();
  private refreshStockData: APIStockQuotes[];
  // private variable to house the watch list of stocks
  private stockQuotes: StockQuote[] = [];

  constructor(private stockApiService: StockAPIService) { }

  getStockQuotes(): StockQuote[] {
    // return a copy of the data to prevent external updates
    // this.stockDataChanged.next(this.stockQuotes.slice());
    return this.stockQuotes.slice();

  }

  clearStockQuotes() {
    this.stockQuotes = [];
    this.stockDataChanged.next(this.stockQuotes.slice());
  }

  getAllStockSymbols() : StockList[] {
    return this.stockApiService.getAllStockSymbolList();
  }

  stockSymbolExists(symbol: string): boolean {
    let boolStockExists: boolean = false;
    // call the Stock API to get a quick quote..
    console.log('stockSymbolExists: ', symbol);
    this.stockApiService.getStockQuote(symbol).subscribe(
      returnData => {
        boolStockExists = true;
        console.log('stockSymbolExists: Success', returnData);
      },
      errorData => {
        boolStockExists = false;
        console.log('stockSymbolExists: Error', errorData);
      });
    return boolStockExists;
  }

  deleteStockQuote(stockSymbol: string) {
    // if we have an array of stock quotes, then delete the passed symbol
    if (this.stockQuotes.length > 0) {
      // find the index
      const stockIndex = this.stockQuotes.findIndex(objStockQuote => {
        objStockQuote.symbol.toUpperCase() === stockSymbol.toUpperCase();
      });
      // delete it from the current listing
      this.stockQuotes.splice(stockIndex, 1);
      // notify there was a change
      this.stockDataChanged.next(this.stockQuotes.slice());
    }
  }

  refreshStockQuotes(stockList: string[]) {
    // console.log('stock-date.service stockList', stockList);
    if ((stockList.length === 0)) {
      // console.log('No stocks in the wishlist!');
      return;
    }
    // send request to get current data
    // console.log('stock-date.service stockList !==0', stockList);
    // console.log('stock-date.service stockList == null', stockList.length);
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

        let calculatedRealTimePrice: number;

        //if the symbol was located, update it's data
        if (stockObject !== undefined) {

          // sometimes iexRealTimPrice is null.. handling it here
          if (newDataArray[key].quote.iexRealtimePrice === null) {
            calculatedRealTimePrice = 0.00;
          } else {
            calculatedRealTimePrice = +newDataArray[key].quote.iexRealtimePrice;
          }
          //update that object
          stockObject.curPercentChange = +(newDataArray[key].quote.changePercent * 100).toFixed(2);
          stockObject.curPrice = +calculatedRealTimePrice.toFixed(2);
          stockObject.curPriceChange = newDataArray[key].quote.change.toFixed(3);
          stockObject.dayHigh = newDataArray[key].quote.high.toFixed(2);
          stockObject.dayLow = newDataArray[key].quote.low.toFixed(2);
          stockObject.openPrice = newDataArray[key].quote.open.toFixed(2);
          stockObject.previousClose = newDataArray[key].quote.close.toFixed(2);
          stockObject.week52High = newDataArray[key].quote.week52High.toFixed(2);
          stockObject.week52Low = newDataArray[key].quote.week52Low.toFixed(2);
          stockObject.ytdChange = +(newDataArray[key].quote.ytdChange * 100).toFixed(2);
        } else {

          // sometimes iexRealTimPrice is null.. handling it here
          if (newDataArray[key].quote.iexRealtimePrice === null) {
            calculatedRealTimePrice = 0.00;
          } else {
            calculatedRealTimePrice = +newDataArray[key].quote.iexRealtimePrice;
          }
          // add the object to the source array
          // console.log('newDataArray',newDataArray);
          sourceArray.push(new StockQuote(
            newDataArray[key].quote.companyName,
            newDataArray[key].quote.symbol,
            calculatedRealTimePrice,
            newDataArray[key].quote.change.toFixed(3),
            +(newDataArray[key].quote.changePercent * 100).toFixed(2),
            newDataArray[key].quote.low.toFixed(2),
            newDataArray[key].quote.high.toFixed(2),
            newDataArray[key].quote.close.toFixed(2),
            newDataArray[key].quote.open.toFixed(2),
            newDataArray[key].quote.week52High.toFixed(2),
            newDataArray[key].quote.week52Low.toFixed(2),
            +(newDataArray[key].quote.ytdChange * 100).toFixed(2)
          ));
        }

      });

    }

}
