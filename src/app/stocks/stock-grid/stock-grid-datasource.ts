import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';


// TODO: Replace this with your own data model type
export interface StockGridItem {
  symbol: string;
  name: string;
  curPrice: number;
  curPriceChange: number;
  curPercentChange: number;
  previousClose: number;
  openPrice: number;
  dayLow: number;
  dayHigh: number;
  week52High: number;
  week52Low: number;
  ytdChange: number;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: StockGridItem[] = [
{name:'Cons Disc', symbol: 'XLY', curPrice: 175.70, curPriceChange: -0.45, curPercentChange: -0.26, dayLow: 175.96, dayHigh: 179.78, week52High:179.48, week52Low: 176.78, ytdChange: 0, previousClose: 0, openPrice: 0},
 {name:'Cons Staples', symbol: 'XLP', curPrice: 78.33, curPriceChange: -0.07, curPercentChange: -0.09, dayLow: 78.25, dayHigh: 79.12, week52High:78.72, week52Low: 78.86, ytdChange: 0, previousClose: 0, openPrice: 0},
 {name:'Energy', symbol: 'XLE', curPrice: 77.29, curPriceChange: 0.15, curPercentChange: 0.19, dayLow: 76.96, dayHigh: 78.70, week52High:79.53, week52Low: 78.68, ytdChange: 0, previousClose: 0, openPrice: 0},
 {name:'Financials', symbol: 'XLF', curPrice: 37.77, curPriceChange: 0.05, curPercentChange: 0.13, dayLow: 37.66, dayHigh: 38.15, week52High:37.89, week52Low: 37.79, ytdChange: 0, previousClose: 0, openPrice: 0},
 {name:'Health Care', symbol: 'XLV', curPrice: 139.64, curPriceChange: -0.35, curPercentChange: -0.25, dayLow: 139.78, dayHigh: 143.00, week52High:142.83, week52Low: 142.42, ytdChange: 0, previousClose: 0, openPrice: 0},
 {name:'Industrials', symbol: 'XLI', curPrice: 99.75, curPriceChange: 1.47, curPercentChange: 0.47, dayLow: 99.10, dayHigh: 100.40, week52High:99.60, week52Low: 99.28, ytdChange: 0, previousClose: 0, openPrice: 0},
 {name:'Materials', symbol: 'XLB', curPrice: 88.04, curPriceChange: 0.00, curPercentChange: 0.00, dayLow: 87.93, dayHigh: 88.98, week52High:88.48, week52Low: 88.19, ytdChange: 0, previousClose: 0, openPrice: 0},
 {name:'Real Estate', symbol: 'XLRE', curPrice: 48.97, curPriceChange:-0.02, curPercentChange: -0.04, dayLow: 48.85, dayHigh: 49.79, week52High:49.67, week52Low: 19.56, ytdChange: 0, previousClose: 0, openPrice: 0},
 {name:'Techonogy', symbol: 'XLK', curPrice: 148.40, curPriceChange: -0.17, curPercentChange: -0.11, dayLow: 148.37, dayHigh: 150.69, week52High:152.41, week52Low: 150.50, ytdChange: 0, previousClose: 0, openPrice: 0},
 {name:'Comm Srvc', symbol: 'XLC', curPrice: 67.00, curPriceChange: -0.20, curPercentChange: -0.30, dayLow: 67.11, dayHigh: 68.26, week52High:68.08, week52Low: 67.63, ytdChange: 0, previousClose: 0, openPrice: 0},
 {name:'Utilities', symbol: 'XLU', curPrice: 76.00, curPriceChange: 0.09, curPercentChange: 0.12, dayLow: 75.79, dayHigh: 77.11, week52High:76.96, week52Low: 77.01, ytdChange: 0, previousClose: 0, openPrice: 0}
];

/**
 * Data source for the StockGrid view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class StockGridDataSource extends DataSource<StockGridItem> {
  // data: StockGridItem[] = EXAMPLE_DATA;
  data: StockGridItem[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<StockGridItem[]> {
    console.log('calling connect()');
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: StockGridItem[]): StockGridItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: StockGridItem[]): StockGridItem[] {
    console.log('Sorting grid start');
    // console.log('Sorting grid', this.sort?.active);
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      console.log('getSortedData:  returning data and not proceeding');
      console.log('!this.sort', !this.sort);
      console.log('!this.sort.active', !this.sort.active);
      console.log('this.sort.direction', this.sort.direction);
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      console.log('Sorting grid', this.sort?.active);
      switch (this.sort?.active) {
        case 'symbol': return compare(a.symbol, b.symbol, isAsc);
        case 'name': return compare(a.name, b.name, isAsc);
        case 'curPrice': return compare(+a.curPrice, +b.curPrice, isAsc);
        case 'curPriceChange': return compare(+a.curPriceChange, +b.curPriceChange, isAsc);
        case 'curPercentChange': return compare(+a.curPercentChange, +b.curPercentChange, isAsc);
        case 'dayLow': return compare(+a.dayLow, +b.dayLow, isAsc);
        case 'dayHigh': return compare(+a.dayHigh, +b.dayHigh, isAsc);
        case 'week52High': return compare(+a.week52High, +b.week52High, isAsc);
        case 'week52Low': return compare(+a.week52Low, +b.week52Low, isAsc);
        case 'ytdChange': return compare(+a.ytdChange, +b.ytdChange, isAsc);
        case 'previousClose': return compare(+a.previousClose, +b.previousClose, isAsc);
        case 'openPrice': return compare(+a.openPrice, +b.openPrice, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
