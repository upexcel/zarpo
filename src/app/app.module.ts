import { NgModule } from '@angular/core';
import {SebmGoogleMapMarker, SebmGoogleMap} from 'angular2-google-maps/core';
import {AgmCoreModule} from 'angular2-google-maps/core/core-module';

import { MyApp } from './app.component';
import { Storage } from '@ionic/storage';
import {IonicApp, IonicModule, Platform, Nav, NavController, Events} from 'ionic-angular';
import {GoogleTagService} from '../services/google-tag.service';
//services
import {menuService} from '../services/menu.service';
import {Rxjs} from '../services/Rxjs';
import {CalenderService} from '../services/calender.service';
import {ImageHeightService} from '../services/image-height.service';
import {LocalStorageService} from '../services/local-storage.service';
import {UserDetailService} from '../services/user-detail.service';
import {GuestDetailService} from '../services/guest-detail.service';
import {CheckSelectedService} from '../services/check-selected.service';
import {CheckReceiptService} from '../services/check-receipt.service';
import {DateService} from '../services/date.service';
import {calendarService} from '../pages/calendar//calendar.servise';
import {errorhandler} from '../services/error';
import {facebookLogin} from '../services/fbLogin';


import {MoipService} from '../services/moip.service';
import {GeocoderService} from '../services/geocoder.service';
import {SuperService} from '../services/super.service';
import {PaymentService} from '../services/payment.service';
//COMPONENTS

import {calendar} from '../pages/calendar/calendar';
import {CalenderClosed} from '../pages/calender-closed/calender-closed';
import {cancel} from '../pages/cancel/cancel';
import {feedBack} from '../pages/feedback/feedback';
import {feedbackLanding} from '../pages/feedback/feedbackLanding'
import {ForgotPwd} from '../pages/forgot-pwd/forgot-pwd';
import {GuestDetail} from '../pages/guest-detail/guest-detail';
import {HotelDetail} from '../pages/hotel-detail/hotel-detail';
import {HotelFlash} from '../pages/hotel-flash/hotel-flash';
import {hotelTag} from '../pages/hotelFilter/hotelTag';
import {invite} from '../pages/inviteFriends/invite'
import {JaDetail} from '../pages/ja-detail/ja-detail';
import {Login} from '../pages/login/login';
import {menu} from '../pages/menu/menu.component';
import {mordomo} from '../pages/mordomo_zarpo/mordomo';
import {myAccount} from '../pages/myAccount/myAccount';
import {myReservation} from '../pages/myreservation/reservation';
import {nLetter} from '../pages/newsLetter/newsletter';
import {offline} from '../pages/offline/offline';
import {OrderFail} from '../pages/order-fail/order-fail';
import {OrderSuccess} from '../pages/order-success/order-success';
import {PacoteDetail} from '../pages/pacote-detail/pacote-detail';
import {privacy} from '../pages/privacy/privacy';
import {ProductClosed} from '../pages/product-closed/product-closed';
import {ProductDeactivated} from '../pages/product-deactivated/product-deactivated';
import {ProductPayment} from '../pages/product-payment/product-payment';
import {Receipt} from '../pages/receipt/receipt';
import {SuccessFeedback} from '../pages/success-feedback/success-feedback';
import {terms} from '../pages/terms_condition/termsCondition';
import {Timeout} from '../pages/timeout/timeout';
import {ValeCancel} from '../pages/vale-cancel/vale-cancel';
import {ValeDetail} from '../pages/vale-detail/vale-detail';
import {ValeFlash} from '../pages/vale-flash/vale-flash';

//======================directives======================


//=========================pipe==========================
import {DayPipe} from '../filters/date/day.pipe';
import {FormatDatePipe} from '../filters/date/format-date.pipe';
import {DateDayPipe} from '../filters/date/date.pipe';
import {ZarpoHotelPipe} from '../filters/hotel/zarpo-hotel.pipe';
import {AdultChildPipe} from '../filters/keys/adult-child.pipe';
import {KeysPipe} from '../filters/keys/keys.pipe';
import {RoomsPipe} from '../filters/keys/rooms.pipe';
import {StringToNumberPipe} from '../filters/keys/string-to-number.pipe';
import {ValeKeysPipe} from '../filters/keys/vale-keys.pipe';
import {SafeHtmlPipe} from '../filters/pacote/safe-html.pipe';
import {ZarpoPacotePipe} from '../filters/pacote/zarpo-pacote.pipe';
import {tagPipe} from '../filters/tag/tag.pipe';
import {ZarpoValePipe} from '../filters/vale/zarpo-vale.pipe';

