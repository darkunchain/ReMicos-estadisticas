import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { GetBackendService } from 'src/app/services/get-backend.service';

@Component({
  selector: 'app-my-bar-chart',
  templateUrl: './my-bar-chart.component.html',
  styleUrls: ['./my-bar-chart.component.css']
})
export class MyBarChartComponent implements OnInit {

  dataTable: any[] = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['Lunes', 'Martes', 'Miercoles',
   'Jueves', 'Viernes', 'Sabado', 'Domingo'];

  public bar1ChartBackground: Label[] = [
    'rgba(255, 99, 132, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(255, 99, 132, 0.6)',
    'rgba(255, 99, 132, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(255, 99, 132, 0.6)',
    'rgba(255, 99, 132, 0.6)'
  ]
  public bar2ChartBackground: Label[] = [
    'rgba(54, 162, 235, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(54, 162, 235, 0.6)',
    'rgba(54, 162, 235, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(54, 162, 235, 0.6)',
    'rgba(54, 162, 235, 0.6)'
  ]
  public bar3ChartBackground: Label[] = [
    'rgba(255, 206, 86, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(255, 206, 86, 0.6)',
    'rgba(255, 206, 86, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(255, 206, 86, 0.6)',
    'rgba(255, 206, 86, 0.6)'
  ]
  public bar4ChartBackground: Label[] = [
    'rgba(35, 82, 45, 0.6)', 'rgba(35, 82, 45, 0.6)', 'rgba(35, 82, 45, 0.6)',
    'rgba(35, 82, 45, 0.6)', 'rgba(35, 82, 45, 0.6)', 'rgba(35, 82, 45, 0.6)',
    'rgba(35, 82, 45, 0.6)'
  ]
  public bar5ChartBackground: Label[] = [
    'rgba(88, 59, 25, 0.6)', 'rgba(88, 59, 25, 0.6)', 'rgba(88, 59, 25, 0.6)',
    'rgba(88, 59, 25, 0.6)', 'rgba(88, 59, 25, 0.6)', 'rgba(88, 59, 25, 0.6)',
    'rgba(88, 59, 25, 0.6)'
  ]
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [];

  constructor(private getBackendService:GetBackendService) { }

  ngOnInit() {
    this.getBackendService.getGraf1().subscribe(datos =>{
      console.log('graf1: ', datos.lunes15)
      this.barChartData = [
        { data: [datos.lunes15, datos.martes15, datos.miercoles15,
          datos.jueves15, datos.viernes15, datos.sabado15, datos.domingo15],
          label: '15 min.',
          backgroundColor: this.bar1ChartBackground,
          barPercentage: 0.6
        },
        { data: [datos.lunes30, datos.martes30, datos.miercoles30,
          datos.jueves30, datos.viernes30, datos.sabado30, datos.domingo30],
          label: '30 min.',
          backgroundColor: this.bar2ChartBackground,
          barPercentage: 0.6
         },
        { data: [datos.lunes60, datos.martes60, datos.miercoles60,
          datos.jueves60, datos.viernes60, datos.sabado60, datos.domingo60],
          label: '1 hora',
          backgroundColor: this.bar3ChartBackground,
          barPercentage: 0.6
        },
        { data: [datos.lunes15c, datos.martes15c, datos.miercoles15c,
          datos.jueves15c, datos.viernes15c, datos.sabado15c, datos.domingo15c],
          label: '+ 15 min',
          backgroundColor: this.bar4ChartBackground,
          barPercentage: 0.6
        },
        { data: [datos.lunes30c, datos.martes30c, datos.miercoles30c,
          datos.jueves30c, datos.viernes30c, datos.sabado30c, datos.domingo30c],
          label: '+ 30 min',
          backgroundColor: this.bar5ChartBackground,
          barPercentage: 0.6
        },
      ];
      this.dataTable = [datos.lunes15,datos.lunes30,datos.lunes60,datos.lunes15c,datos.lunes30c,
        datos.martes15,datos.martes30,datos.martes60,datos.martes15c,datos.martes30c,
        datos.miercoles15,datos.miercoles30,datos.miercoles60,datos.miercoles15c,datos.miercoles30c,
        datos.jueves15,datos.jueves30,datos.jueves60,datos.jueves15c,datos.jueves30c,
        datos.viernes15,datos.viernes30,datos.viernes60,datos.viernes15c,datos.viernes30c,
        datos.sabado15,datos.sabado30,datos.sabado60,datos.sabado15c,datos.sabado30c,
        datos.domingo15,datos.domingo30,datos.domingo60,datos.domingo15c,datos.domingo30c,
      ]
    })
    this.getBackendService.getIngresos().subscribe(datos =>{
      console.log('Registros: ', datos)
    })
  }

}
