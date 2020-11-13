import { Component, OnInit } from '@angular/core';
import { ModalComponent } from 'src/app/utils/modal';
import { ScrollComponent } from 'src/app/utils/scroll';
import { WindowSizeComponent } from 'src/app/utils/window-size';
import { Google } from 'src/app/utils/google';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

	  constructor(
		public modal: ModalComponent,
		public scroll: ScrollComponent,
		public window_util: WindowSizeComponent,
		public google: Google
	  ) { }

	ngOnInit() {}


	openContactModal(){
		this.modal.openModal('contact');
		this.scroll.disable();
	}

	closeContactModal(){
		this.scroll.enable();
		this.modal.closeModal();
	}

	trackingPhoneCallGA(){
		window.location.href='tel:914455511';
		this.google.phoneBtn();
		(<any>window).ga('send', 'event', {
			eventCategory: 'llamadaFooter',
			eventLabel: 'footer',
			eventAction: 'call',
			// eventValue: 10
		  });
	}
}
