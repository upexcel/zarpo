import { Events, NavController, Content, NavParams } from 'ionic-angular'
import {Component,ElementRef, ViewChild, forwardRef} from '@angular/core'
import  _ from 'lodash'

import {config} from '../../config'
import {RoomsPipe} from '../../filters/keys/rooms.pipe';
import {AdultChildPipe} from '../../filters/keys/adult-child.pipe';
import {FormatDatePipe} from '../../filters/date/format-date.pipe';

import {Receipt} from '../receipt/receipt'
import {Rxjs} from '../../services/Rxjs'
import {ZarpoNavComponent} from '../../zarpo-nav/zarpo-nav.component';
import {errorhandler} from '../../services/error';
import {CalenderService} from '../../services/calender.service';

import {LocalStorageService} from '../../services/local-storage.service';
import {DateService} from '../../services/date.service';
//import {GuestDetail} from '../guest-detail/guest-detail';
import {HotelFlash} from '../hotel-flash/hotel-flash';

import {calendarService} from './calendar.servise';

import {GuestDetailService} from '../../services/guest-detail.service';
declare var jQuery: any;
export var newStock: any;
import {CheckReceiptService} from '../../services/check-receipt.service';
@Component({
    templateUrl: 'calendar.html',
//    directives: [forwardRef(() => ZarpoNavComponent), hotelList],
//    providers: [calendarService, DateService],
//    pipes: [RoomsPipe, AdultChildPipe, FormatDatePipe]
})

export class calendar {
    @ViewChild(Content) content: Content;
    public zarpoIcon: boolean = false;
    pageTitle: string = this._navParams.get('name');
    bookingResponse: any;
    stockAvailable: any;
    userA: any;
    flashType: string;
    public apiLoader = true;
    responseReady: boolean = false;
    checkinDate: string = "1. Data de entrada";
    checkoutDate: string = "Data de saída";
    public oneDay_MS = 24 * 60 * 60 * 1000;
    public dateNotSelected: boolean = false;
    public step1: boolean = true;
    public step2: boolean = false;
    public step3: boolean = false;
    public step4: boolean = false;
    public step5: boolean = false;

    public customback: any;
    public productid: any;

    public clientPrice: any;
    public header: any = [];

