import {Injectable} from '@angular/core'
import { ServerApiService } from './server-api.service';
import { IsLoggedService } from './is-logged.service';

import { Person, Lead, Action, User } from 'app/app.component';
import * as _ from "underscore";

@Injectable({providedIn: 'root'})
export class PersonService {
  persons:Person[] = [];
  leads:Lead[] = [];
  lead:Lead;
  person:Person;
  actions:Action[] = [];
  action_id:number;
  person_id:number;
  userData:User;

  constructor(
    private ServerApiService: ServerApiService, 
    private isLoggedService: IsLoggedService,
  ) { 

    this.isLoggedService.userData.subscribe((userData:User) => {
      this.userData = userData;
    }); 
  }
  setActionId(action_id:number) {
    this.action_id = action_id;
  }
  getActionId() {
    return this.action_id;
  }

  setPersonId(person_id:number) {
    this.person_id = person_id;
  }
  getPersonId() {
    return this.person_id;
  }
  getPersons() {
    return this.persons;
  }
  getActions() {
    return this.actions;
  }
  getLeads() {
    return this.leads;
  }
  setPersons (callback) {
    let days = {days:50};
    let str = JSON.stringify(days);
    this.ServerApiService.fetchPersons(str)
    .subscribe((persons:Person[])=>{
      this.persons = persons;
      this.ServerApiService.fetchActions(str)
      .subscribe((actions:Action[])=>{
        this.actions = actions;
        this.ServerApiService.fetchLeads(str)
        .subscribe((leads:Lead[])=>{
          this.leads = leads;
          callback(1);
        }, (error) => {
          console.log(error);
          callback(0);
        });
      }, (error) => {
        console.log(error);
        callback(0);
      });
    }, (error) => {
      console.log(error);
      callback(0);
    });  
  }

  editPerson(person_id,callback) {
    //
    let person:Person     = _.findWhere(this.persons, {person_id: person_id});
    if (person) {
      this.person_id = person_id;
      callback(true);
    } else {
      let personData2Server = { person_id: person_id }
      let str = JSON.stringify(personData2Server);
      this.ServerApiService.fetchActionsByPersonID(str)
      .subscribe((actions:Action[])=>{
        this.ServerApiService.fetchLeadByPersonID(str)
        .subscribe((leads:Lead[])=>{ 
          this.ServerApiService.fetchPersonByPersonID(str)
          .subscribe((persons:Person[])=>{ 
            this.persons.push(persons[0]);
            this.leads.push(leads[0]);
            for ( let i=0; i<actions.length; i++) {
              this.actions.push(actions[i]);
            }
            this.person_id = person_id;
            callback(true);
          }, (error) => {console.log(error);}
          );
        }, (error) => {console.log(error);}
        );
      }, (error) => {console.log(error);}
      );
    }
  }

  updatePerson(personData, callback) {

    this.lead = _.findWhere(this.leads, {person_id: this.person_id});
    this.person = _.findWhere(this.persons, {person_id: this.person_id});
    // Process checkout data here
    let personData2Server = {
            person: {
            person_id:        this.person.person_id,
            first_name:       personData.first_name,
            last_name:        personData.last_name,
            email:            personData.email,
            phone_1:          personData.phone_1,
            phone_2:          personData.phone_2,
            address:          personData.address,
            country_id:       personData.country_id,
            no_call:          personData.no_call,
            }
          }

          let leadData2Server = {
            lead:{
            lead_id:            this.lead.lead_id,
            entry_timestamp:    this.lead.entry_timestamp,
            source:             this.lead.source,
            source_details:     personData.source_details,
            product_id:         personData.product_group_id,
            product_single_id:  personData.product_id,
            branch_id:          personData.branch_id,
            }
        }
        let strData = JSON.stringify(personData2Server);
        this.ServerApiService.fetchPersonUpdate(strData)
        .subscribe((data:number)=>{
          
          this.person.first_name  = personData.first_name;
          this.person.last_name   = personData.last_name;
          this.person.email       = personData.email;
          this.person.phone_1     = personData.phone_1;
          this.person.phone_2     = personData.phone_2;
          this.person.address     = personData.address;
          this.person.country_id  = personData.country_id;
          this.person.no_call     = personData.no_call;
          // call leads
          let strData = JSON.stringify(leadData2Server);
          this.ServerApiService.fetchLeadUpdate(strData)
          .subscribe((data:number)=>{
            this.lead.source_details =   personData.source_details;
            this.lead.product_id =       personData.product_group_id;
            this.lead.product_single_id= personData.product_id;
            this.lead.branch_id =        personData.branch_id;
            callback()
            //this.backToPrewPage();
          }, (error) => { console.log(error) });
        }, (error) => { console.log(error) });
  }

  updateAction(action,  callback) {
    let actionData2Server = {
      action: {
        action_id:      action.action_id,
        b_task_id:      action.b_task_id,
        b_client_id:    action.b_client_id,
        type:           action.type,
        amount:         action.amount,
        message:        action.message,
        subject:        action.subject,
        user_id:        action.user_id,
        create_user_id: action.create_user_id,
        update_user_id: this.userData.user.rtuser,
        status:         action.status,
        create_date:    new Date(),
        start_date:     action.start_date,
        due_date:       action.due_date,
        update_date:    new Date(),
        priority:       action.priority,
        location:       action.location,
        person_id:      action.person_id
      }
    }
    let strData = JSON.stringify(actionData2Server);
    this.ServerApiService.fetchActionUpdate(strData)
    .subscribe((data:number)=>{
      callback();
    }, (error) => { console.log(error) });
  }

  newAction (actionData, callback) {
    // Process checkout data here
    let actionData2Server = {
      action: {
        action_id:        null,
        b_task_id:        0,
        b_client_id:      0,
        type:             actionData.type,
        amount:           actionData.amount,
        message:          actionData.message,
        subject:          actionData.subject,
        user_id:          actionData.user_id,
        create_user_id:   +this.userData.user.rtuser,
        update_user_id:   0,
        status:           actionData.status,
        create_date:      new Date(),
        start_date:       new Date(actionData.start_date + ' ' + actionData.start_time ),
        due_date:         null,
        update_date:      null,
        priority:         actionData.priority,
        location:         actionData.location,
        person_id:        actionData.person_id
      }
    } 
    let strData = JSON.stringify(actionData2Server);
    this.ServerApiService.fetchNewAction(strData)
    .subscribe((data)=>{
      // push to array
      actionData2Server.action.action_id = data[0];
      this.actions.unshift(actionData2Server.action);
      callback();
    }, (error) => { console.log(error) });
  }
}
