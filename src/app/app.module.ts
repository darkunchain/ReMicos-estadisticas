import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { ChartsModule } from 'ng2-charts';
import { MyBarChartComponent } from './components/my-bar-chart/my-bar-chart.component';
import { HttpClientModule } from '@angular/common/http';
import { ChartMesComponent } from './components/chart-mes/chart-mes.component';
import { MaterialModule } from './material.module';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MyBarChartComponent,
    ChartMesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ChartsModule,
    HttpClientModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
