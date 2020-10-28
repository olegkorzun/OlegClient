import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'action-type',
  templateUrl: 'actiontype.component.html',
  styleUrls: ['person.component.css'],
})
export class ActionTypeComponent implements OnInit {
  @Input() actionType: string;
  constructor() { }
  ngOnInit() {}
}