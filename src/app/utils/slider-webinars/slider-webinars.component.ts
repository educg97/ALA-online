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
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-slider-webinars',
  templateUrl: './slider-webinars.component.html',
  styleUrls: ['./slider-webinars.component.scss'],
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
export class SliderWebinarsComponent implements OnInit {

  constructor(
    public windowSize: WindowSizeComponent,
    public scroll: ScrollComponent,
    public data: DataService,
    private sanitizer:DomSanitizer
  ) { }

  @Input() public webpage: string;

  floating: boolean;
  webinarPosition: number = 0;
  showArrowRight: boolean = true;

  webinars: Object[] = [
    {webinarName: "Emails comerciales en inglés", video: this.getTrustlyYoutubeURL("AQ_c3iCVceg"), flipped: false},
    {webinarName: "Llamadas efectivas en inglés", video: this.getTrustlyYoutubeURL("h9IC5HzTxYc"), flipped: false},
    {webinarName: "Presenta tu empresa en ingés", video: this.getTrustlyYoutubeURL("KXQv_PfytTo"), flipped: false},
    {webinarName: "Técnicas de negociación en inglés", video: this.getTrustlyYoutubeURL("9n3q950lYuY"), flipped: false},
    {webinarName: "Solo travelling on and off the beaten path", video: this.getTrustlyFacebookURL("510766546274360"), flipped: false},
    {webinarName: "Origami", video: this.getTrustlyFacebookURL("582941238979216"), flipped: false},
    {webinarName: "How to deal with anxiety and fear: useful techniques to do at home", video: this.getTrustlyFacebookURL("2681453522099956"), flipped: false},
    {webinarName: "Reading poetry", video: this.getTrustlyFacebookURL("869744300137164"), flipped: false},
    {webinarName: "Homeopathic Principles", video: this.getTrustlyFacebookURL("565140240762509"), flipped: false},
    {webinarName: "American Accents", video: this.getTrustlyFacebookURL("2647850665343318"), flipped: false},
    {webinarName: "Basics of self-defense", video: this.getTrustlyFacebookURL("911739929279696"), flipped: false},
    {webinarName: "Facebook live 1", video: this.getTrustlyFacebookURL("209006290329488"), flipped: false},
    {webinarName: "Facebook live 2", video: this.getTrustlyFacebookURL("510231056323486"), flipped: false},
    {webinarName: "Facebook live 3", video: this.getTrustlyFacebookURL("710260273059131"), flipped: false},
    {webinarName: "Facebook live 4", video: this.getTrustlyFacebookURL("354035728820250"), flipped: false},
    {webinarName: "Facebook live 5", video: this.getTrustlyFacebookURL("237761227354219"), flipped: false},
    {webinarName: "Facebook live 6", video: this.getTrustlyFacebookURL("2643198132567875"), flipped: false},
    {webinarName: "Facebook live 7", video: this.getTrustlyFacebookURL("207461890577933"), flipped: false}
  ];

  ngOnInit() {
  }

  ngAfterViewInit() {
    if(!this.windowSize.isDesktop) {
      this.setScrollListener('#slider-companies-flipping');
    }
  }

  flipWebinar(index: number) {
    this.webinars[index]['flipped'] = !this.webinars[index]['flipped'];
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
          this.webinarPosition = Math.round(index);
				} else if (scroll == 0) {
          this.webinarPosition = 0;
					return 1;
				}
			})
		})
  }


  moveSlider2(str: string){
    if(str === 'next'){
      this.webinarPosition++;
    } else if(str === 'prev'){
      this.webinarPosition--;
    }

    const sliderLength = this.webinars.length - 1;
    
    const sliderWebinars = document.getElementById('slider-companies-flipping');
    const cardWidth = document.querySelector('.single-company').clientWidth;
    if(this.windowSize.isDesktop) {
      sliderWebinars.scrollLeft = this.webinarPosition*cardWidth;
    } else {
      sliderWebinars.scrollLeft = this.webinarPosition*this.windowSize.windowSize;
    }

    if(this.webinarPosition*cardWidth >= (sliderLength)*cardWidth){
      this.showArrowRight = false;
    } else {
      this.showArrowRight = true;
    }
  }

  getTrustlyYoutubeURL(id: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + id);
  }

  getTrustlyFacebookURL(id: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FAmericanLanguageAcademySpain%2Fvideos%2F' + id + '%2F&show_text=0&width=560');
  }

}
