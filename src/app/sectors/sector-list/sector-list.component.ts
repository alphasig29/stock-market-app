import { Component, OnDestroy, OnInit } from '@angular/core';
import { StockQuote } from 'src/app/shared/models/stock-quote.model';
import { SectorDataService } from '../sector-data.service';
import { Subscription, timer, map } from 'rxjs';
import { Constants } from "../../config/constants";

@Component({
  selector: 'app-sector-list',
  templateUrl: './sector-list.component.html',
  styleUrls: ['./sector-list.component.css']
})
export class SectorListComponent implements OnInit, OnDestroy {
  allSectors: StockQuote[];
  private sectorChangeSub: Subscription; // getting notifications when the data changes
  private timerSubscription: Subscription; // forcing new data on an interval

  constructor(private sectorQuoteService: SectorDataService,
    private config: Constants) { }

  ngOnInit(): void {
    // handling the getting of the current Sector data
    this.allSectors = this.sectorQuoteService.getSectorData();
    this.sectorChangeSub = this.sectorQuoteService.sectorDataChanged.subscribe(
      (newSectorData: StockQuote[]) => {
        this.allSectors = newSectorData;
      }
    );
    //setting up a timer to get data incrementally (every 60 sec)
    this.timerSubscription = timer(0, this.config.API_DELAY_MILLISECONDS).pipe(
      map(() => {
        // load the latest sector data via the http request
        this.sectorQuoteService.refreshSectorData();
        // log when data is refreshed so we can check for memory leaks
        let date: Date = new Date;
        console.log(date + ' - refressing the sector data');
      })
    ).subscribe();

  }

  onRefreshData(){
    this.sectorQuoteService.refreshSectorData();

  }

  ngOnDestroy(): void {
    this.sectorChangeSub.unsubscribe();
    console.log('destroying the service subscription');
    this.timerSubscription.unsubscribe();
    console.log('destroying the timer subscription');
  }
}
