import { Component, OnInit } from '@angular/core';
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
export class StockListComponent implements OnInit {
  allStocks: StockQuote[];
  private stockChangeSub: Subscription; // getting notifications when the data changes
  private timerSubscription: Subscription; // forcing new data on an interval

  constructor(private stockQuoteService: StockDataService,
    private authService: AuthService,
    private config: Constants) { }

  ngOnInit(): void {
     // handling the getting of the current Sector data
    this.allStocks = this.stockQuoteService.getStockQuotes();
    this.stockChangeSub = this.stockQuoteService.stockDataChanged.subscribe(
      (newSectorData: StockQuote[]) => {
        this.allStocks = newSectorData;
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


  onSubmit() {

  }
}
