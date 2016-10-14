import {NavParams, NavController, LoadingController} from 'ionic-angular';
import {Component, forwardRef} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

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
    templateUrl: 'product-payment.html',
    //    directives: [forwardRef(() => ZarpoNavComponent), MyDatePicker, NoSpaceDirective, OnReturnDirective],
    //    providers: [Rxjs, PaymentService, DateService, LocalStorageService, MoipService, SuperService]
})

export class ProductPayment {
    public zarpoIcon: boolean = false;
    pageTitle: string = 'Finalize seu pagamento';
    hotelType: string = "HOTEL";
    path: string = "payment";
    installmentAmount: number = 100;
    dateTitle: string = "Válido até";
    showIcon: boolean = false;
    ifPaymentConfirmed: boolean;
    payment_btn = "Finalizr a reserva"
    creditCard: {} = {
        hasError: false
    };
    payment_emi: any = [];
    payee_emi: any = "-1";
    emiSet: any = [];
    payee_email = "";
    payee_cardname: string = 'Visa';
    payee_card_no: string;
    payee_card_cvv: string;
    payee_card_month: string;
    payee_cpf: string;
    payee_contact_no: string;
    payee_contact_code: string;
    payee_name: string;
    super_attribute: any;
    user_token: string;
    todayDate: string;
    paymentForm: any;
    timeoutCaller: any;
    checkSelected: any;
    checkReceipt: any;
    myDatePickerOptions: any;
    constructor(
        private _nav: NavController,
        private _navParams: NavParams,
        private _payment: PaymentService,
        private _date: DateService,
        private _local: LocalStorageService,
        private _moip: MoipService,
        private _super: SuperService,
        private _fb: FormBuilder,
        private _api: Rxjs,
        private _checkSelected: CheckSelectedService,
        private _checkReceipt: CheckReceiptService,
        private _localStorageService: LocalStorageService,
        private loadingCtrl: LoadingController

    ) {
        this.myDatePickerOptions = {
            dayLabels: { su: 'Dom', mo: 'Seg', tu: 'Ter', we: 'Qua', th: 'Qui', fr: 'Sex', sa: 'Sáb' },
            monthLabels: {
                1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mai', 6: 'Jun',
                7: 'Jul', 8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez'
            },
            showIcon: false,
            dateTitle: this.dateTitle,
            sunHighlight: false,
            dateFormat: 'dd-mm-yyyy',
            height: '34px',
            width: '100%'
        }
        console.log(this._navParams);
        this._localStorageService.getValue('user_data').then((response) => {
            this.payee_email = response.data.customer_email;
            this.paymentForm = this._fb.group({
                payee_card_no: ["", Validators.required],
                payee_name: ["", Validators.required],
                payee_card_cvv: ["", Validators.required],
                payee_cpf: ["", Validators.minLength(11)],
                payee_contact_code: ["", Validators.minLength(2)],
                payee_contact_no: ["", Validators.minLength(7)],
                payee_email: [this.payee_email, Validators.required]
            });
        });
        this.intervalFunction();
        this.getCurrentMonth();


        this._checkSelected.getData().then((response) => {
            this.checkSelected = response;
        });
        this._checkReceipt.getData().then((response) => {
            this.checkReceipt = response;
            //populate emi of given amount
            console.log(this.checkReceipt);
            this.findInstallment(this.checkReceipt.giftPrice);
            console.log(this.checkReceipt.giftPrice);
        });
        //ftech user email and token
        this._local.getValue('user_data').then((result: any) => {
            this.payee_email = result.data.customer_email;
            this.user_token = result.data.user_token;
        });
        //convert super attribute to desired structure
        this._super.convert(this._navParams.get('super_attribute')).then((res) => {
            this.super_attribute = res;
        });
        this.creditCard['hasError'] = false;

    }
    public myDate: any;
    onDateChanged(e: any) {
        console.log('expiry date', e);
        this.payee_card_month = e.formatted;
    }
    findInstallment(amount: number) {
        this._payment.installment(amount).then((response) => {
            console.log(response);
            this.emiSet = response;
            console.log(this.emiSet);
        });
    }
    getCurrentMonth() {
        this._date.currentHumanDate().then((response) => {
            console.log(response);
            this.todayDate = response;
            this.payee_card_month = response;
        });
    }
    //select card or emi
    selectCard() {
        this.creditCard = {};
        this.creditCard['hasError'] = false;
        this.payment_btn = 'Finalizr a reserva';
        this.ifPaymentConfirmed = false;
    }
    modelChange() {
        this.creditCard = {};
        this.creditCard['hasError'] = false;
        this.payment_btn = 'Finalizr a reserva';
        this.ifPaymentConfirmed = false;
    };
    getMyIP() {
        //        if (window.plugins && window.plugins.networkinterface) {
        //            networkinterface.getIPAddress(function(ip) {
        //                console.log(ip);
        //                this.ip = ip;
        //            });
        //        } else {
        //            this.ip = "Not found";
        //        }

    }
    redirectTimeout() {
        var data = {
            id: this._navParams.get('productId'),
            type: this._navParams.get('productType')
        };
        this._nav.push(Timeout, data);
    }
    intervalFunction() {
        this.timeoutCaller = setTimeout(() => {
            //delete local data and fetch items
            this.redirectTimeout();
        }, 1000 * 60 * 24);
    }
    //rules to cancel vale product
    payCancel() {
        console.log("show cancel");
        this._nav.push(ValeCancel);
    }
    // after final submit button clicked
    splitId(rid, sid) {
        var cutLetter = rid.length;
        var result = sid.slice(cutLetter, sid.length);
        return result;
    }
    calculateSubRoom(id) {
        var total = 0;
        var roomData = this.checkSelected;
        for (var i = 0; i < Object.keys(roomData.selectedRoom).length; i++) {
            if (roomData.selectedRoom[i]["id"] === id) {
                total = total + roomData.selectedRoom[i]["rooms"] * 1;
            }
        }
        return total;
    }
    //check form here
    getHumanDate(timestamp) {
        var x = new Date(timestamp);
        var d: any = x.getDate();
        if (d < 10)
            d = "0" + d;
        var m: any = x.getMonth() + 1;
        if (m < 9)
            m = "0" + m;
        var y = x.getFullYear();
        var todaydate = y + "-" + m + "-" + d;
        return todaydate;
    }
    payment_confirm(myForm: any) {
        var cardMonth;
        console.log('sdf', this.paymentForm);
        this.ifPaymentConfirmed = true
        if (myForm.controls.payee_name.value) var payee_name = myForm.controls.payee_name.value.trim();
        if (myForm.controls.payee_card_no.value) var payee_card_no = myForm.controls.payee_card_no.value.trim();
        if (myForm.controls.payee_card_cvv.value) var payee_card_cvv = myForm.controls.payee_card_cvv.value.trim();
        if (myForm.controls.payee_cpf.value) var payee_cpf = myForm.controls.payee_cpf.value.trim();
        if (myForm.controls.payee_contact_code.value) var payee_contact_code = myForm.controls.payee_contact_code.value.trim();
        if (myForm.controls.payee_contact_no.value) var payee_contact_no = myForm.controls.payee_contact_no.value.trim();
        if (myForm.controls.payee_email.value) var payee_email = myForm.controls.payee_email.value.trim();



        if (payee_card_no && this.payee_card_month && payee_card_cvv && this.payee_cardname) {
            var userCard: {} = {
                payee_cardname: this.payee_cardname,
                payee_card_no: payee_card_no,
                expiryMM: '',
                expiryYY: '',
                security: payee_card_cvv
            };
            cardMonth = this.payee_card_month.split("-");
            userCard['expiryYY'] = parseInt(cardMonth[0]);
            userCard['expiryMM'] = parseInt(cardMonth[1]);
            this._moip.validateCreditCard(userCard).then((processedCard) => {
                if (!processedCard['cardBrand']) {
                    this.creditCard['hasError'] = true;
                    this.creditCard['payee_card_no'] = false;
                }
                if (processedCard && processedCard['ifCardValid']) {
                    //if card no is same of selected card
                    if (processedCard['cardBrand'].toUpperCase() == this.payee_cardname.toUpperCase() &&
                        processedCard['ifCardValid'] === true) {
                        //card is valid we can continue

                    } else {
                        this.creditCard['hasError'] = true;
                        this.creditCard['payee_card_no'] = false;
                        this.creditCard['payee_card_cvv'] = false;
                        this.ifPaymentConfirmed = true;
                    }
                    //if expiry date is not valid
                    if (!processedCard['isExpiryValid'] === true) {
                        this.creditCard['hasError'] = true;
                        this.creditCard['payee_card_month'] = false;
                        this.ifPaymentConfirmed = true;
                        return false;
                    } else {
                    }
                    //if security code is valid
                    if (!processedCard['isSecurityValid'] === true) {
                        this.creditCard['hasError'] = true;
                        this.creditCard['payee_card_cvv'] = false;
                        this.ifPaymentConfirmed = true;
                        return false;
                    } else {
                    }
                    if (this.creditCard['hasError'] === true) {
                    }

                }
                else {
                    this.payment_btn = 'Finalizr a reserva';
                }

            });
        }
        else {
            this.creditCard['hasError'] = true;
            if (!this.payee_card_month) {
                this.creditCard['payee_card_month'] = false;
            }
            if (!this.payee_card_no) {
                this.creditCard['payee_card_no'] = false;
            }
            if (!this.payee_card_cvv) {
                this.creditCard['payee_card_cvv'] = false;
            }
            this.ifPaymentConfirmed = true;
        }

        this.ifPaymentConfirmed = true;
        if (
            this.creditCard['hasError'] == false &&
            this.payee_emi !== "-1" &&
            payee_name &&
            this.payee_cardname &&
            payee_card_no &&
            this.payee_card_month &&
            payee_card_cvv &&
            payee_cpf &&
            myForm.controls.payee_cpf.status &&
            payee_contact_code &&
            myForm.controls.payee_contact_code.status &&
            payee_contact_no &&
            myForm.controls.payee_contact_no.status &&
            payee_email && myForm.controls.payee_email.status
        ) {

            this.presentLoading();
            this.payment_btn = 'Aguarde';
            var orderData = {};
            orderData['customer_id'] = this.user_token;
            orderData['product'] = this._navParams.get('productId');
            //provide super attribute
            if (this.super_attribute) {
                orderData['super_attribute'] = {};
                orderData['super_attribute'][this.super_attribute[0]] = {};
                orderData['super_attribute'][this.super_attribute[0]][this.super_attribute[1]] = "";
            } else {
                orderData['super_attribute'] = {};
            }
            if (this.hotelType !== "VALE") {
                // payement/card data
                var stepReceipt = this.checkReceipt;
                orderData['ip'] = "";
                //hotel data
                if (stepReceipt) {
                    orderData['checkin_day'] = new Date(Date.parse(stepReceipt.checkInDate)).getDate();
                    orderData['checkin_month'] = new Date(Date.parse(stepReceipt.checkInDate)).getMonth();
                    orderData['checkin_year'] = new Date(Date.parse(stepReceipt.checkInDate)).getFullYear();
                    orderData['checkout_day'] = new Date(Date.parse(stepReceipt.checkOutDate)).getDate();
                    orderData['checkout_month'] = new Date(Date.parse(stepReceipt.checkOutDate)).getMonth();
                    orderData['checkout_year'] = new Date(Date.parse(stepReceipt.checkOutDate)).getFullYear();
                    orderData['lastcheckout'] = this.getHumanDate(stepReceipt.lastCheckOut);
                    orderData['product'] = stepReceipt.productId;
                    orderData['related_product'] = "";
                    orderData['total_price'] = stepReceipt.clientPrice; //client price
                    orderData['total_ref_price'] = stepReceipt.displayPrice; //display price
                    orderData['expproductId'] = 6118;
                    orderData['comment_textarea'] = this.checkSelected.specialMsg;
                }
                orderData['shipping'] = {
                    name: {},
                    adults: {},
                    children: {},
                    age: {}
                };
                orderData['subroom'] = {};
                orderData['super_attribute'] = {};
                var roomData = this.checkSelected;
                var categoryCheck = {};
                for (var i = 0; i < Object.keys(roomData.selectedRoom).length; i++) {
                    var roomId = roomData.selectedRoom[i].category;
                    var superAttrib = roomData.selectedRoom[i].superAttribute;
                    var su_key: any, su_value: any;
                    _.forEach(superAttrib, function(value, key) {
                        su_key = key;
                        su_value = value;
                        console.log(su_key);
                    });

                    if (orderData['super_attribute[su_key]']) {
                        var preValue;
                        if (orderData['super_attribute[su_key][su_value]']) {
                            preValue = parseInt(orderData['super_attribute[su_key][su_value]']);
                            orderData['super_attribute[su_key][su_value]'] = preValue + parseInt(roomData.selectedRoom[i].rooms);
                        } else {
                            orderData['super_attribute[su_key][su_value]'] = parseInt(roomData.selectedRoom[i].rooms);

                        }
                    } else {
                        orderData['super_attribute[su_key]'] = {};
                        orderData['super_attribute[su_key][su_value]'] = parseInt(roomData.selectedRoom[i].rooms);
                    }
                    //check if already initialized
                    if (orderData['subroom[roomId]']) {

                    } else {
                        orderData['subroom[roomId]'] = {};
                    }

                    var sub_roomId = this.splitId(roomId, roomData.selectedRoom[i]["id"]);
                    orderData['subroom[roomId][sub_roomId]'] = this.calculateSubRoom(roomData.selectedRoom[i]["id"]);
                    var thisCategoryName = roomData.selectedRoom[i].categoryName;
                    for (var j = 0; j < Object.keys(roomData.selectedRoom[i]["selected"]).length; j++) {
                        if (categoryCheck[thisCategoryName]) {
                            var lastIndex = categoryCheck[thisCategoryName];
                            categoryCheck[thisCategoryName] = lastIndex + 1;
                        } else {
                            categoryCheck[thisCategoryName] = 1;
                        }
                        var indexKey = roomData.selectedRoom[i].categoryName + " #" + categoryCheck[thisCategoryName];
                        if (roomData.selectedRoom[i]["selected"][j]["username"])
                            orderData['shipping["name"][indexKey]'] = roomData.selectedRoom[i]["selected"][j]["username"];
                        if (roomData.selectedRoom[i]["selected"][j]["adult"])
                            orderData['shipping["adults"][indexKey]'] = roomData.selectedRoom[i]["selected"][j]["adult"];
                        if (roomData.selectedRoom[i]["selected"][j]["child"])
                            orderData['shipping["children"][indexKey]'] = roomData.selectedRoom[i]["selected"][j]["child"];
                        else
                            orderData['shipping["children"][indexKey]'] = "-";
                        if (roomData.selectedRoom[i]["selected"][j]["childAge"])
                            orderData['shipping["age"][indexKey]'] = roomData.selectedRoom[i]["selected"][j]["childAge"];
                        else
                            orderData['shipping["age"][indexKey]'] = "ex: 4 e 7";
                    }
                }


            }

            orderData['payment'] = {
                method: "son_Moip_standard",
                forma_pagamento: "CartaoCredito",
                credito_parcelamento: this.payee_emi['num_emi'] + "|" + this.payee_emi['intallment'], //giftPayment.selectedEmi 1|15
                credito_instituicao: this.payee_cardname, //giftPayment.selectedCard
                credito_portador_nome: this.payee_cardname, //giftPayment.payee_cardname name on card
                credito_numero: payee_card_no, //giftPayment.payee_card_no
                credito_expiracao_mes: parseInt(cardMonth[1]), //giftPayment.payee_card_month
                credito_expiracao_ano: parseInt(cardMonth[0].toString().substr(2, 2)), //giftPayment.payee_card_month two digit of year
                credito_codigo_seguranca: payee_card_cvv, //giftPayment.payee_card_cvv
                credito_portador_cpftemp: payee_cpf, //giftPayment.payee_cpf
                redito_portador_telefonetempdd: payee_contact_code, //giftPayment.payee_contact_code
                credito_portador_telefonetemp: payee_contact_no, //giftPayment.payee_contact_no
                credito_portador_nascimento1: "",
                credito_portador_nascimento2: "",
                credito_portador_nascimento3: ""
            };

            //vale form data
            if (this.hotelType = 'VALE') {
                orderData['comment_textarea'] = this._navParams.get('presentear_Comment');
                orderData['name'] = this._navParams.get('presentear_Firstname');
                orderData['surname'] = this._navParams.get('presentear_Surname');
                orderData['email'] = this._navParams.get('presentear_Email');
                orderData['date'] = new Date(this._navParams.get('presentear_GiftDate'));// full date object
                orderData['amount'] = this._navParams.get('totalPrice');

            }
            orderData['customer_email_field_cc'] = this.payee_email;

            console.log(orderData);
            this._api.ajaxRequest(this.path, orderData).subscribe((response) => {
                this.payment_btn = 'Finalizr a reserva';
                if (response && response['success'] == true && response['error'] == false) {

                    if (response['redirect'] && response['redirect.length'] > 0) {
                        this.payment_btn = 'Finalizr a reserva';
                        this._nav.push(OrderSuccess);
                    }
                }
                else {
                    this._nav.push(OrderFail);
                    //ip is blocked for request
                    //                    if (response.fraud) {
                    //                        this.fraud = true;
                    //                        this.giftPayment_btn = 'Comprar o presente';
                    //                        $ionicLoading.hide();
                    //                        $ionicBackdrop.release();
                    //                    } else {
                    //                        console.log("fail");
                    //                        this.giftPayment_btn = 'Comprar o presente';
                    //                        $ionicLoading.hide();
                    //                        $ionicBackdrop.release();
                    //                        $state.go("menu.orderFail/:id", { id: stepReceipt.productId });
                    //                    }


                }

            });


        }
        else {
            console.log("has error in form");
        }
    }
    presentLoading() {
        let loading = this.loadingCtrl.create({
            content: '<h3 class="loader-title">Por favor aguarde...</h3><p class="loader-body">Dê-nos alguns segundos... Seu pedido está sendo processado!</p>',
            duration: 500000,
            dismissOnPageChange: false
        });
        loading.present();
    }
    backToFlash() {
    }
    onPageWillLeave() {
        //stop redirect caller 
        clearTimeout(this.timeoutCaller);
    }
}
