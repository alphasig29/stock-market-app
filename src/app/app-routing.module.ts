import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { SectorListComponent } from './sectors/sector-list/sector-list.component';
import { StockListComponent } from './stocks/stock-list/stock-list.component';
import { RouleGuardService } from './shared/role-guard.service';
import { AdminComponent } from './admin/admin-component/admin-component.component';

const routes: Routes = [
  {path: "", component: HomePageComponent, pathMatch: "full"},
  {path: "sectors", component: SectorListComponent, canActivate: [RouleGuardService], data: {expectedRole: 'subscriber'}},
  { path: "stocks", component: StockListComponent, canActivate: [RouleGuardService], data: { expectedRole: 'subscriber' } },
  {path: "admin", component: AdminComponent, canActivate: [RouleGuardService], data: {expectedRole: 'admin'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
