import { Component, OnInit } from '@angular/core';
import { Student, ChatMessage } from 'app/app.component';
import { ChatService } from '../../servises/chat.service';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/throttleTime';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  providers: [
    ChatService,
  ]
})
export class MessageComponent implements OnInit {
  message_text: string;
  messages: ChatMessage[] = [];
  secretCode: string;
  endConversationCode: string;
  students:Student[]=[];
  student:Student;
  
  constructor(
    private chatService: ChatService,
  ) { 
    this.secretCode = 'student';
    this.endConversationCode = 'BYE BYE';

  }
  sendMessage() {
    let message = 
    {
      _id: null,
      mess: this.message_text,
      req: 'question',
      ticket: null,
      date: new Date(), 
      cat: 'student', 
      name: sessionStorage.getItem('first_name')+' '+sessionStorage.getItem('last_name'),
      id: sessionStorage.getItem('student_id'),
      sock: null, 
    }
    this.chatService.sendMessage(message);
    this.message_text = '';
  }

  ngOnInit() {
    this.chatService.requestHistory(null);

    this.chatService.getHistory()
    .subscribe((messages: ChatMessage[]) => {
       for (let i=0; i<messages.length; i++) {
        console.log(messages[i]);
        this.messages.push(messages[i]);
       }
       
     });
    
    this.chatService
    .getMessages()
    //.distinctUntilChanged()
    //.filter((message) => message.trim().length > 0)
    //.throttleTime(1000)
    //.takeWhile((message) => message !== this.endConversationCode) 
    //.skipWhile((message) => message !== this.secretCode)
    //.scan((acc: string, message: string, index: number) =>
    //   `${message}(${index + 1})`
    // , 1)
   .subscribe((message: ChatMessage) => {
    console.log(message);
     //const currentTime = moment().format('hh:mm:ss a');
     //const messageWithTimestamp = `${currentTime}: ${message}`;
     this.messages.unshift(message);
   });

  }

}
