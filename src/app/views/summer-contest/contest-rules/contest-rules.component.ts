import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contest-rules',
  templateUrl: './contest-rules.component.html',
  styleUrls: ['./contest-rules.component.scss']
})
export class ContestRulesComponent implements OnInit {

  constructor() { }

  showBases: boolean = false;

  ngOnInit() {
  }

  toggleBases(){
    this.showBases = !this.showBases;
  }

  testSun() {
    alert("This is a test Sun! Find the others to participate in the contest.");
  }


}
