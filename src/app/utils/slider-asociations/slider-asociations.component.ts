import { Component, OnInit } from '@angular/core';
import { WindowSizeComponent } from '../window-size';
import { ScrollComponent } from '../scroll';
import {
	trigger,
	state,
	style,
	animate,
	transition,
} from '@angular/animations';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-slider-asociations',
  templateUrl: './slider-asociations.component.html',
  styleUrls: ['./slider-asociations.component.scss'],
  animations: [
		trigger('arrowLeft', [
			transition(':enter', [
        style({ left: '-20px' }),
				animate('300ms ease-in-out', style({ left: '20px' }))
			]),
			transition(':leave', [
				animate('300ms ease-in-out', style({ left: '-20px' }))
      ])
    ]),
    trigger('arrowRight', [
			transition(':enter', [
        style({ right: '-20px' }),
				animate('300ms ease-in-out', style({ right: '20px' }))
			]),
			transition(':leave', [
				animate('300ms ease-in-out', style({ right: '-20px' }))
      ])
		])
	]
})
export class SliderAsociationsComponent implements OnInit {

  constructor(
    public windowSize: WindowSizeComponent,
    public scroll: ScrollComponent,
    public data: DataService
  ) { }

  asociationsPosition: number = 0;
  rangeValueAsociations: number = 0;
  rawAsociations: any[] = [];
  asociations: any[] = [];

  ngOnInit() {
    this.handleScroll();
    this.setScrollListener('.slider-asociations-opinions');

    this.data.getAsociations().subscribe(res => {
      let asociations = [].map.call(res, asociation => {
        asociation['imageUrl'] = 'https://api.americanlanguage.es' + asociation['Logo']['url'];
        asociation['testimonial'] = this.data.getMarkdown(this.data.format(asociation['Testimonial']));
        asociation['slug'] = this.data.string_to_slug(asociation['Nombre']);

        return asociation;
      });

      asociations = asociations.filter(uni => uni['Mostrar Nueva Web']);
      this.rawAsociations = asociations;
      this.asociations = asociations;
      
      // for(let i = 0; i <= 5; i += 2) { // This 5 has to be dynamic
      //   let uniCopy = asociations;
      //   let column = [];
      //   column.push(uniCopy.splice(0, 2));
      //   this.asociations.push(column);
      // }
      console.log("asociationss", this.asociations);
    });
  }

  handleScroll(){
    const sliderCompanies = document.getElementById('slider-asociations-single');
    sliderCompanies.addEventListener('scroll',  () => {
			const j = Math.round(sliderCompanies.scrollLeft/this.windowSize.windowSize);
		});
  }

  setScrollListener(selector: string) {
		let container = document.querySelector(selector) as HTMLElement;
		let elements = document.querySelectorAll(selector + ' > :not(.spacer)');
		let tolerance = 0.01;

		this.scroll.onScrollEnd(container).subscribe((scroll: number) => {
			[].forEach.call(elements, (element, index) => {
				let leftMargin = (element.offsetParent.offsetWidth - element.offsetWidth) / 2;
				if (Math.abs(1 - (scroll / (element.offsetLeft - leftMargin))) <= tolerance) {
          this.asociationsPosition = Math.round(index);
				} else if (scroll == 0) {
          this.asociationsPosition = 0;
					return 1;
				}
			})
		})
  }

  moveSlider(str: string){
    if(str === 'next'){
      this.asociationsPosition++;
    } else if(str === 'prev'){
      this.asociationsPosition--;
    }
    const sliderCompanies = document.getElementById('slider-asociations-single');
    sliderCompanies.scrollLeft = this.asociationsPosition*this.windowSize.windowSize;
  }
}
