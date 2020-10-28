import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from "underscore";
import { ServerApiService } from '../../servises/server-api.service';
import { StatisticRecord, StatisticTable, StatisticTotal, LastEntries, Person, Action, Lead, DatesRequest } from 'app/app.component';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalService } from 'app/components/modal/modal.service';
import { Router } from '@angular/router';
import { PersonService } from '../../servises/person.service';

 
@Component({
  selector: 'dashboard-cmp',
  moduleId: module.id,
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})

export class DashboardComponent implements OnInit{
  personForm;
  statistic:      boolean = false;
  stat_record:    StatisticRecord;
  stat_table:     StatisticTable[] = [];
  contract_amount:number = 0;
  branch:         boolean = false;
  persons:        Person[] = [];
  leads:          Lead[]=[];
  actions:        Action[]=[];
  datesRequest:   DatesRequest;

  constructor(
    private ServerApiService: ServerApiService,
    private modalService: ModalService,
    private router: Router,
    private personService: PersonService,
  ) {
    let str = sessionStorage.getItem('dates_request');
    if (str==='login') {
      this.datesRequest = {
        intEndDate: moment().format('YYYY-MM-DD'),
        intStartDate: moment().add(-30, 'days').format('YYYY-MM-DD'),
        intEndTime: '23:59:00',
        intStartTime: '00:00:00',
      }
      console.log("this.datesRequest : ",this.datesRequest)
    } else {
      this.datesRequest = JSON.parse(str);
    }
    this.personForm = new FormGroup({
      statisticStartDate: new FormControl(this.datesRequest.intStartDate),
      statisticEndDate:   new FormControl(this.datesRequest.intEndDate),
      statisticStartTime: new FormControl(this.datesRequest.intStartTime),
      statisticEndTime:   new FormControl(this.datesRequest.intEndTime),
    });
  }

  openModal(id: string, x:number,y:number,l:number) {
    this.modalService.open(id,x,y,l);
  } 
  closeModal(id: string) {
    this.modalService.close(id);
  }
  ngOnInit(){
    let role = sessionStorage.getItem('role');
    if (role==='branch') this.branch = true;
    if (this.branch) {} else {
      this.showStatistic();
    }
  }

  showStatistic() {
    let startDateTime :string = '';
    let endDateTime   :string = '';
    this.datesRequest.intStartDate = this.personForm.value.statisticStartDate;
    this.datesRequest.intStartTime = this.personForm.value.statisticStartTime;
    this.datesRequest.intEndDate = this.personForm.value.statisticEndDate;
    this.datesRequest.intEndTime = this.personForm.value.statisticEndTime;
    let strData = JSON.stringify(this.datesRequest);
    sessionStorage.setItem('dates_request',strData);
    startDateTime = this.personForm.value.statisticStartDate + ' ' + this.personForm.value.statisticStartTime;
    endDateTime = this.personForm.value.statisticEndDate + ' ' + this.personForm.value.statisticEndTime;
    this.statistic = false;
    let statReqesr = {
      dates: {
        startDateTime: startDateTime,
        endDateTime: endDateTime,
      }
    }
    strData = JSON.stringify(statReqesr);
    this.ServerApiService.fetchReportInterval(strData)
    .subscribe((data:StatisticRecord)=>{
      this.stat_record = data;
      this.contract_amount = this.stat_record.con.con_table.reduce((s, f) => {
        return s + (+f.amount);
      }, 0);      
      this.statistic = true;
    }, (error) => {
      console.log(error);
    });
  }

  showPersons(type:string,filter:string,stat:StatisticTotal) {
    let table:StatisticTable[] = [];
    this.stat_table = [];
    if (type==='lid') {
      table = this.stat_record.lid.lid_table;
      if (filter==='sourse') {
        this.stat_table = _.where(table, {source:stat.data });
      }
    } else if (type==='tas') {
      table = this.stat_record.tas.tas_table;
      if (filter==='user') {
        this.stat_table = _.where(table, {create_user_id:stat.id });
      }
    } else if (type==='app') {
      table = this.stat_record.app.app_table;
      if (filter==='sourse') {
        this.stat_table = _.where(table, {source:stat.data });
      } else if (filter==='user') {
        this.stat_table = _.where(table, {user_id:stat.id });
      } else if (filter==='status') {
        this.stat_table = _.where(table, {status:stat.data });
      }
    } else if (type==='con') {
      table = this.stat_record.con.con_table;
      if (filter==='sourse') {
        this.stat_table = _.where(table, {source:stat.data });
      } else if (filter==='user') {
        this.stat_table = _.where(table, {create_user_id:stat.id });
      }
    } else if (type==='not') {
      table = this.stat_record.not.not_table;
      if (filter==='sourse') {
        this.stat_table = _.where(table, {source:stat.data });
      }  
    }
    let modalWidth  = Math.floor(document.body.offsetWidth*0.8);
    let x:number    = Math.floor(document.body.offsetWidth*0.1);
    let y:number    = Math.floor(document.body.offsetHeight*0.1);
    this.openModal('custom-modal-101', x , y , modalWidth);
  }

  editIndividual(person:StatisticTable) {
    this.closeModal('custom-modal-101');
    this.personService.editPerson(person.person_id,()=>{
      this.router.navigate(['/person']);
    })
  }

}

