import {NavParams, NavController} from 'ionic-angular';
import {Component,forwardRef} from '@angular/core';
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';

@Component({
    templateUrl: 'vale-cancel.html',
//    directives: [forwardRef(() => ZarpoNavComponent)]
})

export class ValeCancel {
    public zarpoIcon: boolean = false;
    public pageTitle: string = 'Regras';
    public apiLoader:boolean=false;
    public nav:NavController;
    constructor(private _nav: NavController, private _navParams: NavParams) {
        this.nav=_nav;
    }
    backToFlash() {
        this.nav.pop();
    }
}
