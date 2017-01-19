import { Content, Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Keyboard } from 'ionic-native';
declare var $: any;
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Injectable()
@Directive({
    selector: '[focus]'
})
export class FocusComponent {
    @Input() focus: string;
    currentGroup: string;
    private el: ElementRef;
    resize;
    elementOffset;
    distance;
    keyHeight = 260;
    constructor(platform: Platform, private _el: ElementRef) {
        this.el = this._el;
        this.resize = platform.height();
        Keyboard.onKeyboardHide().subscribe(() => {
            $('.scroll-content').animate({
                scrollTop: 0
            }, 100);
        });
    }
    @HostListener('focus', ['$event']) onFocus(e) {
        var srcElement = this.el;//.nativeElement
        var count = 0;
        this.elementOffset = srcElement.nativeElement['offsetTop'];
        Keyboard.onKeyboardShow().subscribe((ee) => {
            //            this.elementOffset = 0;
            if (count == 0) {
                ++count;
                this.distance = 0;
                this.keyHeight = ee.keyboardHeight;
                this.distance = (this.resize - (this.keyHeight + 50));
                if (this.distance > this.elementOffset) { }
                else {
                    var scroll = this.elementOffset - this.distance;
                    $('.scroll-content').animate({
                        scrollTop: scroll + 40
                    }, 100);
                }
            }
        })
    }

}


