import { Component, OnInit, OnChanges } from '@angular/core';
import { Action, Branches, Product, Lead, Person, Con, PathStatus, SERV, PORT, UsersData, User } from 'app/app.component';
import { ServerApiService } from 'app/servises/server-api.service';
import { Router } from '@angular/router';
import * as _ from "underscore";
import { FormArray, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalService } from 'app/components/modal/modal.service';
import { PersonService } from 'app/servises/person.service';
import { IsLoggedService } from 'app/servises/is-logged.service';
import { LeadStatusService } from 'app/servises/leadstatus.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'contract-new-cmp',
  moduleId: module.id,
  templateUrl: 'contractnew.component.html',
  styleUrls: ['actionnew.component.css'],
  providers: [ServerApiService]
}) 

export class ContractNewComponent implements OnInit, OnChanges{
  courses :Product[]=[];
  contract_courses :Product[]=[];
  single_courses :Product[]=[];
  create_date: Date = new Date();
  submitted = false;
  action:Action;
  actions:Action[]=[];
  lead:Lead;
  leads:Lead[] = [];
  person:Person;
  persons:Person[] = [];
  //lastEntrie: LastEntries;
  branches = Branches;
  pathStatus = PathStatus;
  rtuser:number;
  action_user:string = '';
  ActionError:String = '';
  ActionErrorText:String = '';
  con: Con;
  contract: Con[] =[];
  contract_product ='';
  amount = 0;
  start_date = '';
  urlSafe = '';
  contractFormGroup:FormGroup;
  coursesFormGroup:FormGroup;
  paymentsFormGroup:FormGroup;

  
  constructor(
    public sanitizer: DomSanitizer, 
    private modalService: ModalService,
    private ServerApiService: ServerApiService,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private router: Router,
    private personService:PersonService,
    private isLoggedService:IsLoggedService,
    private LeadStatusService: LeadStatusService,

  ) {
    this.actions = this.personService.getActions();
    this.persons = this.personService.getPersons();
    this.leads = this.personService.getLeads();
    let person_id:number = this.personService.getPersonId();
    this.person = _.findWhere(this.persons, {person_id: person_id});
    this.lead = _.findWhere(this.leads, {person_id: person_id});
    this.isLoggedService.userData.subscribe((userData:User) => {
      this.rtuser = +userData.user.rtuser;
      this.action_user = userData.user.first_name+' '+userData.user.last_name;
    }); 
    this.start_date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    //PRODUCT
    let str = sessionStorage.getItem("product");
    this.courses = JSON.parse(str);
    this.contract_courses = _.where(this.courses,{product_group_id: +this.lead.product_id});
    this.amount = this.contract_courses[0].product_group_amount;
    this.contract_product = this.contract_courses[0].product_group_description;
    this.single_courses= _.where(this.courses,{product_group_id: 6 });
    // 3 Form Groups
    this.contractFormGroup = new FormGroup({
      start_date: new FormControl(this.start_date, Validators.required),
      amount: new FormControl(this.amount, Validators.required),
      pathStatus: new FormControl(this.pathStatus[1].code, Validators.required),
      //contract: new FormControl(''),
    });
    this.coursesFormGroup = new FormGroup({
      coursesList: new FormArray([]),
      singleCoursesList: new FormArray([]),
    });
    this.paymentsFormGroup = new FormGroup({
      payment_cash: new FormControl(false),
      payment_cash_date: new FormControl(this.start_date),
      payment_cash_amount: new FormControl(0),
      payment_bank: new FormControl(false),
      payment_bank_date: new FormControl(this.start_date),
      payment_bank_amount: new FormControl(0),
      payment_card: new FormControl(false),
      payment_card_num: new FormControl(0),
      payment_card_amount: new FormControl(0),
      payment_card_card: new FormControl(''),
      payment_check: new FormControl(false),
      payment_check_num: new FormControl(0),
      payments_check: new FormArray([]),
    });
  }
  // convenience getters for easy access to form fields
  //ChangingValue(e) {}
  get coursesList1() { 
    return this.coursesFormGroup.get('coursesList') as FormArray;
  }
  get singleCoursesList1() { 
    return this.coursesFormGroup.get('singleCoursesList') as FormArray;
  }
  get payments_check1() { 
    return this.paymentsFormGroup.get('payments_check') as FormArray;
  }

  ngOnInit() {
    for (let i = 0; i < this.contract_courses.length; i++) {
      this.coursesList1.push(new FormGroup({
        checkCourse: new FormControl(true),
        amountCourse: new FormControl(this.contract_courses[i].price),
        //n: new FormControl(this.contract_courses[i].product_id),
      }));
    }
    for (let i = 0; i < this.single_courses.length; i++) {
      this.singleCoursesList1.push(new FormGroup({
        checkSingleCourse: new FormControl(false),
        amountSingleCourse: new FormControl(this.single_courses[i].price),
        //n: new FormControl(this.single_courses[i].product_id),
      }));
    }
  }

