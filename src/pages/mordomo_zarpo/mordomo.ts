import { NavController, Platform, NavParams} from 'ionic-angular'
import {Component} from '@angular/core';
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
@Component({
    templateUrl: 'mordomo.html',
//    directives: [ZarpoNavComponent]
})

export class mordomo {
    public zarpoIcon = true;
    public pageTitle = "Mordomo Zarpo";
    apiLoader:boolean;
    constructor(private _navParams: NavParams) {
        this._navParams = _navParams;
        if(this._navParams.get('name')){
            this.zarpoIcon=false;
        }
    }
}
