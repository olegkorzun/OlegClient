import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Action, ActionStatus,  UsersData, Branches, Person,} from 'app/app.component';
import { Router } from '@angular/router';
import { ServerApiService } from 'app/servises/server-api.service';
import * as _ from "underscore";
import { DatePipe } from '@angular/common';
import { PersonService } from 'app/servises/person.service';
import { IsLoggedService } from 'app/servises/is-logged.service';
import { LeadStatusService } from 'app/servises/leadstatus.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'action-cmp',
  moduleId: module.id,
  templateUrl: 'action.component.html',
  styleUrls: ['action.component.css'],
  providers: [ServerApiService]
})
export class ActionComponent {
  individualForm;
  submitted = false;
  action:Action;
  actions:Action[]=[];
  new_action_type: String ='';
  person:Person;
  persons:Person[] = [];
  branches = Branches;
  nc:any;
  statuses = ActionStatus;
  user:UsersData;
  users:UsersData[]=[];
  rtuser:number;
  action_input:Action;
  action_user:string = '';
  action_create_user:string = '';
  action_update_user:string = '';
  startDate:any;
  startTime:any;
  update_date:Date;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private isLoggedService: IsLoggedService,
    private personService: PersonService,  
    private LeadStatusService: LeadStatusService,
  ) {
    let action_id:number = this.personService.getActionId();
    this.actions = this.personService.getActions();
    this.action = _.findWhere(this.actions, {action_id: action_id});
    this.persons = this.personService.getPersons();
    this.person = _.findWhere(this.persons, {person_id: this.action.person_id});
    this.nc= +this.person.no_call;
    this.users = this.isLoggedService.getUsersData();
    this.user = _.findWhere(this.users, {rtuser: this.action.create_user_id});
    if (this.user != null) this.action_user = this.user.first_name+' '+this.user.last_name;  
    let date1:Date = new Date(this.action.start_date);
    this.startDate = this.datePipe.transform(date1, 'yyyy-MM-dd');
    this.startTime = this.datePipe.transform(date1, 'HH:mm');
    this.update_date = new Date();
    this.individualForm = this.formBuilder.group({
      no_call:          this.nc,
      message:          this.action.message,
      user_id:          this.action.user_id,
      status:           this.action.status,
      start_date:       this.startDate,
      start_time:       this.startTime,
      update_date:      this.update_date,
      priority:         this.action.priority,
      location:         this.action.location,
    });
  }
  //FORM FIELDS
  // convenience getter for easy access to form fields
  get f() { return this.individualForm.controls; }
  ChangingValue(e) {}
  
  onSubmit(actionData) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.individualForm.invalid) { return; }
    // Process checkout data here
    //Update Lead status 
    if (this.action.type === "Appointment") {
      if (this.action.status !== actionData.status) {
        let lead_status:string;
        if (actionData.status === 'new'){lead_status = "New"} 
        else if (actionData.status === 'canceled') {lead_status = "New"} 
        else if (actionData.status === 'completed') {lead_status = "Meeting";}
        this.LeadStatusService.changeLidStatus(this.action.person_id,lead_status,(result)=>{ })
      }
    }
    //Update Action
    this.action.message = actionData.message;
    this.action.user_id = actionData.user_id;
    this.action.status = actionData.status,
    this.action.start_date = new Date(actionData.start_date + ' ' + actionData.start_time ),
    this.action.due_date = new Date(actionData.start_date + ' ' + actionData.start_time ),
    this.personService.updateAction(this.action, ()=>{
      this._snackBar.open("Contract Created", "", {duration: 2000, panelClass:['alert-green'],});
      this.router.navigate(['/person']);
    })
  }

  cancel() {
    this.router.navigate(['/person']);
  }
}