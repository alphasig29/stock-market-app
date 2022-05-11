import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SectorListComponent } from './sectors/sector-list/sector-list.component';
import { StockListComponent } from './stocks/stock-list/stock-list.component';
import { HomePageComponent } from './home-page/home-page.component';
import { FooterComponent } from './shared/footer/footer.component';
import { StockCardComponent } from './shared/stock-card/stock-card.component';
import { HttpClientModule } from '@angular/common/http';
import { Constants } from './config/constants';
import { LoginComponent } from './home-page/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RandomQuoteComponent } from './shared/random-quote/random-quote.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SectorListComponent,
    StockListComponent,
    HomePageComponent,
    FooterComponent,
    StockCardComponent,
    LoginComponent,
    RandomQuoteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
