import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription, timer, map } from 'rxjs';
import { Constants } from 'src/app/config/constants';
import { AuthService } from 'src/app/shared/auth.service';
import { StockQuote } from 'src/app/shared/models/stock-quote.model';
import { StockDataService } from '../stock-data.service';
import { StockGridDataSource, StockGridItem } from './stock-grid-datasource';


@Component({
  selector: 'app-stock-grid',
  templateUrl: './stock-grid.component.html',
  styleUrls: ['./stock-grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockGridComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<StockGridItem>;
  dataSource: StockGridDataSource;
  // @Input() newStockDataSource: StockQuote[];

  allStocks: StockQuote[];
  private stockChangeSub: Subscription; // getting notifications when the data changes
  private timerSubscription: Subscription; // forcing new data on an interval


  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  // displayedColumns = ['id', 'name'];
  displayedColumns = ['symbol', 'name', 'curPrice', 'curPriceChange', 'curPercentChange',
    'previousClose', 'openPrice', 'dayLow', 'dayHigh', 'week52High', 'week52Low', 'ytdChange', 'deleteStock'];
  // displayedColumns = ['symbol', 'name'];

  constructor(private cd: ChangeDetectorRef,
    private stockQuoteService: StockDataService,
    private authService: AuthService,
    private config: Constants) {
    this.dataSource = new StockGridDataSource();
  }

  ngOnInit(): void {
    // remove the user's stocks from the data service
    this.stockQuoteService.clearStockQuotes();

    // force the stock list to get refreshed while waiting for the timer to get it
    this.stockQuoteService.refreshStockQuotes(this.authService.getStockWatchList());


     // handling the getting of the current Stock data
    this.allStocks = this.stockQuoteService.getStockQuotes();

    // subscribing to getting new stock quotes
    this.stockChangeSub = this.stockQuoteService.stockDataChanged.subscribe(
      (newStockWatchListData: StockQuote[]) => {
        // console.log('subOn init-this.authService.getStockWatchList()', this.authService.getStockWatchList());
        // this.stockQuoteService.refreshStockQuotes(this.authService.getStockWatchList());
        // console.log('subsription to stock quotes - SubChanged', newStockWatchListData);
            // this.allStocks = newStockWatchListData;
            this.table.dataSource = newStockWatchListData;
      }
    );
    //setting up a timer to get data incrementally (every 60 sec)
    this.timerSubscription = timer(0, this.config.API_DELAY_MILLISECONDS).pipe(
      map(() => {
        // load the latest sector data via the http request
        console.log('timer-this.authService.getStockWatchList()', this.authService.getStockWatchList());
        console.log('timer - getStockQuotes()', this.stockQuoteService.getStockQuotes());
        // console.log('timer-this.authService.getStockWatchList()', this.authService.getStockWatchList());
        this.stockQuoteService.refreshStockQuotes(this.authService.getStockWatchList());
        // log when data is refreshed so we can check for memory leaks
        let date: Date = new Date;
        console.log(date + ' - refressing the stock data');
        this.table.dataSource = this.stockQuoteService.getStockQuotes();
        // this.table.renderRows();
      })
    ).subscribe();

  }

  ngAfterViewInit(): void {
    // this.dataSource = new StockGridDataSource();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.allStocks; //this.dataSource;
    this.table.renderRows();
  }

  onDeleteStock(dataRow: StockQuote) {
    // console.log('dataRow', dataRow);
    //get the stock symbol from the template
    const stockSymbol = dataRow.symbol;
    // console.log('deleting symbol...', stockSymbol);
    // push the new symbol to the service so it can be pused to the backend DB
    this.authService.removeStockFromWatchList(stockSymbol);
    this.stockQuoteService.deleteStockQuote(stockSymbol);
    // force the stock list to get refreshed while waiting for the timer to get it
    // console.log('onDelete-this.authService.getStockWatchList()', this.authService.getStockWatchList());
    this.stockQuoteService.refreshStockQuotes(this.authService.getStockWatchList());
  }


  ngOnChanges(changes: SimpleChanges): void {
    // make sure we have data and that the table has been initialized
    if (!!this.dataSource && !!this.table) {
      // take the new data and loop through it, updating existing records and adding new ones
      console.log('onChagnes - this.dataSource', this.table.dataSource);
      // this.loadDataTableWithNewStockData(this.newStockDataSource, this.dataSource);
      // this.table.dataSource = new MatTableDataSource(this.newStockDataSource);
      // this.table.dataSource = this.newStockDataSource;
      this.table.renderRows();

    }
  }

  private loadDataTableWithNewStockData(newStockData: StockQuote[], existingDataTable: StockGridDataSource) {
    // instead of setting the data table to teh value of the passed array of data,
    // we will insert/update existing data

    //loop through the new Stock Data
    newStockData.forEach((stockObject: StockQuote) => {
      // locate the record in the DataTable
      let foundDTRecord: StockQuote = existingDataTable.data.find(objStock => {
          // console.log('loadStockQArrayNewDAta: located object', key, stockObject);
          return objStock.symbol === stockObject.symbol;
        })

      // if the retuned object is NOT undefinded, then update the row to the DataTable
      if (foundDTRecord !== undefined) {
        console.log('updaing table with these vaules', stockObject);
          //update teh DataTable Record object
          foundDTRecord.curPercentChange = stockObject.curPercentChange;
          foundDTRecord.curPrice = stockObject.curPrice;
          foundDTRecord.curPriceChange = stockObject.curPriceChange;
          foundDTRecord.dayHigh = stockObject.dayHigh;
          foundDTRecord.dayLow = stockObject.dayLow;
          foundDTRecord.openPrice = stockObject.openPrice;
          foundDTRecord.previousClose = stockObject.previousClose;
          foundDTRecord.week52High = stockObject.week52High;
          foundDTRecord.week52Low = stockObject.week52Low;
          foundDTRecord.ytdChange = stockObject.ytdChange;
      } else {
        console.log('adding new record to table ', stockObject);
        // add a new record to the DataTable
        const newData = [...existingDataTable.data];
        newData.push(stockObject);
        existingDataTable.data = newData;

        // existingDataTable.data = [stockObject, ...existingDataTable.data];
      }
      this.cd.detectChanges();
    })

  }


  ngOnDestroy(): void {
     // remove the user's stocks from the data service
    this.stockQuoteService.clearStockQuotes();
    // clean up references to prevent data leaks
    this.stockChangeSub.unsubscribe();
    console.log('destroying the stock service subscription');
    this.timerSubscription.unsubscribe();
    console.log('destroying the timer subscription');

  }

}
