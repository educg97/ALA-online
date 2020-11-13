import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/data.service';
import { Config } from 'src/app/utils/config';
import {Router, NavigationEnd} from '@angular/router';

declare let grecaptcha: any;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	constructor(
		public data: DataService,
		public config: Config,
		private router: Router
	) { 
		// (window.location.pathname == '/') ? window.location.pathname = 'home' : null;
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				(<any>window).ga('set', 'page', event.urlAfterRedirects);
				(<any>window).ga('send', 'pageview');
			  }
		});
	 }

	ngOnInit(){
		grecaptcha.ready(() => {
			grecaptcha.execute(environment.captchaPublicKey, {action: 'homepage'})
			.then((token) => {
				this.data.validateCaptcha(token).subscribe((res)=>{
					this.config.hooman = res['score'];
				});
			});
		});
		// (window.location.pathname == '/') ? window.location.pathname = 'home' : null;
	}

	ngOnDestroy(){
		sessionStorage.removeItem("course");
	}
}
