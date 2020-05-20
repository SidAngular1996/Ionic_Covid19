import { Component, OnInit } from '@angular/core';
import { CovidapiService } from '../covidapi.service'
import { MenuController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CommonModule } from "@angular/common";
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  jsonData: any[];
  totalCases: stateData;
  stateCases: stateData[]
  navigate: any



 flag:boolean=false


  constructor(private covid19api: CovidapiService) {

  }
  ngOnInit() {
  


    this.getData();
  }

  getData() {
    this.covid19api.getStateWiseList().subscribe(
      (data) => {
        this.covid19api.getDistrictList().subscribe(
          (districtData) => {

            console.log("State All Data", data)
            console.log("District Data", districtData)
            this.manipulateData(data, districtData)
          },

        )
      },

    )
  }


  manipulateData(Data, districtData?) {

    this.totalCases = Data.statewise.find(
      element => element.state === 'Total'
    );

    console.log("Total Cases", this.totalCases)

    this.stateCases = Data.statewise.filter(
      element => element.state !== 'Total' && (element.confirmed != "0")
    );

    console.log("State Cases", this.stateCases)

    if (districtData) {
      this.stateCases.forEach(element => {
        const stateData = districtData.find(district => district.state === element.state);
        if (stateData) {
          element.districts = stateData.districtData;
        }
      })
    }
    console.log("State Cases", this.stateCases)
  }

  showDistrictData(state: string) {
    console.log(state)
    this.stateCases.forEach(element => {
      if (element.state === state) {
        element.expanded = !element.expanded;
        this.flag=true
      }
    })
  }

}

export interface stateData {
  active: string,
  confirmed: string,
  recovered: string,
  deaths: string,
  state: string,
  districts: districtData[],
  expanded: boolean
}

export interface districtData {
  district: string,
  confirmed: number,

}



