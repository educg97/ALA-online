import { Injectable } from '@angular/core';

@Injectable({
	providedIn: "root"
})

export class Appointments {

	constructor() { }

	animate({timing, draw, duration}) {

		let start = performance.now();
	
		requestAnimationFrame(function animate(time) {
			// timeFraction goes from 0 to 1
			let timeFraction = (time - start) / duration;
			if (timeFraction > 1) timeFraction = 1;
		
			// calculate the current animation state
			let progress = timing(timeFraction);
		
			draw(progress); // draw it
		
			if (timeFraction < 1) {
				requestAnimationFrame(animate);
			}
		
		});
	}

	// Time functions

	linear(timeFraction) {
		return timeFraction;
	}

	quad(timeFraction) {
		return Math.pow(timeFraction, 2)
	}

	circ(timeFraction) {
		return 1 - Math.sin(Math.acos(timeFraction));
	}

	back(x=1.5, timeFraction) {
		return Math.pow(timeFraction, 2) * ((x + 1) * timeFraction - x)
	}

	bounce(timeFraction) {
		for (let a = 0, b = 1, result; 1; a += b, b /= 2) {
			if (timeFraction >= (7 - 4 * a) / 11) {
				return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
			}
		}
	}

	elastic(x=1.5, timeFraction) {
		return Math.pow(2, 10 * (timeFraction - 1)) * Math.cos(20 * Math.PI * x / 3 * timeFraction)
	}

}