import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Label } from 'ng2-charts';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { GetBackendService } from 'src/app/services/get-backend.service';
import { Observable, Subscription, UnsubscriptionError } from 'rxjs';


//import { default as _rollupMoment, Moment } from 'moment';
//const moment = _rollupMoment || _moment;
const moment = _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-chart-mes',
  templateUrl: './chart-mes.component.html',
  styleUrls: ['./chart-mes.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ChartMesComponent implements OnInit, OnDestroy{
  @ViewChild(BaseChartDirective)
  baseChart!: BaseChartDirective;




  date = new FormControl(moment());
  dato:any
  retorno:any
  barData: number[] = []
  indiceMes:number = 30
  observ: Subscription = new Subscription;






  public barChartOptions: ChartOptions = {
    responsive: true,

  };
  barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    { data: this.barData, label: 'Ingresos' },
  ];

  constructor(private getBackendService:GetBackendService) { }

  chosenYearHandler(normalizedYear: Moment) {

    /* this.barData = []
    this.barChartLabels = [];
    this.barChartData = [] */
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    this.dato = this.date.value.toISOString().split('-')


    this.observ = this.getBackendService.postGraf2(this.dato).subscribe(resp => {
      this.retorno = resp
      this.indiceMes = this.getDaysInMonth(this.dato[1], this.dato[0]) //Obtiene los dias del mes
      for(let i=1;i<=this.indiceMes;i++){
        this.barData[i] = 0
        this.barChartLabels[i] = ''
      }
      for(let i=1;i<=this.indiceMes;i++){
        this.barChartLabels[i] = i+'-'+this.dato[1]+'-'+this.dato[0]
      }
      /* for(let i=1;i<=this.indiceMes;i++){
        this.barData[this.retorno.ingresosDia.dia] = this.retorno.ingresosDia.ingresoDia
      } */
       console.log('retorno:', this.retorno, 'ingresosDia:',this.retorno.ingresosDia)
      this.retorno.ingresosDia.forEach((element: any) => {
        this.barData[element.dia] = element.ingresoDia
      });

      //this.baseChart.chart.update()

      console.log('  this.barData:', this.barData, '  this.barChartLabels:', this.barChartLabels)

    })
    datepicker.close();
    this.baseChart.chart.update()

  }

  getDaysInMonth = function(month:number,year:number) {
   return new Date(year, month, 0).getDate();
  };

  refresh_chart() {
    setTimeout(() => {
        if (this.baseChart && this.baseChart.chart && this.baseChart.chart.config) {
            this.baseChart.datasets = [];
            this.barData = []
            this.baseChart.chart.update();
        }
    });
}




  ngOnInit() {


  }

  ngOnDestroy(){
    this.observ.unsubscribe()
    this.barData = []
    this.barChartLabels = [];
  }

}
