import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../servises/chat.service';
import { Ticket, ChatMessage } from 'app/app.component';

import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/throttleTime';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import * as _ from "underscore";


@Component({
  selector: 'app-message',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css'],
  providers: [
    ChatService,
  ]
})

export class TicketComponent  implements OnInit {
  tableVisible = false;
  messagesVisible = false;
  student_id = '';
  student_name = '';
  ticket_id = 0;
  message_text = '';
  displayedColumns = ['select','ticket_id', 'req_type', 'req_date', 'ans_type'];
  tickets:Ticket[]=[];
  messages:ChatMessage[]=[];
  dataSource = new MatTableDataSource<Ticket>(this.tickets);
  selection = new SelectionModel<Ticket>(true, []);
  badgeCounter:any[]=[];
  constructor(
    private chatService: ChatService,
  ) { 

    this.student_id = sessionStorage.getItem('student_id');
    this.student_name = sessionStorage.getItem('first_name')+' '+sessionStorage.getItem('last_name');
  }
  /* select a row  */
  clickRow(row) {
    _.findWhere(this.badgeCounter,{ticket: row.ticket_id}).counter = 0;
    this.showMessagesOnTicket(row);
    this.dataSource.data.forEach(row => this.selection.clear());
    this.selection.select(row);
  }
  cleanAll(event,row) {
    _.findWhere(this.badgeCounter,{ticket: row.ticket_id}).counter = 0;
    this.showMessagesOnTicket(row);
    this.dataSource.data.forEach(row => this.selection.clear());
    event.stopPropagation();
  }
  /* ask  messages history by ticket */
  showMessagesOnTicket(row) {
    if (row.ticket_id !== this.ticket_id) {
      //this.messagesVisible = false;
      this.messages = [];
      this.ticket_id = row.ticket_id;
      this.chatService.requestMessagesHistory(row.ticket_id);
    }
  }
  ngOnInit() {
    /* subscribe student tickets history */
    this.chatService.requestTicketHistory(this.student_id);
    this.chatService.getTicketHistory()
    .subscribe((tickets: Ticket[]) => {
       for (let i=0; i<tickets.length; i++) {
        let count = {
          ticket: tickets[i].ticket_id,
          counter: 0
        }
        this.badgeCounter.push(count);
        this.tickets.push(tickets[i]);
       }
       this.tableVisible = true;
    });
    /* subscribe student messages history by ticket*/
    this.chatService.getMessagesHistory()
    .subscribe((messages: ChatMessage[]) => {
       for (let i=0; i<messages.length; i++) {
        this.messages.push(messages[i]);
       }
       this.messagesVisible = true;
    });
    /* subscribe for new messages */
    this.chatService
    .getMessages()
    .filter((message: ChatMessage) => {
      return message.student == this.student_id
    })
   .subscribe((message: ChatMessage) => {
     if (message.ticket == this.ticket_id) {
      this.messages.unshift(message);
     } else {
      _.findWhere(this.badgeCounter,{ticket:message.ticket}).counter++
     }
     
   });
  }
  sendMessage() {
    let message = 
    {
      _id: null,
      mess: this.message_text,
      student: this.student_id,
      ticket: this.ticket_id,
      date: new Date(), 
      cat: 'student', 
      name: this.student_name,
      id: this.student_id,
      sock: null, 
    }
    this.chatService.sendMessage(message);
    this.message_text = '';
  }
}
