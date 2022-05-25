import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { StockGridDataSource, StockGridItem } from './stock-grid-datasource';

@Component({
  selector: 'app-stock-grid',
  templateUrl: './stock-grid.component.html',
  styleUrls: ['./stock-grid.component.css']
})
export class StockGridComponent implements AfterViewInit, OnChanges{
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
    console.log('stock-grid ts - after view init', this.dataSource);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('stock-grid ts - after on Chagnes', this.dataSource);
    this.table.dataSource = this.dataSource;
  }
}
