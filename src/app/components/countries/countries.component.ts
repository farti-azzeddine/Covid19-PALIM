import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/servises/data-service.service';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DateWiseData } from 'src/app/models/data-wise-data';
import { GoogleChartInterface } from 'ng2-google-charts';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  data: GlobalDataSummary[];
  countries: string[] = [];
  totalConfirmed = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  totalActive = 0;
  selectedCountryData: DateWiseData[];
  dateWiseData;
  lineChart: GoogleChartInterface = {
    chartType: 'lineChart'
  };
  loading: boolean;
  constructor(private service: DataServiceService) { }

  ngOnInit(): void {
    merge(
      this.service.getdataWiseData().pipe(map(result => {
        this.dateWiseData = result;
      })
      ),
      this.service.getGlobalData().pipe(map(result => {
      this.data = result;
      this.data.forEach(cs => {
      this.countries.push(cs.country);
        });
      }))
    ).subscribe(
      {
        complete: () => {
        this.updateValues('Morocco');
        }
      }
    );

    this.service.getGlobalData().subscribe(result => {
      this.data = result;
      this.data.forEach(cs => {
        this.countries.push(cs.country);
      });
      // this.updateValues('US');
    });
  }
  updateChart(){
    const dataTable = [];
    dataTable.push(['Date' , 'Cases']);
    this.selectedCountryData.forEach(cs => {dataTable.push([cs.date , cs.cases]); });
    this.lineChart = {
      chartType: 'LineChart',
      // tslint:disable-next-line:object-literal-shorthand
      dataTable: dataTable,
      options: { height: 500 }
    };
  }
  updateValues(country: string){
    console.log(country);
    this.data.forEach(cs => {
      if (cs.country === country){
        this.totalActive = cs.actives;
        this.totalConfirmed = cs.confirmed;
        this.totalDeaths = cs.deaths;
        this.totalRecovered = cs.recovered;
      }
    });
    this.selectedCountryData = this.dateWiseData[country];
    this.updateChart();
    console.log('huhu');
  }
}
