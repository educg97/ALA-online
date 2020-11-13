import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-switch-toggle',
  templateUrl: './switch-toggle.component.html',
  styleUrls: ['./switch-toggle.component.scss']
})
export class SwitchToggleComponent implements OnInit {

  @Output() toggle = new EventEmitter();
  @Input() left: string;
  @Input() right: string;

  constructor() { }

  isLeft: boolean = false;

  ngOnInit() {
  }

  toggleSwitch(){
    this.isLeft = !this.isLeft;
    this.toggle.emit(this.isLeft);
  }

}
 