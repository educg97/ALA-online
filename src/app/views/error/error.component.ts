import { Component, OnInit } from '@angular/core';
import { Google } from 'src/app/utils/google';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  constructor(
    public google: Google,
    public data: DataService
  ) { }

  ngOnInit() {
    this.google.notFound();
    this.sendURLError();
  }

  sendURLError(){
    const url = window.location.href;
    this.data.newNotFoundError(url).subscribe(res => {
      console.log(res);
    });
  }

}
