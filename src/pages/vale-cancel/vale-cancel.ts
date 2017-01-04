import {NavParams, NavController} from 'ionic-angular';
import {Component, forwardRef} from '@angular/core';
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {LocalStorageService} from '../../services/local-storage.service';


@Component({
    templateUrl: 'vale-cancel.html',
    //    directives: [forwardRef(() => ZarpoNavComponent)]
})

export class ValeCancel {
    public zarpoIcon: boolean = false;
    public pageTitle: string = 'Regras';
    public cancelContent: any;
    public nav: NavController;
    constructor(
        private _nav: NavController,
        private _navParams: NavParams,
        public local: LocalStorageService
    ) {
        this.nav = _nav;
        this.local.getValue('rules').then((data) => {
            this.cancelContent = data;
            console.log(data);
        });
    }
    backToFlash() {
        this.nav.pop();
    }
}
