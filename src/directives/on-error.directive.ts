import { Directive, ElementRef, HostListener, Input, Renderer } from '@angular/core';
@Directive({
    selector: '[onError]',
})
export class OnErrorDirective {
    private el: ElementRef;
    @Input() ifFormSubmitted: any;
    constructor(private _el: ElementRef, public renderer: Renderer) {
        this.el = this._el;
    }
    @HostListener('keydown', ['$event']) onKeyDown(e) {
        //check if form has submitted and element has ng-invalid class then
        //remove red border and mark formsubmit false
        this.ifFormSubmitted = false;
        var srcElement = this.el.nativeElement;
        //if form submit button is pressed
        if (this.ifFormSubmitted == false) {
            if (srcElement.classList.contains('errormsg')) {
                srcElement.classList.remove('errormsg');
            }
            //outout an event to chnage form submit status

        }
        return;
    }
    @HostListener('focus', ['$event']) onFocus(e) {
        this.renderer.setElementClass(this._el.nativeElement, 'an-focus', true);
        return;
    }
    @HostListener('blur', ['$event']) onblur(e) {
        this.renderer.setElementClass(this._el.nativeElement, 'an-focus', false);
        return;
    }

}
