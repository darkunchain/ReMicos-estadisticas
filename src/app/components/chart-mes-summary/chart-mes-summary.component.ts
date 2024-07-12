import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Label } from 'ng2-charts';
import { GetBackendService } from 'src/app/services/get-backend.service';

@Component({
  selector: 'app-chart-mes-summary',
  templateUrl: './chart-mes-summary.component.html',
  styleUrls: ['./chart-mes-summary.component.css']
})
export class ChartMesSummaryComponent implements OnInit {
  @ViewChild(BaseChartDirective) baseChart!: BaseChartDirective;

  dato: any;
  retorno: any;
  barData: number[] = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: this.barData, label: 'Ingresos' }
  ];

  months = [
    { value: 0, viewValue: 'Enero' },
    { value: 1, viewValue: 'Febrero' },
    { value: 2, viewValue: 'Marzo' },
    { value: 3, viewValue: 'Abril' },
    { value: 4, viewValue: 'Mayo' },
    { value: 5, viewValue: 'Junio' },
    { value: 6, viewValue: 'Julio' },
    { value: 7, viewValue: 'Agosto' },
    { value: 8, viewValue: 'Septiembre' },
    { value: 9, viewValue: 'Octubre' },
    { value: 10, viewValue: 'Noviembre' },
    { value: 11, viewValue: 'Diciembre' }
  ];

  constructor(private getBackendService: GetBackendService) {}

  chosenMonthHandler(month: number) {
    const currentYear = new Date().getFullYear();
    const startYear = 2021;
    const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);

    this.barData = Array(years.length).fill(0);

    this.getBackendService.postGrafMes(month).subscribe(resp => {
      this.retorno = resp;
      console.log( 'this.retorno:',this.retorno)
      this.retorno.ingresosMes.forEach((element: any) => {
        const indi = element._id.year - startYear;
        this.barData[indi] = element.ingresoMes;
      });
      this.barChartLabels = years.map(year => year.toString());
      this.barChartData = [
        { data: this.barData, label: 'Ingresos' }
      ];
      this.baseChart.update();
    });
  }

  ngOnInit(): void {}
}
