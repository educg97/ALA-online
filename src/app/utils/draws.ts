import { Injectable } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Injectable({
	providedIn: "root"
})

export class DrawComponent {

	starCounter: number;
	showStar: boolean;
	rand: number;
	low_probability: number = 0.10;
	mid_probability: number = 0.15;
	// high_probability: number = 0.16;
	high_probability: number = 0.3;

	constructor(
		public data: DataService
	) { }

	ngOnInit() {
		// this.getNumberCounter();
	}

	getNumberCounter(probability:number){
		// this.data.getDraws().subscribe(res => {
		// 	this.starCounter = res[0]['Counter'];
		// });
		this.rand = Math.random();
		if(this.rand <= probability){
			this.showStar = true;
		} else {
			this.showStar = false;
		}
		// console.log('Rand: ' + this.rand + ', Show: ' + this.showStar) ;
	}

}