  onChangeCheks(e) {
    const numberOfChecks = e.target.value || 0;
    if (this.payments_check1.length < numberOfChecks) {
        for (let i = this.payments_check1.length; i < numberOfChecks; i++) {
            this.payments_check1.push(new FormGroup({
              bank: new FormControl(''),
              branch: new FormControl(''),
              accaunt: new FormControl(''),
              checkNumber: new FormControl(''),
              checkDate: new FormControl(this.start_date),
              checkAmount: new FormControl(''),
            }));
        }
    } else {
        for (let i = this.payments_check1.length; i >= numberOfChecks; i--) {
            this.payments_check1.removeAt(i);
        }
    }
}

  // First Button
  // send contrct to rendering
  renderContract(f: NgForm) {
    this.createObject(f);
    let contractData2Server = {
      contract: {
        contract_id:      null,
        create_date:      this.create_date,
        start_date:       new Date(f.value.start_date), /// start course
        first_name:       this.person.first_name,
        last_name:        this.person.last_name,
        phone_1:          this.person.phone_1,
        email:            this.person.email,
        address:          this.person.address,
        country_id:       this.person.country_id,
        branch_id:        this.lead.branch_id,
        user:             this.action_user,
        amount:           f.value.amount,
      },
      courses:  this.contract 
    }
    let strData = JSON.stringify(contractData2Server);
    this.ServerApiService.fetchNewContract(strData)
    .subscribe((data)=>{
      this._snackBar.open("Contract Created", "", {duration: 2000, panelClass:['alert-green'],});
      let previewUrl = 'http://'+SERV+':'+PORT+'/files/'+
      this.person.country_id+'/contr_'+this.person.country_id+'.docx';
      console.log(previewUrl)
      this.urlSafe= previewUrl;
      let modalWidth  = Math.floor(document.body.offsetWidth*0.8);
      let x:number    = Math.floor(document.body.offsetWidth*0.1);
      let y:number    = Math.floor(document.body.offsetHeight*0.1);
      this.openModal('custom-modal-7', x , y , modalWidth);
    }, (error) => { console.log(error)});
  }
  // CREATE STUDENT
  saveAction(f: NgForm) {
    this.createObject(f);
    this.submitted = true;
    let actionData = {
        action_id:        null,
        b_task_id:        0,
        b_client_id:      0,
        type:             'Proposal',
        amount:           f.value.amount,
        message:          this.contract_product+' '+ f.value.amount + ' ' + f.value.start_date,
        subject:          'contract',
        user_id:          this.rtuser,
        create_user_id:   this.rtuser,
        update_user_id:   0,
        status:           'new',
        create_date:      this.create_date,
        start_date:       new Date(f.value.start_date), /// start course
        due_date:         null,
        update_date:      null,
        priority:         'normal',
        location:         ''+this.lead.branch_id,
        person_id:        this.person.person_id,
      }

    let studentData2Server = {
      user: {
        studentID:        this.person.country_id, 
        firstName:        this.person.first_name, 
        familyName:       this.person.last_name, 
        address:          this.person.address, 
        email:            this.person.email, 
        mobileNumber:     this.person.phone_1,
        idImage:          null, 
        status:           5 , //CRM
        secondMobileNumber: this.person.phone_2, 
        registeryDate:    this.create_date,
        password:         this.person.country_id, 
        username:         this.person.email, 
        role:             1, //student
        theme:            1, //default
        paymentMethodsCode: null,
        location:         this.lead.branch_id-100,
        amount:           f.value.amount,
      },
      courses:  this.contract ,
      path: {
        StudentID: null,
        pathCode: this.lead.product_id ,
        pathstatus: '1',
        freezpath: '0',
        freezDate: null,
      }
    }
    let strData = JSON.stringify(studentData2Server);
    this.ServerApiService.fetchNewStudent(strData)
    .subscribe((data)=>{
      this.personService.newAction(actionData,()=>{
        this.LeadStatusService.changeLidStatus(this.person.person_id,'Student',()=>{
          this._snackBar.open("Student Created", "", {duration: 2000, panelClass:['alert-green'],});
          //this.router.navigate(['/person']);
         });
      });
    }, (error) => { console.log(error)});
  }

  cancel() {
    this.router.navigate(['/person']);
  }

  createObject(f: NgForm) {
    this.contract = [];
    for (const key of Object.keys(f.value)) {
      if (key[0]=='c' || key[0]=='d') {
        if (f.value[key]) {
          //console.log(key,":",f.value[key]);
          let c = key.substring(1,key.length);
          this.con = {
            product_id:+c,
            description: _.findWhere(this.courses,{product_id: +c}).description,
            amount:0
          }
          this.contract.push(this.con);
        }
      }
      if (key[0]=='p' || key[0]=='v') {
        let c = key.substring(1,key.length);
        let con:Con = _.findWhere(this.contract,{ product_id: +c });
        if (con) {
          con.amount = + f.value[key];
        }
      }
    }
  }
 
  ngOnChanges() { }
  // modal window
  openModal(id: string, x:number,y:number,l:number) {
    this.modalService.open(id,x,y,l);
  } 
  closeModal(id: string) {
    this.modalService.close(id);
  }
}