    public minError: boolean;
    public maxError: boolean;
    public accContent: Content;
    public selected_MRP: any = 0;
    public selected_ClientPrice: any = 0;
    public noOfRooms: any = 0;
    public fetchingResponse: boolean = false;
    public step3_btn: string = "Reservar";
    constructor(private elementRef: ElementRef,
        private calendarFunc: calendarService,
        private nav: NavController,
        private local: LocalStorageService,
        private _navParams: NavParams,
        private _ajaxRxjs: Rxjs,
        private _errorhandler: errorhandler,
        private events: Events,
        private _calender: CalenderService,
        private _checkReceiptService: CheckReceiptService,
        private _guestDetailService: GuestDetailService

    ) {

        this._navParams = _navParams;
        this.events.subscribe('custom:created', (item: any) => {
            this.backbutton();
        });
        this.flashType = this._navParams.get('flashType');
        this.update();
       
    }
    ionViewWillEnter() {
        this.activateStep1();
        for (var i = 0; i < this.selectedbookingRooms.length; i++) {
            if (this.selectedbookingRooms[i]) {
                this.subroom[this.selectedbookingRooms[i].id] = "0";
            }
        }
        this.selectedbookingRooms = [];
        this.selected_ClientPrice = 0;
        this.selected_MRP = 0;
    }
    prevDate(startDate: string) {
        var prevDate = "";
        var dateObj = new Date(startDate);
        //will give prev date
        dateObj.setDate(dateObj.getDate());
        var d: any = dateObj.getDate();
        if (d < 10)
            d = "0" + d;
        var m: any = dateObj.getMonth() + 1;
        if (m < 10)
            m = "0" + m;
        var y = dateObj.getFullYear();
        prevDate = y + "-" + m + "-" + d;
        return prevDate;
    }
    checkinMin(date: any) {
        //timestamp for first_checkin date returned from api
        var first_timestamp = this.changePerTimeZone(date).getTime();
        //timestamp for today
        var isja: boolean;
        var today_timestamp = new Date().getTime();
        var ifMonday = new Date().getDay();

        var valid_api_timestamp;
        var minday;
        //ja products
        if (this.flashType == 'Ja') {
            var now_hr = new Date().getHours();
            //if tome is post 18PM
            if (now_hr > 17 || ifMonday == 1)
                minday = (today_timestamp) + (1 * this.oneDay_MS);
            else
                minday = today_timestamp;
        }
        else {
            minday = today_timestamp + (2 * this.oneDay_MS);
        }
        if (minday > first_timestamp)
            return minday;
        else
            return first_timestamp;

    }
    changePerTimeZone(tempDate: any) {
        var test = new Date(tempDate);
        var now_hr = new Date().getHours();
        var now_min = new Date().getMinutes();
        var tempDate_str = tempDate.split("-");
        test.setDate(tempDate_str[2]);
        var newmonth = parseInt(tempDate_str[1]) - 1;
        test.setMonth(newmonth);
        test.setFullYear(tempDate_str[0]);
        test.setHours(now_hr);
        test.setMinutes(now_min);
        return test;
    }
    update() {
        this.productid = this._navParams.get('id')
        this._calender.getCalenderData(this._navParams.get('id')).then((response: any) => {
            if (Object.keys(response).length > 0) {
                this.apiLoader = false;
                this.responseReady = true;
                this.bookingResponse = response;
                this.buildCheckinDatepicker();
                //set subrooms variable to 0
                this.initializeRoomVariable();
            }
            else {
                this._calender.fetchCalenderData(this._navParams.get('id'), this._navParams.get('is_ja')).subscribe((response: any) => {
                    this.apiLoader = false;
                    this.responseReady = true;
                    this.bookingResponse = response;
                    this.buildCheckinDatepicker();
                    //set subrooms variable to 0
                    this.initializeRoomVariable();
                });
            }

        });
    }

    initializeRoomVariable() {
        for (let key in this.bookingResponse.rooms_info.rooms) {
            for (let key1 in this.bookingResponse.rooms_info.rooms[key].subrooms) {
                this.subroom[key1] = "0";
            }
        }
    }
    buildCheckinDatepicker() {
        //hold the dates stock available for checkin
        var selectedDate = "me";
        setTimeout(() => {
            jQuery(this.elementRef.nativeElement).find("#checkin_datepicker").datepicker({
                dateFormat: 'yy-mm-dd',
                minDate: new Date(this.checkinMin(this.bookingResponse.checkin.first_checkin)),
                maxDate: this.changePerTimeZone((this.bookingResponse.checkin.last_checkin)),
                onSelect: (date: any) => {
                    selectedDate = date;
                    this.checkinDate = selectedDate;
                    this.customback = true;
                    this.filterDatesStock();
                    this.dateNotSelected = true;
                    jQuery(this.elementRef.nativeElement).find("#checkout_datepicker").datepicker("destroy");
                    this.activateStep2();
                    // this.checkoutDatepicker();
                },
                beforeShowDay: (d: any) => {
                    var dmy: any;
                    var year = d.getFullYear();
                    var month = (d.getMonth() + 1);
                    if (d.getMonth() < 9)
                        month = "0" + month;
                    var tdate = d.getDate();
                    if (d.getDate() < 10)
                        tdate = "0" + tdate;
                    dmy = year + "-" + month + "-" + tdate;

                    var avl = this.changePerTimeZone(dmy).getTime();
                    //if this date is today date
                    var chk = (this.changePerTimeZone(this.bookingResponse.checkin.first_checkin).getTime()) === avl;
                    //dates are not be in disabled dates of for checkin
                    if (this.bookingResponse.checkin.disabled_dates.indexOf(dmy) === -1 || chk) {
                        //dates should be in stock availble for rooms
                        if (this.bookingResponse.checkin.dates_stock.indexOf(dmy) !== -1 || chk) {
                            if (this.bookingResponse.checkin.min_prices.indexOf(dmy) !== -1) {
                                return [true, "orange", "Available"];
                            } else {
                                return [true, "", "Available"];
                            }
                        }
                        //if date is not in stock
                        else {
                            return [false, "", "disable"];
                        }

                    }

                    //dates in disabled dates of for checkin
                    else {
                        //if dates has stock but greater than today
                        if (this.bookingResponse.checkin.dates_stock.indexOf(dmy) !== -1) {
                            return [true, "ui-datepicker-unselectable unselectable", "Available not selctable"];
                        } else {
                            return [false, "", "disable"];
                        }
                    }
                }
            });
        }, 200);
    }
    //filter the dates for available checkout for selected checkin
    //from checkin date stocks should continously available
    // where find unavailavle break the loop st-accordion st-open
    filterDatesStock() {
    }


