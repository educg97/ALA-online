import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { DrawComponent } from 'src/app/utils/draws';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  constructor(public data: DataService, public draws: DrawComponent) { }

  showStar: boolean;

  ngOnInit() {
      this.draws.getNumberCounter(this.draws.low_probability);
      this.showStar = this.draws.showStar;
  }
}
