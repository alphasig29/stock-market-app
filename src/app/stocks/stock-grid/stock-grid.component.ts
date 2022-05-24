import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { StockGridDataSource, StockGridItem } from './stock-grid-datasource';

@Component({
  selector: 'app-stock-grid',
  templateUrl: './stock-grid.component.html',
  styleUrls: ['./stock-grid.component.css']
})
export class StockGridComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<StockGridItem>;
  @Input() dataSource: StockGridDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  // displayedColumns = ['id', 'name'];
  displayedColumns = ['symbol', 'name', 'curPrice', 'curPriceChange', 'curPercentChange',
    'previousClose', 'openPrice', 'dayLow', 'dayHigh', 'week52High', 'week52Low', 'ytdChange'];


  constructor() {
    this.dataSource = new StockGridDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