    //minimum data for checkout calender
    checkoutMin(date: any) {
        var timestamp = this.changePerTimeZone(date).getTime();
        var test = this.changePerTimeZone(date);
        //find the next day
        test.setDate(test.getDate() + 1);
        // if next will of new month date would be 1
        //so if match true mean selected date is last day of month
        var match = test.getDate() === 1;
        if (match) {
            jQuery(this.elementRef.nativeElement).find("#checkout_datepicker td.ui-datepicker-current-day").addClass("nextDay");
            return new Date(timestamp + (1 * this.oneDay_MS));
        } else {
            return new Date(timestamp);
        }

    }
    checkoutDatepicker() {
        //disable all dates before checkin included
        //min stay for selected user_checkin_date for selected hotel
        var minStay = parseInt(this.bookingResponse.checkout.minStay[this.checkinDate]);
        var checkinTimestamp = this.changePerTimeZone(this.checkinDate).getTime();
        var minStayTimeStamp = minStay * this.oneDay_MS;
        this.stockAvailable = this.filterDatesStock();
        this._calender.getAvailableStock(this.bookingResponse.checkout.room, this.checkinDate, this.flashType).then((result) => {

            this.stockAvailable = result;
            //find possible checkout date
            var selectedDate2 = "222";

            setTimeout(() => {
                jQuery(this.elementRef.nativeElement).find("#checkout_datepicker").datepicker({
                    dateFormat: 'yy-mm-dd',
                    minDate: this.checkoutMin(this.checkinDate),//new Date(checkinTimestamp),
                    maxDate: new Date(this.changePerTimeZone(this.stockAvailable[this.stockAvailable.length - 1]).getTime()),//this.checkoutMax(this.checkinDate),
                    onSelect: (date: any) => {
                        selectedDate2 = date;
                        this.checkoutDate = selectedDate2;
                        this.step2 = false;
                        this.step1 = false;
                        this.step3 = true;
                        this.header = [];
                        this.customback = true;
                        this.newpage();
                    },
                    beforeShow: (i: any, o: any) => {
                    },
                    beforeShowDay: (d: any) => {
                        //get format "yyyy-mm-dd"
                        var dmy;
                        var year = d.getFullYear();
                        var month = (d.getMonth() + 1);

                        if (d.getMonth() < 9)
                            month = "0" + month;
                        var tdate = d.getDate();

                        if (d.getDate() < 10)
                            tdate = "0" + tdate;
                        dmy = year + "-" + month + "-" + tdate;

                        //change selcted date and calender date in default date 
                        //and afterward in timestamp to compare that
                        //that must is after checkin date
                        if (this.flashType == 'Pacote') {
                            var dayReturn = this.rulePacote(dmy, checkinTimestamp, minStayTimeStamp);
                            return dayReturn;
                        }
                        else {
                            var dayReturn = this.ruleHotel(dmy, checkinTimestamp, minStayTimeStamp);
                            return dayReturn;
                        }

                    }
                });
            });

        });
    }
    rulePacote(dmy:any, checkinTimestamp:any, minStayTimeStamp:any) {
        var thisDateTimestamp = this.changePerTimeZone(dmy).getTime();
        //calender date should be greter than checkin date and 
        //on that date stocks should be available 
        if ((thisDateTimestamp > checkinTimestamp)) {
            //dates must satisfing min_stay for checkout
            if ((thisDateTimestamp - checkinTimestamp) <= minStayTimeStamp) {
                // if checkout are available for this day availabe;
                if ((thisDateTimestamp - checkinTimestamp) == minStayTimeStamp) {
                    if (this.bookingResponse.checkout.min_prices.indexOf(dmy) !== -1) {
                        return [true, "orange", "Available"];
                    } else {
                        return [true, "", "Available"];
                    }
                }
                else {
                    return [true, "ui-datepicker-unselectable unselectable", "No Checkout"];
                }
            }
            // min_stay not satisfying it should not be selectable
            else {
                return [false, "", "Disable"];
            }

        }
        // if date smaller than checkin date on having no stocks disable it
        else {
            if (thisDateTimestamp === checkinTimestamp) {
                return [false, "selectedDate", "Check_in"];
            } else {
                return [false, "", "Disable"];
            }

        }
    }
    ruleHotel(dmy:any, checkinTimestamp:any, minStayTimeStamp:any) {
        var thisDateTimestamp = this.changePerTimeZone(dmy).getTime();
        //calender date should be greter than checkin date and 
        //on that date stocks should be available 
        if ((thisDateTimestamp > checkinTimestamp) && (this.stockAvailable.indexOf(dmy) !== -1)) {
            //dates must satisfing min_stay for checkout
            if ((thisDateTimestamp - checkinTimestamp) >= (minStayTimeStamp - 10 * 60 * 60 * 1000)) {
                // if checkout are available for this day availabe;
                if (parseInt(this.bookingResponse.checkout.checkout[dmy]) > 0) {
                    if (this.bookingResponse.checkout.min_prices.indexOf(dmy) !== -1) {
                        return [true, "orange", "Available"];
                    } else {
                        return [true, "", "Available"];
                    }

                }
                // if checkout not available it should not be selectable
                else {
                    return [true, "ui-datepicker-unselectable unselectable", "No Checkout"];
                }
            }
            // min_stay not satisfying it should not be selectable
            else {
                return [true, "ui-datepicker-unselectable unselectable", "No Checkout"];
            }


        }
        // if date smaller than checkin date on having no stocks disable it
        else {
            if (thisDateTimestamp === checkinTimestamp) {
                return [false, "selectedDate", "Check_in"];
            } else {
                return [false, "", "Disable"];
            }

        }
    }
    //working
    checkoutMax(date: any) {
        //In case of pacote
        if (this.flashType == 'Pacote') {
            var maxStay = parseInt(this.bookingResponse.checkout.maxStay[this.checkinDate]);
            //get Date for max stay count
            var maxStayDate = (this.changePerTimeZone(this.checkinDate)).getTime() + maxStay * this.oneDay_MS;
            return new Date(maxStayDate);
        }
        //In case of hotel
        else {
            var selectedTimestamp = (this.changePerTimeZone(date).getTime());
            var max;
            var roomstock = this.bookingResponse.checkout.room;
            var keys = Object.keys(roomstock);
            var last = keys[keys.length - 1];
            max = this.changePerTimeZone(last);
            max.setDate(max.getDate() + 1);
            return max;
        }
    }
    backbutton() {
        if (this.step3) {
            this.activateStep2();
        } else if (this.step2) {
            this.activateStep1();
        } else {
        }
    }
    activateStep1() {

        this.checkinDate = "1. Data de entrada";
        this.checkoutDate = "Data de saída";

        this.step1 = true;
        this.step2 = false;
        this.step3 = false;
        this.customback = false;
        this.step4 = false;
        this.dateNotSelected = false;
        this.step3_btn = "Reservar";
        if (this.responseReady) {
            jQuery(this.elementRef.nativeElement).find("#checkin_datepicker").datepicker("refresh");
            //to attach this change to angular scope
            this.buildCheckinDatepicker();
            //            $scope.$evalAsync();
        }

    }
    activateStep2() {
        if (this.checkinDate === "1. Data de entrada") {
            return false;
        } else {
            this.step1 = false;
            this.step2 = true;
            this.step3 = false;
            this.customback = true;
            this.step4 = false;
            this.checkoutDate = "Data de saída";
            this.dateNotSelected = true;
            jQuery(this.elementRef.nativeElement).find("#checkout_datepicker").datepicker("destroy");
            this.checkoutDatepicker();
        }

    }
    activateStep3() {
        this.step1 = false;
        this.step2 = false;
        this.step3 = true;
        this.header = [];

        this.step4 = false;
        this.customback = true;

    }
    activateStep4() {
        this.step1 = false;
        this.step2 = false;
        this.step3 = false;
        this.step4 = true;
        this.customback = false;

    }
    activateStep5() {
        this.step5 = true;

    }

