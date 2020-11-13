import { Component, OnInit, Input } from '@angular/core';
import {
	trigger,
	state,
	style,
	animate,
	transition,
} from '@angular/animations';
import { WindowSizeComponent } from '../window-size';
import { ScrollComponent } from '../scroll';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-slider-companies-reviews',
  templateUrl: './slider-companies-reviews.component.html',
  styleUrls: ['./slider-companies-reviews.component.scss'],
  animations: [
		trigger('frontContent', [
			state('in', style({ opacity: 1 })),
			transition(':leave',
				animate('300ms ease-in-out', style({ opacity: 0 }))
			)
    ]),
    trigger('backContent', [
			state('in', style({ opacity: 1 })),
			transition(':leave',
				animate('300ms ease-in-out', style({ opacity: 0 }))
			)
    ]),
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
export class SliderCompaniesReviewsComponent implements OnInit {

  constructor(
    public windowSize: WindowSizeComponent,
    public scroll: ScrollComponent,
    public data: DataService
  ) { }

  @Input() public webpage: string;

  floating: boolean;
  companyPosition: number = 0;
  showArrowRight: boolean = true;

  companies: any[] = [
    {name: "BBVA Next Technologies", flipped: false, picture: "assets/images/logos_empresas/logos_texto/BBVA-Next.png", testimony: "Destaco la calidad de los profesores, tanto humana como profesional. Los cursos están muy bien preparados y las clases son amenas y divertidas. Team Leader, BBVA Next Technologies"},
    {name: "US Embassy", flipped: false, picture: "assets/images/logos_empresas/logos_texto/US-Embassy.png", testimony: "Destaco la calidad de los profesores, tanto humana como profesional. Los cursos están muy bien preparados y las clases son amenas y divertidas. Team Leader, BBVA Next Technologies"},
    {name: "Técnicas Reunidas", flipped: false, picture: "assets/images/logos_empresas/logos_texto/tecnicas-reunidas.png", testimony: "Destaco la calidad de los profesores, tanto humana como profesional. Los cursos están muy bien preparados y las clases son amenas y divertidas. Team Leader, BBVA Next Technologies"},
    {name: "Comillas", flipped: false, picture: "https://api.americanlanguage.es/uploads/5aa9db5683dc4c308ee0bfd989ca7cc5.png", testimony: "Destaco la calidad de los profesores, tanto humana como profesional. Los cursos están muy bien preparados y las clases son amenas y divertidas. Team Leader, BBVA Next Technologies"},
    {name: "New York University", flipped: false, picture: "https://api.americanlanguage.es/uploads/5b6f8fe5440145bf8d7b4724d1b1da7c.png", testimony: "Destaco la calidad de los profesores, tanto humana como profesional. Los cursos están muy bien preparados y las clases son amenas y divertidas. Team Leader, BBVA Next Technologies"},
    {name: "National Geographic", flipped: false, picture: "https://api.americanlanguage.es/uploads/12cb30f9a0ba461d9e65e406f8f1210a.png", testimony: "Destaco la calidad de los profesores, tanto humana como profesional. Los cursos están muy bien preparados y las clases son amenas y divertidas. Team Leader, BBVA Next Technologies"},
    {name: "Saint Louis University", flipped: false, picture: "https://api.americanlanguage.es/uploads/b4f2297a5e474250b28683ebcfeef20e.png", testimony: "Destaco la calidad de los profesores, tanto humana como profesional. Los cursos están muy bien preparados y las clases son amenas y divertidas. Team Leader, BBVA Next Technologies"},
    {name: "University of Cambridge", flipped: false, picture: "https://api.americanlanguage.es/uploads/3f9cddec15d942a9bfb17345972ca0f3.png", testimony: "Destaco la calidad de los profesores, tanto humana como profesional. Los cursos están muy bien preparados y las clases son amenas y divertidas. Team Leader, BBVA Next Technologies"},
    {name: "Schiller International University", flipped: false, picture: "https://api.americanlanguage.es/uploads/06515a3d0f0e4164857982c31f19dc51.png", testimony: "Destaco la calidad de los profesores, tanto humana como profesional. Los cursos están muy bien preparados y las clases son amenas y divertidas. Team Leader, BBVA Next Technologies"}
  ];

  ngOnInit() {
  }

  ngAfterViewInit() {
    if(!this.windowSize.isDesktop) {
      this.setScrollListener('#slider-companies-flipping');
    }
  }

  flipCompany(index: number) {
    this.companies[index]['flipped'] = !this.companies[index]['flipped'];
    this.floating = true;
    setTimeout(() => {
      this.floating = false;
    }, 300);
  }

  setScrollListener(selector: string) {
		let container = document.querySelector(selector) as HTMLElement;
		let elements = document.querySelectorAll(selector + ' > :not(.spacer)');
		let tolerance = 0.01;

		this.scroll.onScrollEnd(container).subscribe((scroll: number) => {
			[].forEach.call(elements, (element, index) => {
				let leftMargin = (element.offsetParent.offsetWidth - element.offsetWidth) / 2;
				if (Math.abs(1 - (scroll / (element.offsetLeft - leftMargin))) <= tolerance) {
          this.companyPosition = Math.round(index);
				} else if (scroll == 0) {
          this.companyPosition = 0;
					return 1;
				}
			})
		})
  }


  moveSlider2(str: string){
    if(str === 'next'){
      this.companyPosition++;
    } else if(str === 'prev'){
      this.companyPosition--;
    }

    const sliderLength = this.companies.length - 1;
    
    const sliderCompanies = document.getElementById('slider-companies-flipping');
    const cardWidth = document.querySelector('.single-company').clientWidth;
    if(this.windowSize.isDesktop) {
      sliderCompanies.scrollLeft = this.companyPosition*cardWidth;
    } else {
      sliderCompanies.scrollLeft = this.companyPosition*this.windowSize.windowSize;
    }

    if(this.companyPosition*cardWidth >= (sliderLength)*cardWidth){
      this.showArrowRight = false;
    } else {
      this.showArrowRight = true;
    }
  }

}
