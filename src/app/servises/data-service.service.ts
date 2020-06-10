import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalDataSummary } from '../models/global-data';
import { DateWiseData } from '../models/data-wise-data';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  getDateWiseData() {
    throw new Error("Method not implemented.");
  }

  private globalDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/06-08-2020.csv';
  private dataWiseDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
  // tslint:disable-next-line:max-line-length
  // private globalDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/06-02-2020.csv';
  constructor(private http: HttpClient) { }

  getdataWiseData(){
    return this.http.get(this.dataWiseDataUrl, {responseType : 'text'}).pipe(
      map(result => {
        let mainData = {};
        let rows = result.split('\n');
        // console.log(rows);
        let header = rows[0];
        let dates = header.split(/,(?=\S)/)
        dates.splice(0 , 4);
        rows.splice(0 , 1);
        // console.log(dates);
        rows.forEach(row =>{
          let cols = row.split(/,(?=\S)/);
          let con = cols[1];
          cols.splice(0 , 4);
          mainData[con] = [];
          cols.forEach((value , index) =>{
            let dw : DateWiseData = {
              cases: +value,
              country: con,
              date: new Date(Date.parse(dates[index]))
            };
            mainData[con].push(dw);
          });
          // console.log(con , cols);
        });
        // console.log(mainData);
        return mainData;
      })
      );
    }
  getGlobalData(){
    return this.http.get(this.globalDataUrl, {responseType : 'text'}).pipe(
      map(result => {
        let data: GlobalDataSummary[] = [];
        let raw = {};
        // tslint:disable-next-line:prefer-const
        let rows = result.split('\n');
        rows.splice(0 , 1);
        // console.log(rows);
        rows.forEach(row =>{
          let cols = row.split(/,(?=\S)/)
          // console.log(cols);
          let cs = {
            // date: cols[4],
            country: cols[3],
            confirmed : +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            actives: +cols[10],
          };
          let temp : GlobalDataSummary = raw[cs.country];
          if (temp){
            temp.confirmed = cs.confirmed + temp.confirmed;
            temp.deaths = cs.deaths + temp.deaths;
            temp.recovered = cs.recovered + temp.recovered;
            temp.actives = cs.actives + temp.actives;
            raw[cs.country] = temp;
          }else{
            raw[cs.country] = cs;
          }
          // data.push();
        });
        // console.log(raw);
        // tslint:disable-next-line:no-angle-bracket-type-assertion
        return <GlobalDataSummary[]> Object.values(raw);
      })
    );
  }
}
