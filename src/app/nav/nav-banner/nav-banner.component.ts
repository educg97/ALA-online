import { Component, OnInit } from '@angular/core';
import { Filters } from 'src/app/utils/filters';
import { WindowSizeComponent } from 'src/app/utils/window-size';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
	selector: 'app-nav-banner',
	templateUrl: './nav-banner.component.html',
	styleUrls: ['./nav-banner.component.scss'],
	animations: [
		trigger('toastOnOff', [
			state('in', style({ transform: 'translateX(80vw)' })),
			transition(':enter', [
				style({ transform: 'translateX(-80vw)' }),
				animate('600ms ease-in-out')
			]),
			transition(':leave',
				animate('600ms ease-in-out', style({ transform: 'translateX(-80vw)' }))
			)
		])
	]
})
export class NavBannerComponent implements OnInit {

	certificate: boolean = false;
	empresas: boolean = false;
	active: boolean = true;
	interval: any;
	messages_onScreen: boolean = true;

	constructor(
		public filters: Filters,
		public window_util: WindowSizeComponent
	) {}

	ngOnInit() {
		// window.addEventListener('resize',()=>{this.navBannerAnimation()});

		this.certificate = this.filters['objetivo_certificar'];
		this.empresas = this.filters['alumno_empresas'];
		
	}
	
	ngAfterViewInit(){
		let messages = document.getElementsByClassName('message-container');
		if(messages && messages.length > 0){
			let message_top = (messages[0] as HTMLElement).offsetTop - 40;
			document.addEventListener('scroll', ()=>{
				this.messages_onScreen = (window.scrollY < message_top);
			})
		}
		this.navBannerAnimation({
			isMobile: this.window_util['isMobile'],
			isTablet: this.window_util['isTablet'],
			isDesktop: this.window_util['isDesktop']
		});

		this.window_util.observable.subscribe(device=>{
			this.navBannerAnimation(device);
		})
	}

	ngOnChanges(){
		this.certificate = this.filters['objetivo_certificar'];
		this.empresas = this.filters['alumno_empresas'];
	}

	navBannerAnimation(device){
		if (device['isMobile'] && this.active){
			this.active = false;
			let pills = document.getElementById('nav-banner').children;
			let counter = 0;
			this.iterationBanner(pills, 0);
			
			this.interval = setInterval(() => {
				counter = (counter + 1) % pills.length;
				this.iterationBanner(pills, counter);
			}, 5000);
		} else if (device['isTablet'] || device['isDesktop']) {
			this.active = true;
			if (this.interval){
				clearInterval(this.interval);
			}
		}
	}
	iterationBanner(pills, counter){
		[].forEach.call(pills, (pill, i) => {
			pill.style.opacity = i == counter ? 1 : 0;
			pill.style.display = i == counter ? "flex" : "none";
		});
	}
}
