import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from "underscore";
import { ActionType, Lead, Person } from 'app/app.component';
import { PersonService } from 'app/servises/person.service';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
    selector: 'action-create-cmp',
    moduleId: module.id,
    templateUrl: 'actioncreate.component.html',
    styleUrls: ['person.component.css'],
    //encapsulation: ViewEncapsulation.None,
}) 
 
export class ActionCreateComponent {
  actionsForm;
  actions:String[] = ActionType;
  submitted = false;
  lead:Lead;
  leads:Lead[] = [];
  person:Person;
  persons:Person[] = [];
  constructor(
    private router: Router,
    private PersonService: PersonService,
    private _snackBar: MatSnackBar,
    ) 
  { }
 
  openAction(action) {
    switch (action) {
      case 'apointment':
        this.router.navigate(['/apointment']);
        break;
      case 'task':
        this.router.navigate(['/task']);
        break;
      case 'sms':
        this.router.navigate(['/message']);
        break;
      case 'email':
        this.router.navigate(['/message']);
        break;
      case 'notrelevant':
        this.router.navigate(['/notrelevant']);
        break;
      case 'contractnnew':
        let person_id:number = this.PersonService.getPersonId();
        this.leads = this.PersonService.getLeads();
        this.lead = _.findWhere(this.leads, {person_id: person_id});        
        this.persons = this.PersonService.getPersons();
        this.person = _.findWhere(this.persons, {person_id: person_id});
        if (this.lead.product_id>0 && this.person.country_id !== '') {
          this.router.navigate(['/contractnnew']);
        } else {
          this._snackBar.open("Have to fill product & local Id", "", {duration: 2000, panelClass:['alert-red'],});
        }
        break;
    }
  }


}