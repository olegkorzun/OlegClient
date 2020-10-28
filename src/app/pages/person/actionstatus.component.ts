import { Component, OnInit, Input } from '@angular/core';
import { PersonService } from 'app/servises/person.service';

@Component({
  selector: 'action-status',
  templateUrl: 'actionstatus.component.html',
  styleUrls: ['person.component.css'],
})
export class ActionStatusComponent implements OnInit {

  @Input() status: string;
  constructor() {}
  ngOnInit() {}

}

