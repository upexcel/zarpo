import {Slides} from 'ionic-angular';
import {Component, Input, ViewChild} from '@angular/core';
import {ImageHeightService} from '../services/image-height.service';

@Component({
    selector: "zarpo-slider",
    templateUrl: 'zarpo-slider.html',
    providers: [ImageHeightService]
})

export class ZarpoSliderComponent {
    @Input() zarpoSlides: any;
    @Input() zarpoCredit: string;
    mySlideOptions: any;
    imgHeight: string;
    @ViewChild('mySlider') slider: Slides;
    num: any = 0;
    constructor(private _img: ImageHeightService) {
        this.getFlashImgHeight();
        this.mySlideOptions = {
            autoplay: 3000,//time on screen
            direction: 'horizontal',
            initialSlide: 0,
            pager: false,
            loop: true,
            speed: 500,//speed of transititon from one slide to another
            onlyExternal: false,
            onInit: (slides: any) => {
                this.slider = slides;
            }

        };

    }
    getFlashImgHeight() {
        this._img.getSliderHeight().then((response) => {
            this.imgHeight = response + "px";
        });
    }

}


