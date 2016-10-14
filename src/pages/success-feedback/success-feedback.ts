import {NavParams, NavController, LoadingController} from 'ionic-angular';
import {Component, forwardRef} from '@angular/core';
//import { FormBuilder, Validators } from '@angular/common';

import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {ValeCancel} from '../vale-cancel/vale-cancel';
import {OrderSuccess} from '../order-success/order-success';
import {OrderFail} from '../order-fail/order-fail';
import {Timeout} from '../timeout/timeout';

import {MoipService} from '../../services/moip.service';
import {PaymentService} from '../../services/payment.service';
import {DateService} from '../../services/date.service';
import {LocalStorageService} from '../../services/local-storage.service';
import {SuperService} from '../../services/super.service';
import {Rxjs} from '../../services/Rxjs';
import {CheckSelectedService} from '../../services/check-selected.service';
import {CheckReceiptService} from '../../services/check-receipt.service';
import {NoSpaceDirective} from '../../directives/no-space.directive';
import {OnReturnDirective} from '../../directives/on-return.directive';
import {MyDatePicker} from '../my-date-picker/my-date-picker.component';



@Component({
    templateUrl: 'success-feedback.html',
//    directives: [],
    providers: []
})

export class SuccessFeedback {
    constructor(
        private _nav: NavController
    ) {

    }
}
