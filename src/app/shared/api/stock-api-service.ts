/* this module will handle all the http requests to the
3rd party API service to keep it from
*/

import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Constants } from "src/app/config/constants";
import { APIAllSEctorStockQuote } from "../models/api-stock-quote.model";
import { catchError, throwError, map } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })

export class StockAPIService {

    constructor(private http: HttpClient,
      private config: Constants) { }


  getAllSectorData() {
      // build URL to call the API
      // const apiUrl = this.config.API_MOCK_ENDPOINT +
      //     this.config.API_OPTION +
      // this.config.API_KEY_TEST;

    // build the list of params to pass to retrieve all sector data
    let searchParams = new HttpParams();
    searchParams = searchParams.append(this.config.API_STOCK_SECTOR_PARM_NAME, this.config.API_STOCK_SECTOR_PARM_VALUE);
    searchParams = searchParams.append(this.config.API_STOCK_QUOTE_PARAM_OPTION_NAME, this.config.API_STOCK_QUOTE_PARAM_OPTION_VALUE);
    searchParams = searchParams.append(this.config.API_STOCK_TOKEN_PARAM_NAME, environment.API_IEXCLOUD_TOKEN);
    console.log('Using Environment Variables!');
    return this.http.get<APIAllSEctorStockQuote[]>(this.config.API_ENDPOINT,
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
