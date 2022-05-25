/* this module will handle all the http requests to the
3rd party API service to keep it from
*/

import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Constants } from "src/app/config/constants";
import { APIAllSectorStockQuote } from "../models/api-stock-quote.model";
import { catchError, throwError, map } from "rxjs";
import { environment } from "src/environments/environment";
import { SectorDataService } from "src/app/sectors/sector-data.service";

 enum RequestType {
  SectorData,
  StockList
  }

@Injectable({ providedIn: 'root' })

export class StockAPIService {


    constructor(private http: HttpClient,
      private config: Constants) { }

  getAllSectorData() {
    return this.retrieveStockDataFromAPI(RequestType.SectorData);
  }

  // need the ability to check if a stock exists
  getStockQuote(symbol: string) {
    // call the API Service for the passed symbol

    // build the list of params to pass to retrieve all sector data
    let searchParams = new HttpParams();
    searchParams = searchParams.append(this.config.API_STOCK_SECTOR_PARM_NAME, symbol);
    searchParams = searchParams.append(this.config.API_STOCK_QUOTE_PARAM_OPTION_NAME, this.config.API_STOCK_QUOTE_PARAM_OPTION_VALUE);
    searchParams = searchParams.append(this.config.API_STOCK_TOKEN_PARAM_NAME, environment.API_IEXCLOUD_TOKEN);
    return this.http.get<APIAllSectorStockQuote[]>(this.config.API_ENDPOINT,
      {
        params: searchParams,
        responseType: 'json'
      })
        .pipe(map((data: any) => {
        //handle api 200 response code here or you wanted to manipulate to response
          return true;
        }),
          catchError((error) => {    // handle error
            return throwError(() => new Error('StockDoesNotExist'));
          })
        );
  }


  getStockDataForList(stocks: string[]) {
    // only try to retrieve stocks if we have a list.
    if (stocks.length > 0) {
      return this.retrieveStockDataFromAPI(RequestType.StockList, stocks);
    } else {
      return null;
    }
  }

  private retrieveStockDataFromAPI(dataOption: RequestType, stockList?: string[]) {
    // build the list of params to pass to retrieve all sector data
    let searchParams = new HttpParams();

    switch (dataOption) {
      case RequestType.SectorData: {
        // retrieve the list of 11 sectors
        searchParams = searchParams.append(this.config.API_STOCK_SECTOR_PARM_NAME, this.config.API_STOCK_SECTOR_PARM_VALUE);
        break;
      }
      case RequestType.StockList: {
        // only try to retrieve stocks if we have a list.
        if (stockList.length > 0) {
          //build the comma seperated list of stock symbols
          const symbols: string = stockList.join(",");
          console.log("sumbols: ", symbols);

          // retrieve the quotes for the selected stocks
           searchParams = searchParams.append(this.config.API_STOCK_SECTOR_PARM_NAME, symbols);

        }
        break;
      }
    }


    // build the rest of the parameters that are needed to get data from the API
    searchParams = searchParams.append(this.config.API_STOCK_QUOTE_PARAM_OPTION_NAME, this.config.API_STOCK_QUOTE_PARAM_OPTION_VALUE);
    searchParams = searchParams.append(this.config.API_STOCK_TOKEN_PARAM_NAME, environment.API_IEXCLOUD_TOKEN);

    return this.http.get<APIAllSectorStockQuote[]>(this.config.API_ENDPOINT,
      {
        params: searchParams,
        responseType: 'json'
      })
        .pipe(map((data: any) => {
        //handle api 200 response code here or you wanted to manipulate to response
          return data;
        }),
          catchError((error) => {    // handle error
            if (error.status == 404) {
              //Handle Response code here
            }
            return throwError(() => new Error('errorReceivingJSON'));
          })
        );

  }


}
