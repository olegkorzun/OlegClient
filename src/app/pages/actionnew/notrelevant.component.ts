import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Person } from 'app/app.component';
import { Router } from '@angular/router';
import * as _ from "underscore";
import { PersonService } from 'app/servises/person.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'notrelevant-new-cmp',
  moduleId: module.id,
  templateUrl: 'notrelevant.component.html',
  styleUrls: ['actionnew.component.css'],
}) 
export class NotRelevantComponent {
  individualForm: FormGroup;
  submitted = false;
  person:Person;
  persons:Person[] = [];
  constructor(
    private personService: PersonService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    this.persons = this.personService.getPersons();
    let person_id:number = this.personService.getPersonId();
    this.person = _.findWhere(this.persons, {person_id: person_id});
    this.individualForm = new FormGroup({
      message : new FormControl("", Validators.required) ,
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
    let action = {
      type:             "NotRelevant",
      amount:           0,
      message:          actionData.message,
      subject:          '',
      user_id:          0,
      create_user_id:   0,
      update_user_id:   0,
      status:           'new',
      create_date:      new Date(),
      start_date:       '',
      start_time:       '',
      due_date:         '',
      update_date:      '',
      priority:         'normal',
      location:         100,
      person_id:        this.person.person_id
    }
    this.personService.newAction(action, ()=>{
      this._snackBar.open("Not relevant saved", "", {duration: 2000, panelClass:['alert-green'],});
      this.router.navigate(['/person']);
    })
  }  
  cancel() {
    this.router.navigate(['/person']);
  }
}