import { Directive, ElementRef, HostListener, Input } from '@angular/core';
@Directive({
    selector: '[noSpace]'
})
export class NoSpaceDirective {
    private el: ElementRef;
    returnClose = true;
    onReturn = true;
    @Input() noSpace: string;
    constructor(private _el: ElementRef) {
        this.el = this._el;
    }
    @HostListener('keydown', ['$event']) onKeyDown(e) {
        if ((e.which == 32 || e.which == 229) && this.el.nativeElement.value.slice(-1) === " ") {
            e.preventDefault();
            return;
        }
    }
}
