import { Directive, ElementRef, HostListener, Input } from '@angular/core';
@Directive({
    selector: '[onReturn]'
})
export class OnReturnDirective {
    private el: ElementRef;
    @Input() onReturn: string;
    constructor(private _el: ElementRef) {
        this.el = this._el;
    }
    @HostListener('keydown', ['$event']) onKeyDown(e) {
        if ((e.which == 13 || e.keyCode == 13)) {
            e.preventDefault();
            if (e.srcElement.nextElementSibling) {
                e.srcElement.nextElementSibling.focus();
            }
            else{
                console.log('close keyboard');
            }
            return;
        }

//        if ((e.which == 32)) {
//            e.preventDefault();
//            if (e.srcElement.nextElementSibling) {
//                e.srcElement.nextElementSibling.focus();
//            }
//            else{
//                console.log('close keyboard');
//            }
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