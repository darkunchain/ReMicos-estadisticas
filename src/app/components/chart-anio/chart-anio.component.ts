import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Label } from 'ng2-charts';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { GetBackendService } from 'src/app/services/get-backend.service';

const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    yearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    yearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-chart-anio',
  templateUrl: './chart-anio.component.html',
  styleUrls: ['./chart-anio.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ChartAnioComponent implements OnInit {
  @ViewChild(BaseChartDirective) baseChart!: BaseChartDirective;

  date = new FormControl(moment());
  dato: any;
  retorno: any;
  barData: number[] = Array(12).fill(0); // Inicializar los datos para 12 meses

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: this.barData, label: 'Ingresos' }
  ];

  constructor(private getBackendService: GetBackendService) {}
  
  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {    
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    this.dato = this.date.value.year();
    //console.log('dato:', this.dato);
    this.barData = Array(12).fill(0);
    this.getBackendService.postGrafAnual(this.dato).subscribe(resp => {
      this.retorno = resp;
        this.retorno.ingresosMes.forEach((element: any) => {        
        var indi=element._id.month - 1 
        this.barData[indi] = element.ingresoMes;        
      });
      //console.log('bardata:', this.barData);
      this.barChartData = [
        { data: this.barData, label: 'Ingresos' }
      ];
      this.baseChart.chart.update();
    });

    datepicker.close();    
  }

  ngOnInit(): void {}
}
