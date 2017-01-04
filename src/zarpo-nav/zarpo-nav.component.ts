import { Events, NavController, MenuController } from 'ionic-angular';
import { Component, OnInit, Input, OnChanges, Output, forwardRef } from '@angular/core';
import { HotelFlash } from '../pages/hotel-flash/hotel-flash';

@Component({
    selector: "zarpo-nav-bar",
    templateUrl: 'zarpo-nav.html',
    //    directives: [HotelFlash]
})

export class ZarpoNavComponent {
    @Input() title: string = '';
    @Input() loading: boolean;
    @Input() showBack: boolean = false;
    @Input() customback: boolean = false;

    constructor(private nav: NavController, private _menu: MenuController, public events: Events) {
    }
    openHome() {
        this.nav.setRoot(HotelFlash);
    }
    goBack() {
        this.loading = false;
        this.nav.pop().then((data) => {
            console.log("goBack", data);
            this.events.publish('custom:pop', 'true');

        });

    }
    custom() {
        console.log("custom");
        this.events.publish('custom:created', 'hello');
    }

}
