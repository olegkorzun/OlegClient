import { Component } from '@angular/core';
import * as _ from "underscore";
import { Router } from '@angular/router';
import { PersonService } from 'app/servises/person.service';
import { ModalService } from 'app/components/modal/modal.service';
import { IsLoggedService } from 'app/servises/is-logged.service';
import { LeadStatusService } from 'app/servises/leadstatus.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Action, LastEntries, UsersData } from 'app/app.component';

@Component({
    selector: 'actions-cmp',
    moduleId: module.id,
    templateUrl: 'actions.component.html',
    styleUrls: ['person.component.css'],
}) 
export class ActionsComponent {
    lastEntrie: LastEntries;
    action:Action[] = [];
    actions:Action[] = [];
    act:Action;
    person_id:number;
    action_id:number;

    constructor(
        private router: Router,
        private personService: PersonService,
        private modalService: ModalService,
        private isLoggedService: IsLoggedService,
        private LeadStatusService: LeadStatusService,
        private _snackBar: MatSnackBar,
      ) {
        
        this.person_id = this.personService.getPersonId();
        this.actions = this.personService.getActions();
        this.action = _.where(this.actions, {person_id: this.person_id});
        this.action.sort(function (a, b) {
          if (a.create_date > b.create_date) { return -1; }
          if (a.create_date < b.create_date) { return 1; }
          return 0;
        }); 
        let users:UsersData[] = this.isLoggedService.getUsersData();
        let user:UsersData;
        for (let i=0; i<this.action.length; i++) {
          user = _.findWhere(users, {rtuser: ''+this.action[i].user_id});
          if (user != null) {
            this.action[i].subject = user.first_name+' '+user.last_name;
          } else {
            this.action[i].subject = ''+this.action[i].create_user_id;
          }
        }
      }
    //TABLE OF ACTIONS
    updateActtion(act:Action) {
      if (act.type ==='Appointment' || act.type ==='Task') {
        this.personService.setActionId(act.action_id);
        this.router.navigate(['/action']);
      }
    }
    chooseActionStatus(info,act_id) {
      this.action_id = act_id;
      let modalWidth = 150;
      let modalHeight = 180;
      let x:number = info.clientX-info.toElement.offsetWidth-15;
      let y:number = info.clientY-info.toElement.offsetHeight-15;
      if (y+modalHeight > document.body.offsetHeight) y = document.body.offsetHeight - modalHeight//y - modalHeight - 10;
      if (y<=0) y=10;
      this.openModal('custom-modal-151', x , y , modalWidth);
    }
    updateActionStaus(status) {
      this.act = _.findWhere(this.actions, {action_id: this.action_id});
      this.act.status = status;
      // Change Lead Status if Appointment
      if (this.act.type === "Appointment") {
        let lead_status:string;
        if (status === 'new'){lead_status = "New"} 
        else if (status === 'canceled') {lead_status = "New"} 
        else if (status === 'completed') {lead_status = "Meeting";}
        this.LeadStatusService.changeLidStatus(this.act.person_id,lead_status,(result)=>{ })
      }
      // Update action status if 
      this.personService.updateAction(this.act ,()=>{
        this._snackBar.open("Status updated", "", {duration: 2000, panelClass:['alert-green'],});
        this.closeModal('custom-modal-151');
      });
    }
    openModal(id: string, x:number,y:number,l:number) {
      this.modalService.open(id,x,y,l);
    } 
    closeModal(id: string) {
      this.modalService.close(id);
    }
}