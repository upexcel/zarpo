import { NavParams, NavController, LoadingController } from 'ionic-angular';
import { Component, forwardRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ValeCancel } from '../vale-cancel/vale-cancel';
import { OrderSuccess } from '../order-success/order-success';
import { OrderFail } from '../order-fail/order-fail';
import { Timeout } from '../timeout/timeout';
import { MoipService } from '../../services/moip.service';
import { PaymentService } from '../../services/payment.service';
import { DateService } from '../../services/date.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { SuperService } from '../../services/super.service';
import { Rxjs } from '../../services/Rxjs';
import { CheckSelectedService } from '../../services/check-selected.service';
import { CheckReceiptService } from '../../services/check-receipt.service';
import { EmailValidator } from '../../validators/email.validator';
import { DateValidator } from '../../validators/date.validator';
import _ from 'lodash';

@Component({
    templateUrl: 'product-payment.html'
})

export class ProductPayment {
    public zarpoIcon: boolean = false;
    pageTitle: string = 'Finalize seu pagamento';
    hotelType: string;
    path: string = "payment";
    installmentAmount: number = 100;
    dateTitle: string = "Válido até";
    showIcon: boolean = false;
    ifPaymentConfirmed: boolean;
    payment_btn = "Finalizr a reserva"
    creditCard: any = {
        "hasError": false,
        "payee_card_month": true
    };
    payment_emi: any = [];
    payee_emi: any = "-1";
    emiSet: any = [];
    payee_email = "";
    payee_cardname: string = 'Visa';
    payee_card_no: string;
    payee_card_cvv: string;
    payee_card_month: string;
    card_month: any;
    card_year: any;
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
    apiLoader: boolean;
    loading:any;
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
        this.hotelType = this._navParams.get('hotelType');
        this._localStorageService.getValue('user_data').then((response) => {
            this.payee_email = response.data.customer_email;
            this.paymentForm = new FormGroup({
                payee_card_no: new FormControl('', [
                    Validators.maxLength(30),
                    Validators.required
                ]),
                payee_name: new FormControl('', [
                    Validators.maxLength(30),
                    Validators.pattern('[a-zA-Z]*'),
                    Validators.required
                ]),
                payee_card_cvv: new FormControl('', [
                    Validators.minLength(3),
                    Validators.required
                ]),
                payee_cpf: new FormControl('', [
                    Validators.minLength(11),
                    Validators.maxLength(11),
                    Validators.required
                ]),
                payee_contact_code: new FormControl('', [
                    Validators.minLength(2),
                    Validators.maxLength(2),
                    Validators.required
                ]),
                payee_contact_no: new FormControl('', [
                    Validators.minLength(8),
                    Validators.maxLength(9),
                    Validators.required
                ]),
                payee_email: new FormControl(this.payee_email, [
                    Validators.maxLength(50),
                    EmailValidator.isValidMailFormat,
                    Validators.required
                ])

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
            this._super.convert(this.checkReceipt.super_attribute).then((res) => {// do by mohit
                this.super_attribute = res;
            });
            this.findInstallment(this.checkReceipt.giftPrice);
        });
        //ftech user email and token
        this._local.getValue('user_data').then((result: any) => {
            this.payee_email = result.data.customer_email;
            this.user_token = result.data.user_token;
        });
        //convert super attribute to desired structure

        //        this._super.convert(this.checkReceipt.super_attribute).then((res) => {
        //            this.super_attribute = res;
        //            console.log("this.super_attribute",this.super_attribute)
        //        });
        this.creditCard['hasError'] = false;
    }
    public myDate: any;
    monthSelected(e) {
        this.card_month = e.month;
        this.modelChange();
    }
    yearSelected(e) {
        this.card_year = e.year;
        this.modelChange();
    }
    onDateChanged(e: any) {
        this.payee_card_month = e.formatted;
    }
    emailChange() {
        this._localStorageService.getValue('user_data').then((response) => {
            response.data.customer_email = this.paymentForm.controls.payee_email.value;
            this._localStorageService.setValue('user_data', response);
        });
    }
    findInstallment(amount: number) {
        this._payment.installment(amount).then((response) => {
            this.emiSet = response;
        });
    }
    getCurrentMonth() {
        this._date.currentHumanDate().then((response) => {
            this.todayDate = response;
            this.payee_card_month = response;
        });
    }
    //select card or emi
    selectCard() {
        this.creditCard = {};
        this.creditCard['hasError'] = false;
        this.creditCard['payee_card_month'] = true;
        this.payment_btn = 'Finalizr a reserva';
        this.ifPaymentConfirmed = false;
    }
    modelChange() {
        this.creditCard = {};
        this.creditCard['hasError'] = false;
        this.creditCard['payee_card_month'] = true;
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
        this.ifPaymentConfirmed = true;
        if (myForm.controls.payee_name.value) var payee_name = myForm.controls.payee_name.value.trim();
        if (myForm.controls.payee_card_no.value) var payee_card_no = myForm.controls.payee_card_no.value.trim();
        if (myForm.controls.payee_card_cvv.value) var payee_card_cvv = myForm.controls.payee_card_cvv.value.trim();
        if (myForm.controls.payee_cpf.value) var payee_cpf = myForm.controls.payee_cpf.value.trim();
        if (myForm.controls.payee_contact_code.value) var payee_contact_code = myForm.controls.payee_contact_code.value.trim();
        if (myForm.controls.payee_contact_no.value) var payee_contact_no = myForm.controls.payee_contact_no.value.trim();
        if (myForm.controls.payee_email.value) var payee_email = myForm.controls.payee_email.value.trim();
        if (payee_card_no && this.card_month && this.card_year && payee_card_cvv && this.payee_cardname) {
            var userCard: {} = {
                payee_cardname: this.payee_cardname,
                payee_card_no: payee_card_no,
                expiryMM: '',
                expiryYY: '',
                security: payee_card_cvv
            };
            userCard['expiryYY'] = this.card_year * 1;
            userCard['expiryMM'] = this.card_month * 1;
            this._moip.validateCreditCard(userCard).then((processedCard) => {
                //if card number is somethind brancd is no getting fetched from
                if (!processedCard['cardBrand']) {
                    this.creditCard['hasError'] = true;
                    this.creditCard['payee_card_no'] = false;
                }
                else if (processedCard['cardBrand'].toUpperCase() != this.payee_cardname.toUpperCase()) {
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
                        if (processedCard['cardBrand'].toUpperCase() == 'VISA' && payee_card_cvv.length > 3) {
                            this.creditCard['hasError'] = true;
                            this.creditCard['payee_card_cvv'] = false;
                            this.ifPaymentConfirmed = true;
                            return false;
                        }
                    }
                    this.presentLoading();

                    if (this.creditCard['hasError'] === true) {

                    }
                    else {
                        this.ifPaymentConfirmed = true;
                        if (
                            this.creditCard['hasError'] == false &&
                            this.payee_emi !== "-1" &&
                            payee_name &&
                            this.payee_cardname &&
                            payee_card_no &&
                            this.card_year &&
                            this.card_month &&
                            payee_card_cvv &&
                            payee_cpf &&
                            myForm.controls.payee_cpf.status &&
                            payee_contact_code &&
                            myForm.controls.payee_contact_code.status &&
                            payee_contact_no &&
                            myForm.controls.payee_contact_no.status &&
                            payee_email && myForm.controls.payee_email.status
                        ) {
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
                            orderData['is_ja'] = false;
                            if (this.hotelType !== "Vale") {
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
                                    orderData['total_price'] = stepReceipt.totalPrice; //client price
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
                                    var su_key: any
                                    var su_value: any;
                                    _.forEach(superAttrib, function(value, key) {
                                        su_key = key;
                                        su_value = value;
                                    });
                                    if (orderData['super_attribute'][su_key]) {
                                        var preValue;
                                        if (orderData['super_attribute'][su_key][su_value]) {
                                            //                                            preValue = parseInt(orderData['super_attribute[' + su_key + '][' + su_value + ']']);
                                            preValue = parseInt(orderData['super_attribute'][su_key][su_value]);
                                            orderData['super_attribute'][su_key][su_value] = preValue + parseInt(roomData.selectedRoom[i].rooms);
                                            //                                            orderData['super_attribute[' + su_key + '][' + su_value + ']'] = preValue + parseInt(roomData.selectedRoom[i].rooms);
                                        } else {
                                            orderData['super_attribute'][su_key][su_value] = parseInt(roomData.selectedRoom[i].rooms);
                                            //                                            orderData['super_attribute[' + su_key + '][' + su_value + ']'] = parseInt(roomData.selectedRoom[i].rooms);
                                        }
                                    } else {
                                        orderData['super_attribute'][su_key] = {}
                                        orderData['super_attribute'][su_key][su_value] = parseInt(roomData.selectedRoom[i].rooms);
                                    }
                                    //check if already initialized
                                    var sub_roomId = this.splitId(roomId, roomData.selectedRoom[i]["id"]);
                                    if (orderData["subroom"][roomId]) {
                                        orderData['subroom'][roomId][sub_roomId] = this.calculateSubRoom(roomData.selectedRoom[i]["id"]);

                                    } else {
                                        orderData['subroom'][roomId] = {};
                                        orderData['subroom'][roomId][sub_roomId] = this.calculateSubRoom(roomData.selectedRoom[i]["id"]);

                                    }
                                    var thisCategoryName = roomData.selectedRoom[i].categoryName;
                                    for (var j = 0; j < Object.keys(roomData.selectedRoom[i]["selected"]).length; j++) {
                                        if (categoryCheck[thisCategoryName]) {
                                            var lastIndex = categoryCheck[thisCategoryName];
                                            categoryCheck[thisCategoryName] = lastIndex + 1;
                                        } else {
                                            categoryCheck[thisCategoryName] = 1;
                                        }
                                        var indexKey = roomData.selectedRoom[i].categoryName + " #" + categoryCheck[thisCategoryName];
                                        if (roomData.selectedRoom[i]["selected"][j]["username"]) {
                                            orderData['shipping'].name[indexKey] = roomData.selectedRoom[i]["selected"][j]["username"];
                                        }
                                        if (roomData.selectedRoom[i]["selected"][j]["adult"]) {
                                            orderData['shipping'].adults[indexKey] = roomData.selectedRoom[i]["selected"][j]["adult"];
                                        } if (roomData.selectedRoom[i]["selected"][j]["child"]) {
                                            orderData['shipping'].children[indexKey] = roomData.selectedRoom[i]["selected"][j]["child"];
                                        } else {
                                            orderData['shipping'].children[indexKey] = "-";
                                        }
                                        if (roomData.selectedRoom[i]["selected"][j]["childAge"]) {
                                            orderData['shipping'].age[indexKey] = roomData.selectedRoom[i]["selected"][j]["childAge"];
                                        }
                                        else {
                                            orderData['shipping'].age[indexKey] = "ex: 4 e 7";
                                        }
                                    }
                                }
                            }
                            //vale form data
                            if (this.hotelType == 'Vale') {
                                orderData['comment_textarea'] = this._navParams.get('presentear_Comment');
                                orderData['name'] = this._navParams.get('presentear_Firstname');
                                orderData['surname'] = this._navParams.get('presentear_Surname');
                                orderData['email'] = this._navParams.get('presentear_Email');
                                orderData['date'] = this._navParams.get('presentear_GiftDate');// full date object
                                orderData['amount'] = String(this._navParams.get('totalPrice'));
                            }
                            orderData['customer_email_field_cc'] = this.payee_email;
                            orderData['payment'] = {
                                method: "son_Moip_standard",
                                forma_pagamento: "CartaoCredito",
                                credito_parcelamento: this.payee_emi['num_emi'] + "|" + (this.payee_emi['intallment'] | 0), //giftPayment.selectedEmi 1|15
                                credito_instituicao: this.payee_cardname, //giftPayment.selectedCard
                                credito_portador_nome: payee_name, //giftPayment.payee_cardname name on card
                                credito_numero: ((payee_card_no) * 1), //giftPayment.payee_card_no
                                credito_expiracao_mes: (this.card_month * 1), //  *1 /giftPayment.payee_card_month
                                credito_expiracao_ano: ((this.card_year.toString().substr(2, 2)) * 1), //   / giftPayment.payee_card_month two digit of year
                                credito_codigo_seguranca: payee_card_cvv, //giftPayment.payee_card_cvv
                                credito_portador_cpftemp: payee_cpf, //giftPayment.payee_cpf
                                redito_portador_telefonetempdd: payee_contact_code, //giftPayment.payee_contact_code
                                credito_portador_telefonetemp: payee_contact_no, //giftPayment.payee_contact_no
                                credito_portador_nascimento1: "",
                                credito_portador_nascimento2: "",
                                credito_portador_nascimento3: ""
                            };
                            this._api.ajaxRequest(this.path, orderData).subscribe((response) => {
                                this.loading.dismiss();
                                this.payment_btn = 'Finalizr a reserva';
                                if (response && response['success'] == true && response['error'] == false) {
                                    if (response['redirect'] && response['redirect.length'] > 0) {
                                        this.payment_btn = 'Finalizr a reserva';
                                        //                                        this._nav.push(OrderSuccess);
                                    }
                                }
                                else {
                                    //                                                                                                                                                                                                                                                                                                                                                        //                                                                                                                                                                                                                                                                                     //                        $state.g                                                                                            //                    }
                                }
                            }, err => {
                                console.log("error")
                            });

                        }
                        else {
                            console.log("has error in form");
                        }
                    }

                }
                else {
                    this.payment_btn = 'Finalizr a reserva';
                }

            });
        }
        else {
            this.creditCard['hasError'] = true;
            if (!this.card_month || !this.card_year) {
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


    }
    presentLoading() {
        this.loading = this.loadingCtrl.create({
            content: '<h3 class="loader-title">Por favor aguarde...</h3><p class="loader-body">Dê-nos alguns segundos... Seu pedido está sendo processado!</p>',
            duration: 500000,
            dismissOnPageChange: false
        });
        this.loading.present();
    }
    backToFlash() {
    }
    onPageWillLeave() {
        //stop redirect caller 
        clearTimeout(this.timeoutCaller);
    }
}
