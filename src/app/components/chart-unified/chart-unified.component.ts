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
import { Subscription } from 'rxjs';

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

export const YEAR_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    yearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-chart-unified',
  templateUrl: './chart-unified.component.html',
  styleUrls: ['./chart-unified.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ChartUnifiedComponent implements OnInit {
  @ViewChild(BaseChartDirective) baseChart!: BaseChartDirective;

  dateMes = new FormControl(moment());
  dateAnio = new FormControl(moment());
  dateSummary = new FormControl(moment());

  barData: number[] = [];
  barDataComparative: number[][] = []; // Array bidimensional para las barras segmentadas
  observ: Subscription = new Subscription();

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: this.barData, label: 'Ingresos' },
  ];

  public barChartDataComparative: ChartDataSets[] = [
    { data: [], label: '15 min.' },
    { data: [], label: '30 min.' },
    { data: [], label: '1 hora' },
    { data: [], label: '+15 min' },
    { data: [], label: '+30 min' },
  ];

  constructor(private getBackendService: GetBackendService) { }

  ngOnInit(): void { }

  chosenYearHandler(normalizedYear: Moment, control: FormControl, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = control.value;
    ctrlValue.year(normalizedYear.year());
    control.setValue(ctrlValue);
    datepicker.close();
    if (control === this.dateAnio) {
      this.updateChartAnio();
    } else if (control === this.dateMes) {
      control.setValue(ctrlValue.clone().month(0)); // Reset month to January
      datepicker.open();
    }
  }

  chosenYearMonthHandler(normalizedYear: Moment, control: FormControl, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = control.value;
    ctrlValue.year(normalizedYear.year());
    control.setValue(ctrlValue);    
    if (control === this.dateAnio) {
      this.updateChartAnio();
    } else if (control === this.dateMes) {
      control.setValue(ctrlValue.clone().month(0)); // Reset month to January
      datepicker.open();
    }
  }

  chosenMonthHandler(normalizedMonth: Moment, control: FormControl, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = control.value;
    ctrlValue.month(normalizedMonth.month());
    control.setValue(ctrlValue);
    datepicker.close();
    if (control === this.dateMes) {
      this.updateChartMes();
    } else if (control === this.dateSummary) {
      this.updateChartSummary();
    }
  }

  updateChartMes() {
    const dato = this.dateMes.value.toISOString().split('-');
    this.observ.unsubscribe();
    this.observ = this.getBackendService.postGraf2(dato).subscribe(resp => {
      const retorno = resp;
      const daysInMonth = new Date(dato[0], dato[1], 0).getDate();
      this.barData = Array(daysInMonth).fill(0);
      this.barChartLabels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}-${dato[1]}-${dato[0]}`);

      retorno.ingresosDia.forEach((element: any) => {
        this.barData[element.dia - 1] = element.ingresoDia;
      });      

      this.barChartData = [{ data: this.barData, label: 'Ingresos' }];      
    });


    this.observ = this.getBackendService.postGrafSeg(dato).subscribe(resp => {
      const retorno = resp;
      const daysInMonth = new Date(dato[0], dato[1], 0).getDate();
      this.barDataComparative = Array(daysInMonth).fill(0);
      this.barChartLabels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}-${dato[1]}-${dato[0]}`);

      retorno.ingresosDia.forEach((element: any) => {
        this.barDataComparative[element.dia - 1] = element.ingresoDia;
      });

      // Rellenar los datos para la gráfica comparativa (tiempo15, tiempo30, etc.)
      this.barDataComparative = Array(daysInMonth).fill([0, 0, 0, 0, 0]); // Inicializamos con ceros
      retorno.ingresosDia.forEach((element: any) => {
        const dayIndex = element.dia - 1;
        this.barDataComparative[dayIndex] = [
          element.tiempo15 || 0,
          element.tiempo30 || 0,
          element.tiempo60 || 0,
          element.tiempo15p || 0,
          element.tiempo30p || 0,
        ];
      });

      this.barChartData = [{ data: this.barData, label: 'Ingresos' }];

      this.barChartDataComparative[0].data = this.barDataComparative.map(item => item[0]);
      this.barChartDataComparative[1].data = this.barDataComparative.map(item => item[1]);
      this.barChartDataComparative[2].data = this.barDataComparative.map(item => item[2]);
      this.barChartDataComparative[3].data = this.barDataComparative.map(item => item[3]);
      this.barChartDataComparative[4].data = this.barDataComparative.map(item => item[4]);
      this.baseChart.chart.update();
    });
  }

  updateChartAnio() {
    const year = this.dateAnio.value.year();
    this.observ.unsubscribe();
    this.observ = this.getBackendService.postGrafAnual(year).subscribe(resp => {
      const retorno = resp;
      this.barData = Array(12).fill(0);
      this.barChartLabels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

      retorno.ingresosMes.forEach((element: any) => {
        this.barData[element._id.month - 1] = element.ingresoMes;
      });      

      this.barChartData = [{ data: this.barData, label: 'Ingresos' }];      
      //this.baseChart.chart.update();
    });

    this.observ = this.getBackendService.postGrafSegAnual(year).subscribe(resp => {
      const retorno = resp;
      this.barData = Array(12).fill(0);
      this.barChartLabels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

      retorno.ingresosMes.forEach((element: any) => {
        this.barData[element._id.month - 1] = element.ingresoMes;
      });

      // Rellenar los datos para la gráfica comparativa (tiempo15, tiempo30, etc.)
      this.barDataComparative = Array(12).fill([0, 0, 0, 0, 0]);
      retorno.ingresosMes.forEach((element: any) => {
        const monthIndex = element._id.month - 1;
        this.barDataComparative[monthIndex] = [
          element.tiempo15 || 0,
          element.tiempo30 || 0,
          element.tiempo60 || 0,
          element.tiempo15p || 0,
          element.tiempo30p || 0,
        ];
      });

      this.barChartData = [{ data: this.barData, label: 'Ingresos' }];

      this.barChartDataComparative[0].data = this.barDataComparative.map(item => item[0]);
      this.barChartDataComparative[1].data = this.barDataComparative.map(item => item[1]);
      this.barChartDataComparative[2].data = this.barDataComparative.map(item => item[2]);
      this.barChartDataComparative[3].data = this.barDataComparative.map(item => item[3]);
      this.barChartDataComparative[4].data = this.barDataComparative.map(item => item[4]);
      this.baseChart.chart.update();
    });

  }

  updateChartSummary() {
    const month = this.dateSummary.value.month();
    this.observ.unsubscribe();
    this.observ = this.getBackendService.postGrafMes(month).subscribe(resp => {
      const retorno = resp;
      const currentYear = new Date().getFullYear();
      const startYear = 2021;
      const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);
      //console.log('retorno: ', retorno)
      this.barData = Array(years.length).fill(0);
      //console.log('barData: ', this.barData)
      this.barChartLabels = years.map(year => year.toString());
      //console.log('barChartLabels: ', this.barChartLabels)
      retorno.ingresosMes.forEach((element: any) => {
        const yearIndex = element._id.year - startYear;
        this.barData[yearIndex] = element.ingresoMes;
      });
       
      //console.log('this.barData: ',this.barData)
      this.barChartData = [{ data: this.barData, label: 'Ingresos' }];
      this.baseChart.chart.update();
    });


    this.observ = this.getBackendService.postGrafSegMes(month).subscribe(resp => {
      const retorno = resp;
      const currentYear = new Date().getFullYear();
      const startYear = 2021;
      const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);

      this.barDataComparative = Array(years.length).fill(0);
      this.barChartLabels = years.map(year => year.toString());

      retorno.ingresosMes.forEach((element: any) => {
        const yearIndex = element._id.year - startYear;
        this.barDataComparative[yearIndex] = element.ingresoMes;
      });


       // Rellenar los datos para la gráfica comparativa (tiempo15, tiempo30, etc.)
       this.barDataComparative = Array(years.length).fill([0, 0, 0, 0, 0]);
       retorno.ingresosMes.forEach((element: any) => {
         const yearIndex = element._id.year - startYear;
         this.barDataComparative[yearIndex] = [
           element.tiempo15 || 0,
           element.tiempo30 || 0,
           element.tiempo60 || 0,
           element.tiempo15p || 0,
           element.tiempo30p || 0,
         ];
       });

      this.barChartData = [{ data: this.barData, label: 'Ingresos' }];


      this.barChartDataComparative[0].data = this.barDataComparative.map(item => item[0]);
      this.barChartDataComparative[1].data = this.barDataComparative.map(item => item[1]);
      this.barChartDataComparative[2].data = this.barDataComparative.map(item => item[2]);
      this.barChartDataComparative[3].data = this.barDataComparative.map(item => item[3]);
      this.barChartDataComparative[4].data = this.barDataComparative.map(item => item[4]);

      this.baseChart.chart.update();
    });

  }
}
