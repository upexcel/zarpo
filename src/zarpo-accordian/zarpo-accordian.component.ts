import {Content} from 'ionic-angular';
import {Component, Input, ViewChild} from '@angular/core';
import {KeysPipe} from '../filters/keys/keys.pipe';
import {SafeHtmlPipe} from '../filters/pacote/safe-html.pipe';

@Component({
    selector: "zarpo-accordian",
    templateUrl: 'zarpo-accordian.html',
//    pipes: [KeysPipe, SafeHtmlPipe]
})
export class ZarpoAccordianComponent {
    @ViewChild('anchor') anchor: any;
    @Input() accData: any;
    @Input() ifProductClosed: boolean;
    @Input() accContent: Content;
    currentGroup: string;
    shownGroup: string;
    constructor() {
    }
    scrollToTop(duration) {
        this.accContent.scrollToTop(duration);
    }
    scrollToAnchor() {
        var anchorPos = this.anchor.nativeElement['offsetTop'];
        let off = anchorPos - 150;

        this.accContent.scrollTo(0, off, 500);
    }
    toggleGroup(group: any) {
        this.currentGroup = "xyz";
        if (this.isGroupShown(group)) {
            this.shownGroup = null;
            // set the location.hash to the id of
            // the element you wish to scroll to.
            if (true) {
                setTimeout(() => {
                    this.scrollToTop(400);
                }, 100)
            }
        } else {
            this.shownGroup = group;
            if (true) {
                setTimeout(() => {
                    this.scrollToAnchor();
                }, 100)
            }
        }
    }
    isGroupShown(group: any) {
        return this.shownGroup === group;
    };
    hideTitle(title: any) {
        title = title.trim();
        if ((title === 'O que est&#225; incluso' || title === 'A Garantia Zarpo Pacote:' ||
            title === "O Pacote inclui:") && this.ifProductClosed === true) {
            return false;
        } else {
            return true;
        }
    };

}


