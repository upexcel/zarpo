import {Component, Input, OnChanges, Output, EventEmitter} from '@angular/core';
import {Events, NavController} from 'ionic-angular';

@Component({
    selector: "date-picker",
    templateUrl: 'date-picker.html',
})

export class DatePickerComponent {
    @Input() ifFormSubmit: boolean = false;
    @Input() ifHasError: boolean = true;
    @Output() monthSelected: EventEmitter<Object> = new EventEmitter();
    @Output() yearSelected: EventEmitter<Object> = new EventEmitter();

    selectedMonth: string;
    selectedYear: string;
    public years: any = [];
    public monthLabels: any = [];
    constructor(
        private _nav: NavController,
        public _events: Events
    ) {
        this.monthLabels = [
            { month: '1', label: 'Jan' },
            { month: '2', label: 'Fev' },
            { month: '3', label: 'Mar' },
            { month: '4', label: 'Abr' },
            { month: '5', label: 'Mai' },
            { month: '6', label: 'Jun' },
            { month: '7', label: 'Jul' },
            { month: '8', label: 'Ago' },
            { month: '9', label: 'Set' },
            { month: '10', label: 'Out' },
            { month: '11', label: 'Nov' },
            { month: '12', label: 'Dez' }
        ]

        var dateObj = new Date();
        var curYear = dateObj.getFullYear();
        // curYear = parseInt(curYear);
        var j = curYear;
        for (j; j <= curYear + 20; j++) {
            this.years.push(j);
        }
    }
    monthChanged(m) {
        console.log(m);
        this.monthSelected.emit({ 'month': m });
    }
    yearChanged(y) {
        console.log(y);
        this.yearSelected.emit({ 'year': y });
    }

}


