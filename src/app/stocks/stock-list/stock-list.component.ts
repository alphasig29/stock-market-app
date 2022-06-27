import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { map, Subscription, timer, startWith } from 'rxjs';
import { Constants } from 'src/app/config/constants';
import { AuthService } from 'src/app/shared/auth.service';
import { StockQuote } from 'src/app/shared/models/stock-quote.model';
import { StockDataService } from '../stock-data.service';
import { StockList } from 'src/app/shared/models/stock-list.model';
import { Observable } from 'rxjs';
import { FormControl, ValidatorFn, AbstractControl, Validators } from '@angular/forms';
// import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})
export class StockListComponent implements OnInit {
  allStocks: StockQuote[];
  // private stockChangeSub: Subscription; // getting notifications when the data changes
  // private timerSubscription: Subscription; // forcing new data on an interval
  @ViewChild('addStockForm') addStockForm: NgForm;
  symbolOptions: StockList[] = [];
  addStockSymbolControl = new FormControl('',
      { validators: [this.autocompleteObjectValidator(), Validators.required] });
  // addStockSymbolExists: boolean = true;
  filteredSymbols: Observable<StockList[]>;

  constructor(private stockQuoteService: StockDataService,
    private authService: AuthService,
    private config: Constants) { }

  ngOnInit(): void {

    // get the list of all symblols for the 'add stock' feature
    this.symbolOptions = this.stockQuoteService.getAllStockSymbols();
    // this.addStockSymbolControl = new FormControl('',
    //   { validators: [this.autocompleteObjectValidator(), Validators.required] });

    this.filteredSymbols = this.addStockSymbolControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    // if (false) {
    //   // force the stock list to get refreshed while waiting for the timer to get it
    // this.stockQuoteService.refreshStockQuotes(this.authService.getStockWatchList());

    //  // handling the getting of the current Stock data
    // this.allStocks = this.stockQuoteService.getStockQuotes();
    //     this.stockChangeSub = this.stockQuoteService.stockDataChanged.subscribe(
    //   (newStockWatchListData: StockQuote[]) => {
    //     this.allStocks = newStockWatchListData;
    //   }
    // );
    // //setting up a timer to get data incrementally (every 60 sec)
    // this.timerSubscription = timer(0, this.config.API_DELAY_MILLISECONDS).pipe(
    //   map(() => {
    //     // load the latest sector data via the http request
    //     this.stockQuoteService.refreshStockQuotes(this.authService.getStockWatchList());
    //     // log when data is refreshed so we can check for memory leaks
    //     let date: Date = new Date;
    //     console.log(date + ' - refressing the stock data');
    //   })
    // ).subscribe();
    // }


  }

  // public displayStockListFn(stockList?: StockList): string | undefined {
  //   console.log('stockList', stockList);
  //   return stockList ? stockList['ACT Symbol'] : undefined;
  // }

  onAddNewStock() {
    // The Add Stock button is only enabled when the value entered is valid,
    // so no need to check that.

    //get the stock symbol from the template
    const newStockSymbol: string = this.addStockSymbolControl.value;
        // load the latest sector data via the http request
    const symbolArray: string[] = this.authService.getStockWatchList().slice();
    symbolArray.push(newStockSymbol);
    this.stockQuoteService.refreshStockQuotes(symbolArray);
    // push the new symbol to the service so it can be pused to the backend DB
    this.authService.addStockToWatchList(newStockSymbol);
    // reset the form
    this.addStockSymbolControl.reset();
    this.addStockForm.reset();

  }

  private _filter(value: string): StockList[] {
    // console.log('filter string', value);
    const filterValue = this._normalizeValue(value);
    // return this.symbolOptions.filter(option => this._normalizeValue(option['ACT Symbol']).includes(filterValue));
    return this.symbolOptions.filter(option => option['ACT Symbol'].toLowerCase().indexOf(filterValue) === 0);
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }


  private autocompleteObjectValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {

      // only validate if the control has been tuched (working around a Form.reset)
      if (!control.touched) {
        console.log('Add Stock - control not touched yet');
        return { 'invalidAutocompleteObject': { value: control.value } };
      }
      // if the control is dirty...
      const itemIndex = this.symbolOptions.findIndex(obj => obj['ACT Symbol'].toLowerCase() === control.value.toLowerCase());
      console.log('stocklist - itemIndex', itemIndex);
      if (itemIndex === -1) {
        return { 'invalidAutocompleteObject': { value: control.value } };
      }
      return null;  /* valid option selected */
    }
  }

}
