import {Injectable} from '@angular/core'
import { ServerApiService } from './server-api.service';
import { IsLoggedService } from './is-logged.service';
import { hebWeekday } from 'app/servises/cal.service';
import { Person, Lead, Branches, UsersData } from 'app/app.component';
import * as _ from "underscore";


@Injectable({providedIn: 'root'})
export class MsgService { 

    branches = Branches;
    users:UsersData[]=[];
    
    constructor(
        private ServerApiService: ServerApiService,
        private isLoggedService:IsLoggedService,
      ) {
        this.users = this.isLoggedService.getUsersData();
      }

    appointmentMessages(person:Person,lead:Lead,action,callback) {
        let meet_addr = _.findWhere(this.branches, {branch_id: +action.location}).addr;
    
        let mail_message = '<p dir="rtl">שלום ' + person.first_name + '</p>'+
        '<p dir="rtl">תואמה עבורך פגישה ביום ' + hebWeekday(action.start_date) 
        +' תאריך ' + action.start_date + ' בשעה ' + action.start_time + '</p>'+
        '<p dir="rtl">כתובתנו: '+ meet_addr +'</p>'+
        '<p dir="rtl">Real Time College חטיבת ההדרכה של RT Group</p>'+
        '<p dir="rtl">טלפון: 077-7067057</p>'+
        '<p dir="rtl">אמייל: info@rt-ed.co.il</p>';
    
        let recipient =  _.findWhere(this.users, {rtuser: action.user_id});
    
        let mail_message_manager = '<p dir="rtl">שלום ' + recipient.first_name + '</p>'+
        '<p dir="rtl">תואמה עבורך פגישה '+person.first_name+' ' +person.last_name+' ביום '
         + hebWeekday(action.start_date) +' תאריך ' + action.start_date + ' בשעה ' + action.start_time + '</p>'+
        '<p dir="rtl">כתובתנו: '+ meet_addr +'</p>'+
        '<p dir="rtl">Real Time College חטיבת ההדרכה של RT Group</p>'+
        '<p dir="rtl">טלפון: 077-7067057</p>'+
        '<p dir="rtl">אמייל: info@rt-ed.co.il</p>';
    
        let mailData2Server = {
          mail: { 
            first_name:     person.first_name,
            last_name:      person.last_name,
            email:          person.email,
            no_call:        person.no_call,
            entry_timestamp: new Date(),
            product_id:     lead.product_id,
            branch_id:      lead.branch_id,
            message:        mail_message,
            subject:        'תואמה עבורך פגישה',
            user_id:        action.create_user_id,
          }
        }
        let mailData2Manager = {
        mail: { 
          first_name: recipient.first_name,
          last_name: recipient.last_name,
          email: recipient.email,
          no_call: 0,
          entry_timestamp: new Date(),
          product_id: lead.product_id,
          branch_id: lead.branch_id,
          message: mail_message_manager,
          subject: 'תואמה עבורך פגישה',
          user_id: action.create_user_id,
        }
      }
      console.log(action.start_date);
      let sms_message = 
        ' שלום ' + person.first_name +
        ' תואמה עבורך פגישה ביום ' + hebWeekday(action.start_date) +' תאריך ' 
        + action.start_date + ' בשעה ' + action.start_time + 
        ' כתובתנו: '+ meet_addr +
        ' Real Time College חטיבת ההדרכה של RT Group '+
        'טלפון: 077-7067057 '+
        ' אמייל: info@rt-ed.co.il ';
      
        let smsData2Server = {
          sms: { 
            first_name:     person.first_name,
            last_name:      person.last_name,
            phone_1:        person.phone_1,
            no_call:        person.no_call,
            entry_timestamp: new Date(),
            product_id:     lead.product_id,
            branch_id:      lead.branch_id,
            message:        sms_message,
            subject:        'Meeteng',
            user_id:        action.create_user_id,
          }
        }
    
        let str = JSON.stringify(mailData2Manager);
        this.ServerApiService.fetchMailText(str)
        .subscribe((res)=>{
            if (person.no_call == 0 && action.type === 'Appointment') {
                str = JSON.stringify(mailData2Server);
                this.ServerApiService.fetchMailText(str)
                .subscribe((res)=>{
                    str = JSON.stringify(smsData2Server);
                    this.ServerApiService.fetchSMSText(str)
                    .subscribe((res)=>{
                        callback();
                    });
                });
            }
        });
    }

}