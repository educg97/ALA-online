import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-not-found-list',
  templateUrl: './not-found-list.component.html',
  styleUrls: ['./not-found-list.component.scss']
})
export class NotFoundListComponent implements OnInit {

  constructor(
    public data: DataService
  ) { }

  errorList: Object[] = [];

  ngOnInit() {
    this.data.getErrors().subscribe(res => {
      [].forEach.call(res, err => {
        const time = new Date(err['createdAt']).toLocaleTimeString();
        const day = new Date(err['createdAt']).toLocaleDateString();
        const error = {
          date: `${day} - ${time}`,
          url: err['url']
        }
        this.errorList.push(error);
      });
    });
  }

}
