import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import * as _ from "underscore";
import { Lead, Person, Product, Branches, ProductGroup, } from 'app/app.component';
import { Router } from '@angular/router';
import { ServerApiService } from 'app/servises/server-api.service';
import { PersonService } from 'app/servises/person.service';
import { ModalService } from 'app/components/modal/modal.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'person-cmp',
    moduleId: module.id,
    templateUrl: 'person.component.html',
    styleUrls: ['person.component.css'],
})
 
export class PersonComponent implements OnInit{
    personForm;
    submitted = false;
    ifTest = false;
    ifCV = false;
    test = 'testText';
    cv = 'cv;'
    product_groups:ProductGroup[] = [];
    products_all:Product[] = []; 
    products :Product[] = [];
    singleCourse:boolean = false;
    lead:Lead;
    leads:Lead[] = [];
    person:Person;
    persons:Person[] = [];
    person_id: number;
    nc:any;
    branches = Branches;

    constructor(
      private router: Router,
      private ServerApiService: ServerApiService,
      private modalService: ModalService,
      private PersonService: PersonService,
      private _snackBar: MatSnackBar,
       ) 
    {
      let str:string;
      str = sessionStorage.getItem("productgroup");
      this.product_groups = JSON.parse(str);
      str = sessionStorage.getItem("product");
      this.products_all = JSON.parse(str);
      this.products = JSON.parse(str);
      //
      this.leads = this.PersonService.getLeads();
      this.persons = this.PersonService.getPersons();
      this.person_id = this.PersonService.getPersonId();
      this.lead = _.findWhere(this.leads, {person_id: this.person_id});
      this.person = _.findWhere(this.persons, {person_id: this.person_id});
      
      this.nc= +this.person.no_call; 
      let dd = new Date(this.lead.entry_timestamp).toLocaleString();
      if (+this.lead.product_id===6) {this.singleCourse = true;}

      this.personForm = new FormGroup({
        person_id:        new FormControl(this.person.person_id),
        first_name:       new FormControl(this.person.first_name),
        last_name:        new FormControl(this.person.last_name),
        email:            new FormControl(this.person.email, Validators.email),
        phone_1:          new FormControl(this.person.phone_1),
        phone_2:          new FormControl(this.person.phone_2),
        address:          new FormControl(this.person.address),
        country_id:       new FormControl(this.person.country_id),
        no_call:          new FormControl(this.nc),
        lead_id:          new FormControl(this.lead.lead_id),
        entry_timestamp:  new FormControl(dd),
        source:           new FormControl(this.lead.source),
        source_details:   new FormControl(this.lead.source_details),
        product_group_id: new FormControl(this.lead.product_id,Validators.required),
        product_id:       new FormControl(this.lead.product_single_id,Validators.required),
        branch_id:        new FormControl(this.lead.branch_id,Validators.required),
      });
    }
    ngOnInit() {
      //cv
      if (this.lead.cv_text) {
        this.cv = this.lead.cv_text;
        this.ifCV = true;
      }
      let entryData2Server = { 
        entry_id: this.person.entry_id
      }
      //examination 
      let str = JSON.stringify(entryData2Server);
      this.ServerApiService.fetchIndividualByEntyID(str)
      .subscribe((data)=>{
        if (data == 0) { 
          console.log('Error entryID:', this.person.entry_id);
        } else if (data[0].testText) { 
          this.test = data[0].testText;
          this.ifTest = true;
        }
      }, (error) => {
        console.log(error);
      });
    }
    //FORM FIELDS
    // convenience getter for easy access to form fields
    get f() { return this.personForm.controls; }
    ChangingProductGroup(prod_group) {
      if (+prod_group.target.value===6) {
        this.singleCourse = true;
      } else {
        this.singleCourse = false;
      }
      this.products = _.where(this.products_all, {
        product_group_id: +prod_group.target.value
      });
    }
    ChangingValue(e) {}
    onSubmit(personData) {
      
      this.submitted = true;
      // stop here if form is invalid
      if (this.personForm.invalid) {
        return;
      }
      this.PersonService.updatePerson(personData,(r)=>{
        this._snackBar.open("Person data updated", "", {duration: 2000, panelClass:['alert-green'],});
      });
    }
    cancel() {
      this.backToPrewPage();
    }
    backToPrewPage() {
      let prevPage:string = sessionStorage.getItem('prev_page_user');
      this.router.navigate(['/'+prevPage]);
    }
    openModal(id: string, x:number,y:number,l:number) {
      this.modalService.open(id,x,y,l);
    } 
    closeModal(id: string) {
      this.modalService.close(id);
    }
}