    public Available_Rooms_In_Hotel = [];
    public pId: number;
    public location: string;
    public name: string;
    public subroom = [];
    public selectedbookingRooms = [];
    public attribute: any;

    @ViewChild('anchor') anchor: any;

    newpage() {
        this.local.getValue('rules').then((data) => {
            if (data.checkin) {
                this.attribute = "Hotel";
            } else {
                this.attribute = "Pacote";
            }
        });
        this.Available_Rooms_In_Hotel = this.getAvailableRooms(this.checkinDate, this.checkoutDate);
    }

    getAvailableRooms(checkin: any, checkout: any) {
        var availableRooms = [];
        //get date one less than checkout to get room continouty
        checkout = this.calendarFunc.timeToDate(this.changePerTimeZone(checkout).getTime() - this.oneDay_MS);
        var roomsOnCheckin = this.bookingResponse.checkout.room[checkin].split(",");
        var roomsOnCheckout = this.bookingResponse.checkout.room[checkout].split(",");
        if (roomsOnCheckout.length > 0) {
            availableRooms = roomsOnCheckout.filter(function(n) {
                return roomsOnCheckin.indexOf(n) !== -1;
            });
        } else {
            console.log("error: No rooms on checkout");
        }
        // now availableRooms hold rooms array of continously 
        // vailable romms for client from checkin to checkout
        // checkout not included
        return availableRooms;
    }
    //get respective price of hotel for each day from checkin to checkout 
    //then find out its avg as client price
    getClientPrice(id: any) {
        var tempClientPrice = 0;
        var counter = (this.calendarFunc.changePerTimeZone(this.checkinDate)).getTime();

        while (counter < (this.calendarFunc.changePerTimeZone(this.checkoutDate)).getTime()) {
            var keySeq = this.fetchDate(counter);

            var key = id + "_" + keySeq;
            tempClientPrice = tempClientPrice + parseInt(this.bookingResponse.checkout.priceClient[key]);
            counter = counter + this.oneDay_MS;//to have next date
        }
        var stayForDay = this.getNights();
        this.clientPrice = Math.ceil(tempClientPrice / stayForDay);
        if (this.flashType == 'Pacote') {
            return Math.ceil(this.clientPrice * stayForDay);
        }
        else {
            return this.clientPrice;
        }
    };
    getNights() {
        var stay = this.changePerTimeZone(this.checkoutDate).getTime() - this.changePerTimeZone(this.checkinDate).getTime();
        var night = stay / this.oneDay_MS;
        return night;
    };
    public d: any; public m: any;
    fetchDate(timestamp: any) {
        var x = new Date(timestamp);
        this.d = x.getDate();
        if (this.d < 10)
            this.d = "0" + this.d;
        this.m = x.getMonth() + 1;
        if (this.m < 10)
            this.m = "0" + this.m;
        var y = x.getFullYear();
        var yourdate = y + "-" + this.m + "-" + this.d;
        return yourdate;
    }
    showAvailableRooms(id: any) {
        if (this.Available_Rooms_In_Hotel.indexOf(id) !== -1) {
            return true;
        } else {
            return false;
        }

    };
    scrollToTop() {
        this.content.scrollToTop();
    }
    scrollToAnchor(anchor_id: string) {
        var element = jQuery(this.elementRef.nativeElement).find(anchor_id);

        var anchorPos = element[0]['offsetTop'];
        this.content.scrollTo(0, anchorPos, 500);
    }
    toggleGroup(room: any) {
        var group = room.room_id;
        //group: rooms.room_id
        //model:is present
        //subrooms
        var anchor_id = "#room_" + group;
        var headdetail = "header_" + group;
        var divdetail = "#subroom_" + group;

        if (!this.header[group]) {
            this.header[group] = true;
            setTimeout(() => {
                this.scrollToAnchor(anchor_id);
            }, 200);
        } else {
            this.header[group] = !this.header[group];
            setTimeout(() => {
                this.scrollToTop();
            }, 200);
        }
        //make subrooms of closed rooms seletion zero
        if (this.header[group] === false) {
            var searchElement =  jQuery("select");//remeber
            var selectArray =  jQuery(divdetail).find(searchElement);//remember
            for (var i = 0; i < selectArray.length; i++) {
                var target = "#" + selectArray[i].id;
                this.subroom[selectArray[i].id] = "0";
                //                    $scope.$evalAsync();
                //                    $(target);
                var optval =  jQuery(target).children('option:first')
                    .attr({
                        'value': '0',
                        'label': '0',
                        'selected': 'selected'
                    });
                this.popOutRoom(selectArray[i].id);
            }

        }
        // slide effect
        jQuery(divdetail).slideToggle("fast");

    };
    popOutRoom(id:any) {
        for (var i = 0; i < this.selectedbookingRooms.length; i++) {
            if (this.selectedbookingRooms[i].id == id) {
                this.selectedbookingRooms.splice(i, 1);
                this.updatePrice();
            }
        }

    }
    getStock(id:any) {
        var availableStock;
        var key1 = id + "_" + this.checkinDate;
        var key2 = id + "_" + this.checkoutDate;
        var initialStock = this.bookingResponse.checkout.stock[key1];
        var finalStock = this.bookingResponse.checkout.stock[key2];
        if (finalStock < initialStock)
            availableStock = finalStock;
        else
            availableStock = initialStock;
        if (availableStock > 5)
            availableStock = 5;
        return availableStock;
    };
    convertArray(data: any) {
        return new Array(parseInt(data));
    };
    //function after selecting room and recording its detail
    getRoom(subroom:any, value:any, category:any, categoryNmae:any, superAttribute:any) {
        if (this.minError || this.maxError) {
            this.minError = false;
            this.maxError = false;
        }
        var obj: any = {};
        obj.id = subroom.s_room_id;
        obj.name = subroom.s_name;
        obj.rooms = value;
        obj.category = category;
        obj.categoryName = categoryNmae;
        obj.stock = this.getStock(subroom.s_room_id);
        obj.clientPrice = this.getClientPrice(subroom.s_room_id);
        obj.MRP = this.getMRP(subroom.s_room_id);
        obj.adult = subroom.adults;
        obj.kid = subroom.kids;
        obj.superAttribute = superAttribute;
        var index = this.ifOldSelection(subroom.s_room_id);
        // if pre entered entry found update the data
        if (index !== -1) {
            if (value > 0) {
                this.selectedbookingRooms.splice(index, 1);
                this.selectedbookingRooms.push(obj);
            } else {
                this.selectedbookingRooms.splice(index, 1);
            }
        }
        //else push as new object
        else {
            this.selectedbookingRooms.push(obj);
        }
        this.updatePrice();
    };
    getMRP(id: any) {
        var key = id + "_" + this.checkinDate;
        return this.bookingResponse.checkout.priceRef[key];
    };
    ifOldSelection(id:any) {
        var foundAt = -1;
        for (var i = 0; i < this.selectedbookingRooms.length; i++) {
            if (this.selectedbookingRooms[i].id === id) {
                foundAt = i;
                break;
            }
        }
        return foundAt;
    }
    addbookingRooms() {
        this.apiLoader = true;
        this.customback = false;
        this.step3_btn = "Aguarde";
        this.pId = this._navParams.get('id'),
            this.name = this._navParams.get('name'),
            this.location = this._navParams.get('location')
        this.fetchingResponse = true;
        this.step3_btn = "Aguarde";
        var selected_rooms = 0;
        for (var i = 0; i < this.selectedbookingRooms.length; i++) {
            var same_category_room = 0;
            selected_rooms = selected_rooms + parseInt(this.selectedbookingRooms[i].rooms);
            for (var j = 0; j < this.selectedbookingRooms.length; j++) {
                //if has multiple rooms of same category
                if (this.selectedbookingRooms[i].category === this.selectedbookingRooms[j].category) {
                    same_category_room = same_category_room + parseInt(this.selectedbookingRooms[j].rooms);

                }

            }
            if (same_category_room > this.selectedbookingRooms[i].stock) {
                this.maxError = true;
                this.step3_btn = "Reservar";
                this.apiLoader = false;
                break;
            } else {
                this.maxError = false;
            }

        }
        if (selected_rooms < 1 || this.maxError == true) {
            if (selected_rooms < 1) {
                this.step3_btn = "Reservar";
                this.minError = true;
                this.apiLoader = false;
                this.fetchingResponse = false;
            }
            return false;
        } else {
            // verify the calender data at booking
            var calenderData: any = {};
            calenderData.checkin_day = new Date(this.changePerTimeZone(this.checkinDate).getTime()).getDate();
            calenderData.checkin_month = new Date(this.changePerTimeZone(this.checkinDate).getTime()).getMonth();
            calenderData.checkin_year = new Date(this.changePerTimeZone(this.checkinDate).getTime()).getFullYear();
            calenderData.checkout_day = new Date(this.changePerTimeZone(this.checkoutDate).getTime()).getDate();
            calenderData.checkout_month = new Date(this.changePerTimeZone(this.checkoutDate).getTime()).getMonth();
            calenderData.checkout_year = new Date(this.changePerTimeZone(this.checkoutDate).getTime()).getFullYear();
            calenderData.lastcheckout = this.getHumanDate(this.bookingResponse.checkout.last_checkin);
            calenderData.product = this.pId;
            calenderData.related_product = "";
            calenderData.total_price = this.selected_ClientPrice; //client price
            calenderData.total_ref_price = this.selected_MRP; //display price
            calenderData.expproductId = 6118;
            calenderData.comment_textarea = "";//CheckSelected.get().specialMsg;
            calenderData.subroom = {};
            calenderData.super_attribute = {};
            var roomData = this.selectedbookingRooms;
            var categoryCheck = {};
            for (var i = 0; i < Object.keys(roomData).length; i++) {
                var roomId = roomData[i].category;
                var superAttrib = roomData[i].superAttribute;
                var su_key;
                var su_value;
                for (var key in roomData[i].superAttribute) {
                    su_key = key;
                    su_value = roomData[i].superAttribute[key];
                }
                if (calenderData.super_attribute[su_key] !== undefined) {
                    var preValue;
                    if (calenderData.super_attribute[su_key][su_value] !== undefined) {
                        preValue = parseInt(calenderData.super_attribute[su_key][su_value]);
                        calenderData.super_attribute[su_key][su_value] = preValue + parseInt(roomData[i].rooms);
                    } else {
                        calenderData.super_attribute[su_key][su_value] = parseInt(roomData[i].rooms);

                    }
                } else {
                    calenderData.super_attribute[su_key] = {};
                    calenderData.super_attribute[su_key][su_value] = parseInt(roomData[i].rooms);
                }
                //check if already initialized
                if (calenderData.subroom[roomId] !== undefined) {

                } else {
                    calenderData.subroom[roomId] = {};
                }

                var sub_roomId = this.splitId(roomId, roomData[i]["id"]);
                calenderData.subroom[roomId][sub_roomId] = this.calculateSubRoom(roomData[i]["id"]);
                var thisCategoryName = roomData[i].categoryName;
                for (var j = 0; j < Object.keys(roomData[i]).length; j++) {
                    if (categoryCheck[thisCategoryName] !== undefined) {
                        var lastIndex = categoryCheck[thisCategoryName];
                        categoryCheck[thisCategoryName] = lastIndex + 1;
                    } else {
                        categoryCheck[thisCategoryName] = 1;
                    }
                }
            }
            //error
            calenderData.total_price = 2000;
            //verify booking data availablity
            this._ajaxRxjs.ajaxRequest("book", calenderData).subscribe((response: any) => {
                if (response && response.success == true && response.error == false) {
                    //modified set data of checkout register
                    var RegisterData = {
                        selectedRoom: this.selectedbookingRooms
                    };
                    //                    CheckRegister.set(CheckRegisterData);
                    //modified
                    console.log("this.bookingResponse.checkout.last_checkin * 1000",this.bookingResponse.checkout.last_checkin)
                    console.log("name",this.name);
                    console.log("super_attribute",)
                    var receiptData = {
                        productType: this.flashType,
                        productId: this.pId,
                        checkInDate: this.checkinDate,
                        checkOutDate: this.checkoutDate,
                        noOfRooms: this.noOfRooms,
                        location: this.location,
                        name: this.name,
                        giftPrice: this.selected_ClientPrice,
                        displayPrice: this.selected_MRP,
                        lastCheckOut: this.bookingResponse.checkout.last_checkin,
                        super_attribute:this._navParams.get("super_attribute")
                    };
                    this._checkReceiptService.setData(receiptData);
                    this._guestDetailService.setData(RegisterData);
                    //                    CheckReceipt.set(receiptData);
                    this.nav.push(Receipt, receiptData);
                    this.apiLoader = false
                    this.fetchingResponse = false;
                } else {
                    //order not verified, expired old data show error msg
                    this.step3_btn = "Reservar";
                    this.maxError = true;
                    this.apiLoader = false;
                    this.fetchingResponse = false;
                    setTimeout(() => {
                        this.nav.push(HotelFlash, { hotelType: this.flashType });
                        //delete local data and fetch items

                    }, 2 * 1000);
                }
            }, () => {
                this.fetchingResponse = false;
                console.log("booking rejected");
            }, () => {
                this.fetchingResponse = false;
                console.log("booking error");
            });

        }

    };
    calculateSubRoom(id:any) {
        var total = 0;
        var roomData = this.selectedbookingRooms;
        for (var i = 0; i < Object.keys(roomData).length; i++) {
            if (roomData[i]["id"] === id) {
                total = total + roomData[i]["rooms"] * 1;
            }
        }
        return total;
    }
    updatePrice() {
        this.selected_MRP = 0;
        this.selected_ClientPrice = 0;
        this.noOfRooms = 0;
        for (var i = 0; i < this.selectedbookingRooms.length; i++) {
            this.noOfRooms = this.noOfRooms + parseInt(this.selectedbookingRooms[i].rooms);
            this.selected_MRP = this.selected_MRP + (parseInt(this.selectedbookingRooms[i].MRP) * parseInt(this.selectedbookingRooms[i].rooms));
            this.selected_ClientPrice = this.selected_ClientPrice + (parseInt(this.selectedbookingRooms[i].clientPrice) * parseInt(this.selectedbookingRooms[i].rooms));
        }
        if (this.flashType == 'Pacote') {
            this.selected_MRP = this.selected_MRP;
            this.selected_ClientPrice = this.selected_ClientPrice;
        }
        else {
            this.selected_MRP = this.selected_MRP * this.getNights();
            this.selected_ClientPrice = this.selected_ClientPrice * this.getNights();
        }

        //        this.events.publish('rs:booking', { clientprice: this.selected_ClientPrice, mrp: this.selected_MRP, selectedRomm: this.selectedbookingRooms });

    }
    splitId(rid:any, sid:any) {
        var cutLetter = rid.length;
        var result = sid.slice(cutLetter, sid.length);
        return result;
    }
    public da: any; public mo: any;
    getHumanDate(timestamp:any) {
        var x = new Date(timestamp);
        this.da = x.getDate();
        if (this.da < 10) {
            this.da = "0" + this.da;
            this.mo = x.getMonth() + 1;
            if (this.mo < 9)
                this.mo = "0" + this.mo;
            var y = x.getFullYear();
            var todaydate = y + "-" + this.mo + "-" + this.da;
            return todaydate;
        }
    }

}

