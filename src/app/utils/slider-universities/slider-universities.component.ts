import { Component, OnInit } from '@angular/core';
import { WindowSizeComponent } from 'src/app/utils/window-size';
import { ScrollComponent } from 'src/app/utils/scroll';
import {
	trigger,
	state,
	style,
	animate,
	transition,
} from '@angular/animations';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-slider-universities',
  templateUrl: './slider-universities.component.html',
  styleUrls: ['./slider-universities.component.scss'],
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
export class SliderUniversitiesComponent implements OnInit {

  constructor(
    public windowSize: WindowSizeComponent,
    public scroll: ScrollComponent,
    public data: DataService
  ) { }

  rangeValueCompanies: number = 0;
  companiesPosition: number = 0;
  isOpinions: boolean = false;
  isCourse: boolean = false;
  universities: any[] = [];
  rawUniversities: any[] = [];

  ngOnInit() {
    const pathname = window.location.pathname;
    if(pathname === '/american-language-academy-opiniones') {
      this.isOpinions = true;
      this.isCourse = false;
    } else if (pathname === '/cursos-ingles-madrid/preparacion-toefl' || pathname === '/cursos-ingles-madrid/preparacion-toefl#top'){
      this.isOpinions = false;
      this.isCourse = true;
    }

    this.data.getUniversities().subscribe(res => {
      let universities = [].map.call(res, uni => {
        uni['imageUrl'] = 'https://api.americanlanguage.es' + uni['Logo']['url'];
        uni['testimonial'] = this.data.getMarkdown(this.data.format(uni['Testimonial']));
        uni['slug'] = this.data.string_to_slug(uni['Universidad']);

        return uni;
      });

      universities = universities.filter(uni => uni['Mostrar']);
      this.rawUniversities = universities;
      
      for(let i = 0; i <= 5; i += 2) { // This 5 has to be dynamic
        let uniCopy = universities;
        let column = [];
        column.push(uniCopy.splice(0, 2));
        this.universities.push(column);
      }
    });
  }

  ngAfterViewInit(){
    this.handleScroll();
    this.setScrollListener('.slider-universities');
  }

  handleScroll(){
    const sliderCompanies = document.getElementById('slider-companies-single');
		const companiesColumns = document.querySelectorAll('.slider-companies-opinions .column');
		const inputCompanies = document.getElementById('inputRangeCompanies-single');
    sliderCompanies.addEventListener('scroll',  () => {
			const j = Math.round(sliderCompanies.scrollLeft/this.windowSize.windowSize);
			this.rangeValueCompanies = ((j/companiesColumns.length) * 100);
      inputCompanies['value'] = Math.round(this.rangeValueCompanies);
      this.companiesPosition = Math.round((this.rangeValueCompanies/100)*3) + 1;
		});
  }

  handleCompaniesRange(){
		const sliderCompanies = document.getElementById('slider-companies-single');
		const companiesColumns = document.querySelectorAll('.slider-companies-opinions .column');
		const range = event.target['value'];
		const maxPosition = companiesColumns.length;

		this.companiesPosition = Math.floor((range/100)*maxPosition);
		sliderCompanies.scrollLeft = this.companiesPosition*this.windowSize.windowSize;
	}

  selectUni(uni: number){
    const sliderCompanies = document.getElementById('slider-companies-single');

    this.companiesPosition = uni;
    sliderCompanies.scrollLeft = this.companiesPosition*this.windowSize.windowSize;
  }

  setScrollListener(selector: string) {
		let container = document.querySelector(selector) as HTMLElement;
		let elements = document.querySelectorAll(selector + ' > :not(.spacer)');
		let tolerance = 0.01;

		this.scroll.onScrollEnd(container).subscribe((scroll: number) => {
			[].forEach.call(elements, (element, index) => {
				let leftMargin = (element.offsetParent.offsetWidth - element.offsetWidth) / 2;
				if (Math.abs(1 - (scroll / (element.offsetLeft - leftMargin))) <= tolerance) {
          this.companiesPosition = Math.round(index);
				} else if (scroll == 0) {
          this.companiesPosition = 0;
					return 1;
				}
			})
		})
  }
  
  moveSlider(str: string){
    if(str === 'next'){
      this.companiesPosition++;
    } else if(str === 'prev'){
      this.companiesPosition--;
    }
    const sliderCompanies = document.getElementById('slider-companies-single');
    sliderCompanies.scrollLeft = this.companiesPosition*this.windowSize.windowSize;
  }

  
}
 