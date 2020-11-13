import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { WindowSizeComponent } from '../window-size';
import { ScrollComponent } from '../scroll';

@Component({
  selector: 'app-curiosities',
  templateUrl: './curiosities.component.html',
  styleUrls: ['./curiosities.component.scss']
})
export class CuriositiesComponent implements OnInit {

  constructor(
    public data: DataService,
    public windowSize: WindowSizeComponent,
    public scroll: ScrollComponent
  ) { }

  funFacts: any;
  funFactPosition: number = 0;
  dotsFacts: any;

  ngOnInit() {
    this.data.getFunFacts().subscribe(data => {
      console.log(data);
      this.funFacts = data;
    });

    this.setScrollListener('#curiosities-container');
  }

  ngAfterViewInit(){
    this.dotsFacts = this.scroll.dotsGenerator('curiosities-container');
    console.log(this.dotsFacts);
  }

  scrollComponent(parentId: string, position: number) {
    if(parentId === 'curiosities-container'){
      this.funFactPosition = position;
    }
    const parent = document.getElementById(parentId);
    parent.scrollLeft = position*this.windowSize.windowSize;
  }

  setScrollListener(selector: string) {
		let container = document.querySelector(selector) as HTMLElement;
		let elements = document.querySelectorAll(selector + ' > :not(.spacer)');
		let tolerance = 0.01;

		this.scroll.onScrollEnd(container).subscribe((scroll: number) => {
			[].forEach.call(elements, (element, index) => {
				let leftMargin = (element.offsetParent.offsetWidth - element.offsetWidth) / 2;
				if (Math.abs(1 - (scroll / (element.offsetLeft - leftMargin))) <= tolerance) {
          if(selector === '#curiosities-container'){
            this.funFactPosition = Math.round(index);
          }
          // this.companiesPosition = Math.round(index);
				} else if (scroll == 0) {
          if(selector === '#curiosities-container'){
            this.funFactPosition = 0;
          } 
					return 1;
				}
			})
		})
  }
}
