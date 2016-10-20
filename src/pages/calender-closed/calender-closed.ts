import {NavController, NavParams} from 'ionic-angular';
import {Component,forwardRef} from '@angular/core';
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {CalenderService} from '../../services/calender.service';
import {errorhandler} from '../../services/error';

@Component({
    templateUrl: 'calender-closed.html',
//    directives: [forwardRef(() => ZarpoNavComponent)],
    providers: []
})

export class CalenderClosed {
    public zarpoIcon: boolean = true;
    pageTitle: string = 'Opa!';
    path: "booking";
    calenderRefresher: any;
    apiLoader:any
    constructor(
        private _nav: NavController,
        private _navParams: NavParams,
        private _calenderService: CalenderService,
        private _errorhandler: errorhandler
    ) {
        var data = {
            website_code: 'zarpo',
            product_id: this._navParams.get('id')
        };
        this.callCalender();
    }
    //back to product
    backToProduct() {
        this._nav.pop();
    }
    //check booking data
    callCalender() {
//        this._calenderService.fetchCalenderData(this._navParams.get('id'),'').subscribe((response) => {
//            console.log(response);
//            if (response != "Calender Blocked") {
//                //                $state.go("menu.checkout/:name/:id/:location", { name: $stateParams.name, id: $stateParams.id, location: $stateParams.location });
//            } else {
//                //check for calender once again
//                this.refreshItems();
//            }
//        }, (error) => {
//            //check for calender once again
//            this.refreshItems();
//            this._errorhandler.err(error);
//            return {};
//        });

    }
    //call calender data to check if it unblocked
    refreshItems() {
        this.calenderRefresher = setTimeout(() => {
            //call booking calender data 
            this.callCalender();
        }, 30 * 1000);
    }
    ionViewWillLeave() {
        //stop calling calender data
        clearTimeout(this.calenderRefresher);
    }
}
