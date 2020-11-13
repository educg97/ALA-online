import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DataService } from 'src/app/data.service';
import { ModalComponent } from 'src/app/utils/modal';
import { ScrollComponent } from 'src/app/utils/scroll';
import { Google } from 'src/app/utils/google';

@Component({
	selector: 'app-contact',
	templateUrl: './contact.component.html',
	styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

	constructor(
		public data: DataService,
		public titleService: Title,
		public modal: ModalComponent,
		public scroll: ScrollComponent,
		public google: Google
	) { }

	name: string;
	surname: string;
	email: string;
	phone: string;
	message: string;
	terms: string;

	contact_btn: HTMLElement;
	contact_container: HTMLElement;
	captcha: boolean;
	captcha_token: object;

	ngOnInit() {
	}

	openContactModal(){
		this.modal.openModal('contact');
		this.scroll.disable();
	}

	closeContactModal(){
		this.scroll.enable();
		this.modal.closeModal();
	}

	callPhone(){
		window.location.href ="tel:914455511";
		(<any>window).ga('send', 'event', {
			eventCategory: 'llamadaNav',
			eventLabel: 'nav',
			eventAction: 'call',
			// eventValue: 10
		  });
		  this.google.phoneBtn();
	}
}
