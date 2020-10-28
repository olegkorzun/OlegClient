import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Branches, Person, User, UsersData } from 'app/app.component';
import { Router } from '@angular/router';
import * as _ from "underscore";
import { PersonService } from 'app/servises/person.service';
import { IsLoggedService } from 'app/servises/is-logged.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { MsgService } from 'app/servises/msg.service';

@Component({
  selector: 'apointment-new-cmp',
  moduleId: module.id,
  templateUrl: 'apointment.component.html',
  styleUrls: ['actionnew.component.css'],
}) 
export class ApointmentComponent {
  individualForm:FormGroup;
  submitted = false;
  person:Person;
  persons:Person[] = [];
  currentUser:User;
  users:UsersData[]=[];
  startDate:any;
  branches = Branches;
  constructor(
    private personService: PersonService,
    private isLoggedService:IsLoggedService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.persons = this.personService.getPersons();
    let person_id:number = this.personService.getPersonId();
    this.person = _.findWhere(this.persons, {person_id: person_id});
    this.startDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.users = this.isLoggedService.getUsersData();
    this.currentUser = this.isLoggedService.getCurrentUser();
    this.individualForm = new FormGroup({
      message:   new FormControl("", Validators.required) ,
      user_id:   new FormControl(this.currentUser.user.rtuser),
      start_date:new FormControl(this.startDate),
      start_time:new FormControl('13:00'),
      location:  new FormControl("", Validators.required),
    });
  }
  //FORM FIELDS
  // convenience getter for easy access to form fields
  ChangingValue(e) {}
  get f() { return this.individualForm.controls; }
  onSubmit(actionData) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.individualForm.invalid) {
      return;
    }
    // Process checkout data here
    let action = {
      type:             "Appointment",
      amount:           0,
      message:          actionData.message,
      subject:          '',
      user_id:          actionData.user_id,
      create_user_id:   0,
      update_user_id:   0,
      status:           'new',
      create_date:      new Date(),
      start_date:       actionData.start_date,
      start_time:       actionData.start_time,
      due_date:         '',
      update_date:      '',
      priority:         'normal',
      location:         actionData.location,
      person_id:        this.person.person_id
    }
    this.personService.newAction(action, ()=>{
      this._snackBar.open("Task saved", "", {duration: 2000, panelClass:['alert-green'],});
      this.router.navigate(['/person']);
    })
  }
  cancel() {
    this.router.navigate(['/person']);
  }
}