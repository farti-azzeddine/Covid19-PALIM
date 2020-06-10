import { Component, OnInit, Input } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { DataServiceService } from 'src/app/servises/data-service.service';
import { GlobalDataSummary } from 'src/app/models/global-data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {

  totalConfirmed = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  totalActive = 0;
  globalData: GlobalDataSummary[];
  pieChart: GoogleChartInterface = {
    chartType: 'pieChart'
  };
  columnChart: GoogleChartInterface = {
    chartType: 'columnChart'
  };
  constructor(private dataservice: DataServiceService) { }

  initChart(casetype: string) {
    let datatable = [];
    datatable.push(['country', 'Cases']);
    this.globalData.forEach(cs => {
      let valeur: number;
      if (casetype == 'c') {
        if (cs.confirmed > 200000) {
          valeur = cs.confirmed;
          datatable.push([
            cs.country, valeur
          ]);
        }
      }
      if (casetype == 'a') {
        if (cs.actives > 90000) {
          valeur = +cs.actives;
          datatable.push([
            cs.country, valeur
          ]);
        }
      }
      if (casetype == 'd') {
        if (cs.deaths > 10000) {
          valeur = cs.deaths;
          datatable.push([
            cs.country, valeur
          ]);
        }
      }
      if (casetype == 'r') {
        if (cs.recovered > 140000) {
          valeur = cs.recovered;
          datatable.push([
            cs.country, valeur
          ]);
        }
      }
    });
    this.pieChart = {
      chartType: 'PieChart',
      dataTable: datatable,
      options: { height: 500 }
    };
    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: datatable,
       options: {height: 500}
    };
  }
  ngOnInit(): void {
    this.dataservice.getGlobalData().subscribe(
      {
        next: result => {
          console.log(result);
          this.globalData = result;
          result.forEach(cs => {
            if (!Number.isNaN(cs.confirmed)) {
              this.totalActive += cs.actives;
              this.totalConfirmed += cs.confirmed;
              this.totalDeaths += cs.deaths;
              this.totalRecovered += cs.recovered;
            }
          });
          this.initChart('a');
          console.log('test');
        }
      }
    )
  }
  updateChart(input: HTMLInputElement) {
         this.initChart(input.value);
        // this.initChart('input.value');
      }
}

