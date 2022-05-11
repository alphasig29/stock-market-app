import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class Constants {
  public readonly API_ENDPOINT: string = 'https://sandbox.iexapis.com/stable/stock/market/batch';
  public readonly API_MOCK_ENDPOINT: string = 'https://sandbox.iexapis.com/stable/stock/market/batch';
  public readonly API_DELAY_MILLISECONDS: number = 5000;


  public readonly API_STOCK_TOKEN_PARAM_NAME: string = 'token';
  public readonly API_STOCK_SECTOR_PARM_VALUE: string = 'XLC,XLY,XLP,XLE,XLF,XLV,XLI,XLB,XLRE,XLK,XLU';
  public readonly API_STOCK_SECTOR_PARM_NAME: string = 'symbols';
  public readonly API_STOCK_QUOTE_PARAM_OPTION_NAME: string = 'types';
  public readonly API_STOCK_QUOTE_PARAM_OPTION_VALUE: string = 'quote';

}