//============================directives==================
import {FacebookComponent} from '../facebookLogin/FacebookLogin';
import {FlashCardComponent} from '../flash-card/flash-card.component';
import {FooterComponent} from '../footer/footer.component';
import {ZarpoAccordianComponent} from '../zarpo-accordian/zarpo-accordian.component';
import {ZarpoNavComponent} from '../zarpo-nav/zarpo-nav.component';
import {ZarpoSliderComponent} from '../zarpo-slider/zarpo-slider.component';
import {NoSpaceDirective} from '../directives/no-space.directive';
import {OnReturnDirective} from '../directives/on-return.directive';
import {MyDatePicker} from '../pages/my-date-picker/my-date-picker.component';
@NgModule({
    declarations: [
        MyApp,
        calendar,
        CalenderClosed,
        cancel,
        feedBack,
        feedbackLanding,
        ForgotPwd,
        GuestDetail,
        HotelDetail,
        HotelFlash,
        hotelTag,
        invite,
        JaDetail,
        Login,
        menu,
        mordomo,
        myAccount,
        myReservation,
        nLetter,
        offline,
        OrderFail,
        OrderSuccess,
        PacoteDetail,
        privacy,
        ProductClosed,
        ProductDeactivated,
        ProductPayment,
        Receipt,
        SuccessFeedback,
        terms,
        Timeout,
        ValeCancel,
        ValeDetail,
        ValeFlash,
        //   ==========    pipe 
        DayPipe,
        FormatDatePipe,
        DateDayPipe,
        ZarpoHotelPipe,
        AdultChildPipe,
        KeysPipe,
        RoomsPipe,
        StringToNumberPipe,
        ValeKeysPipe,
        SafeHtmlPipe,
        ZarpoPacotePipe,
        tagPipe,
        ZarpoValePipe,

        //        ==========================directive===========
        FacebookComponent,
        FlashCardComponent,
        FooterComponent,
        ZarpoAccordianComponent,
        ZarpoNavComponent,
        ZarpoSliderComponent,
        //        OnReturnDirective,
        //        NoSpaceDirective,
        MyDatePicker
    ],
    imports: [
        AgmCoreModule.forRoot({ apiKey: 'AIzaSyA94HTT_HUIQZjKN2ZOFmHVCWblejrQUfc' }),
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        calendar,
        CalenderClosed,
        cancel,
        feedBack,
        feedbackLanding,
        ForgotPwd,
        GuestDetail,
        HotelDetail,
        HotelFlash,
        hotelTag,
        invite,
        JaDetail,
        Login,
        menu,
        mordomo,
        myAccount,
        myReservation,
        nLetter,
        offline,
        OrderFail,
        OrderSuccess,
        PacoteDetail,
        privacy,
        ProductClosed,
        ProductDeactivated,
        ProductPayment,
        Receipt,
        SuccessFeedback,
        terms,
        Timeout,
        ValeCancel,
        ValeDetail,
        ValeFlash,
        // ==========================directive===========
        FacebookComponent,
        FlashCardComponent,
        FooterComponent,
        ZarpoAccordianComponent,
        ZarpoNavComponent,
        ZarpoSliderComponent,
        //        OnReturnDirective,
        //        NoSpaceDirective,
        MyDatePicker
    ],
    providers: [Storage, Rxjs, ImageHeightService, GoogleTagService, facebookLogin, errorhandler, LocalStorageService, UserDetailService,
        GuestDetailService, CheckReceiptService, GeocoderService, DateService, CheckSelectedService, menuService, CalenderService, calendarService
        , MoipService, SuperService, PaymentService]

})
export class AppModule { }