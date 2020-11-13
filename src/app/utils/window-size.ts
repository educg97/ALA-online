import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: "root"
}) 

export class WindowSizeComponent {

	isMobile: boolean;
	isTablet: boolean;
	isDesktop: boolean;
	windowSize: number;
	tresholdMobile: number = 699;
	tresholdTablet: number = 999;

	constructor() { 
		this.calculateResize();
		this.observable.subscribe();
	}

	public observable = new Observable(observe => {
		window.addEventListener('resize', () => {
			this.calculateResize();
			observe.next({
				isMobile: this.isMobile,
				isTablet: this.isTablet,
				isDesktop: this.isDesktop,
				windowSize: this.windowSize
			})
		});
	})

	private calculateResize(){
		this.windowSize = document.documentElement.clientWidth;
		this.isMobile = false;
		this.isTablet = false;
		this.isDesktop = false;

		if (this.windowSize <= this.tresholdMobile){
			this.isMobile = true;
		} else if (this.tresholdMobile < this.windowSize && this.windowSize <= this.tresholdTablet) {
			this.isTablet = true;
		} else if (this.tresholdTablet < this.windowSize) {
			this.isDesktop = true;
		}
	}

}

