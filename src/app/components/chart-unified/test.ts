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
      { data: [], label: 'Tiempo15' },
      { data: [], label: 'Tiempo30' },
      { data: [], label: 'Tiempo60' },
      { data: [], label: 'Tiempo15p' },
      { data: [], label: 'Tiempo30p' },
    ];
  
    constructor(private getBackendService: GetBackendService) {}
  
    ngOnInit(): void {}
  
    updateChartMes() {
      const dato = this.dateMes.value.toISOString().split('-');
      this.observ.unsubscribe();
      this.observ = this.getBackendService.postGraf2(dato).subscribe(resp => {
        const retorno = resp;
        const daysInMonth = new Date(dato[0], dato[1], 0).getDate();
        this.barData = Array(daysInMonth).fill(0);
        this.barChartLabels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}-${dato[1]}-${dato[0]}`);
  
        // Rellenar los datos para la primera gráfica
        retorno.ingresosDia.forEach((element: any) => {
          this.barData[element.dia - 1] = element.ingresoDia;
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
  
        // Rellenar los datos para la primera gráfica
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
  
        this.barData = Array(years.length).fill(0);
        this.barChartLabels = years.map(year => year.toString());
  
        // Rellenar los datos para la primera gráfica
        retorno.ingresosMes.forEach((element: any) => {
          const yearIndex = element._id.year - startYear;
          this.barData[yearIndex] = element.ingresoMes;
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
  