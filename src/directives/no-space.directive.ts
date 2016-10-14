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
        console.log(this.el);
    }
    @HostListener('keydown', ['$event']) onKeyDown(e) {
//        console.log(e);
//        console.log(this.el.nativeElement.value.slice(-1));
//        if ((e.which == 32 || e.which == 229) && this.el.nativeElement.value.slice(-1) === " ") {
//            e.preventDefault();
//            console.log(this.el.nativeElement.value.length);
//            return;
//        }
    }
}


//
//('textarea', function ($timeout) {
//            return {
//                restrict: 'E',
//                scope: {
//                    'returnClose': '=',
//                    'onReturn': '&',
//                    'ngModel': "=ngModel"
//                },
//                link: function (scope, element, attr, ngModel) {
//
//                    element.bind('keydown', function (e) {
//                        if (e.which == 32 && scope.ngModel.slice(-1) === " ") {
//                            e.preventDefault();
//                            return;
//                        }
//                        if (e.which == 13) {
//                            e.preventDefault();
//                            if (scope.returnClose) {
//                                element[0].blur();
//                            }
//                            if (scope.onReturn) {
//                                $timeout(function () {
//                                    scope.onReturn();
//                                });
//                            }
//                        }
//                        if (e.which == 9) {
//                            if (element.next()[0]) {
//                                element.next()[0].focus();
//                            }
//                        }
//                    });
//                }
//            };
//        })