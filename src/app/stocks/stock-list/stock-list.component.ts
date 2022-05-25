import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { map, Subscription, timer } from 'rxjs';
import { Constants } from 'src/app/config/constants';
import { AuthService } from 'src/app/shared/auth.service';
import { StockQuote } from 'src/app/shared/models/stock-quote.model';
import { StockDataService } from '../stock-data.service';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})
export class StockListComponent implements OnInit, OnDestroy {
  allStocks: StockQuote[];
  private stockChangeSub: Subscription; // getting notifications when the data changes
  private timerSubscription: Subscription; // forcing new data on an interval
  @ViewChild('addStockForm') addStockForm: NgForm;

  constructor(private stockQuoteService: StockDataService,
    private authService: AuthService,
    private config: Constants) { }

  ngOnInit(): void {
    // force the stock list to get refreshed while waiting for the timer to get it
    this.stockQuoteService.refreshStockQuotes(this.authService.getStockWatchList());

     // handling the getting of the current Sector data
    this.allStocks = this.stockQuoteService.getStockQuotes();
    this.stockChangeSub = this.stockQuoteService.stockDataChanged.subscribe(
      (newStockWatchListData: StockQuote[]) => {
        console.log('Stock-list ts - new stock data just came in ', newStockWatchListData);
        this.allStocks = newStockWatchListData;
        console.log('stock-list ts - allStocks now =', this.allStocks);
      }
    );
    //setting up a timer to get data incrementally (every 60 sec)
    this.timerSubscription = timer(0, this.config.API_DELAY_MILLISECONDS).pipe(
      map(() => {
        // load the latest sector data via the http request
        this.stockQuoteService.refreshStockQuotes(this.authService.getStockWatchList());
        // log when data is refreshed so we can check for memory leaks
        let date: Date = new Date;
        console.log(date + ' - refressing the stock data');
      })
    ).subscribe();

  }


  onAddNewStock() {
    //get the stock symbol from the template
    const newStockSymbol: string = this.addStockForm.value.stockSymbol;
    // load the latest sector data via the http request
    const symbolArray: string[] = this.authService.getStockWatchList().slice();
    symbolArray.push(newStockSymbol);
    this.stockQuoteService.refreshStockQuotes(symbolArray);
    // push the new symbol to the service so it can be pused to the backend DB
    this.authService.addStockToWatchList(newStockSymbol);
    this.addStockForm.reset();


  }

  ngOnDestroy(): void {
    this.stockChangeSub.unsubscribe();
    console.log('destroying the stock service subscription');
    this.timerSubscription.unsubscribe();
    console.log('destroying the timer subscription');
  }
}
