import { Injectable } from "@angular/core";
import { StockQuote } from "../shared/models/stock-quote.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, throwError, map, Observable, Subject } from "rxjs";
import { Constants } from "../config/constants";
import { APIAllSEctorStockQuote} from "../shared/models/api-stock-quote.model"
import { StockAPIService } from "../shared/api/stock-api-service";



@Injectable({
  providedIn: 'root'
})

export class SectorDataService{
  // provide a Subject to subscribe to
  sectorDataChanged = new Subject<StockQuote[]>();
  private refressedSectorData: APIAllSEctorStockQuote[];

  private sectorData: StockQuote[] = [
    new StockQuote('Cons Disc', 'XLY', 175.70, -0.45, -0.26, 175.96, 179.78, 179.48, 176.78, 0, 0, 0),
    new StockQuote('Cons Staples', 'XLP', 78.33, -0.07, -0.09, 78.25, 79.12, 78.72, 78.86, 0, 0, 0),
    new StockQuote('Energy', 'XLE', 77.29, 0.15, 0.19, 76.96, 78.70, 79.53, 78.68, 0, 0, 0),
    new StockQuote('Financials', 'XLF', 37.77, 0.05, 0.13, 37.66, 38.15, 37.89, 37.79, 0, 0, 0),
    new StockQuote('Health Care', 'XLV', 139.64, -0.35, -0.25, 139.78, 143.00, 142.83, 142.42, 0, 0, 0),
    new StockQuote('Industrials', 'XLI', 99.75, 1.47, 0.47, 99.10, 100.40, 99.60, 99.28, 0, 0, 0),
    new StockQuote('Materials', 'XLB', 88.04, 0.00, 0.00, 87.93, 88.98, 88.48, 88.19, 0, 0, 0),
    new StockQuote('Real Estate', 'XLRE', 48.97, -0.02, -0.04, 48.85, 49.79, 49.67, 19.56, 0, 0, 0),
    new StockQuote('Techonogy', 'XLK', 148.40, -0.17, -0.11, 148.37, 150.69, 152.41, 150.50, 0, 0, 0),
    new StockQuote('Comm Srvc', 'XLC', 67.00, -0.20, -0.30, 67.11, 68.26, 68.08, 67.63, 0, 0, 0),
    new StockQuote('Utilities', 'XLU', 76.00, 0.09, 0.12, 75.79, 77.11, 76.96, 77.01, 0, 0, 0)
  ];
  // this is for future use..
  private sp500Data: StockQuote =
    new StockQuote('S&P 500', 'SPY', 439.67, -0.25, -0.06, 439.39, 445.00, 447.57, 44.11, 0, 0, 0);

  constructor(private config: Constants,
    private stockApiService: StockAPIService) { }

  getSectorData(): StockQuote[] {
    // sort the array by % change
    this.sectorData = this.sortArray(this.sectorData);
    // return a copy of the data to prevent external updates
    return this.sectorData.slice();
    this.sectorDataChanged.next(this.sectorData.slice());
  }

  private sortArray(stockData: StockQuote[]): StockQuote[] {
    //sort the sector array by the % change
    let sortedArray: StockQuote[] = stockData.sort(
        (a, b) => (a.curPercentChange < b.curPercentChange ? 1 : -1)
      );
      // return the passed array to be the ordered array
      return sortedArray;

    }

  refreshSectorData() {
      // send request to get current data
    this.stockApiService.getAllSectorData().subscribe(returnData => {
      this.refressedSectorData = returnData;
      this.loadSectorArrayWithNewData(this.sectorData,this.refressedSectorData);
      // sort the array by % change
      this.sectorData = this.sortArray(this.sectorData);
      // return a copy of the data to prevent external updates
      this.sectorDataChanged.next(this.sectorData.slice());
    }, error => {
      console.log('Error Retrieving Sector data: ' + error);
    });

    }

    private loadSectorArrayWithNewData(sourceArray: StockQuote[],
      newDataArray: APIAllSEctorStockQuote[]){
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
