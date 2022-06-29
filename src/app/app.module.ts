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
import { LoginComponent } from './home-page/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RandomQuoteComponent } from './shared/random-quote/random-quote.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AdminComponent } from './admin/admin-component/admin-component.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StockGridComponent } from './stocks/stock-grid/stock-grid.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BackgroundComponent } from './shared/background/background.component';

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
    RandomQuoteComponent,
    LoadingSpinnerComponent,
    AdminComponent,
    StockGridComponent,
    BackgroundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
