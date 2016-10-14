import { Pipe, PipeTransform } from '@angular/core';
//import {DomSanitizationService} from '@angular/platform-browser';
@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe {
//    constructor(private sanitizer: DomSanitizationService) {
//        this.sanitizer = sanitizer;
//    }
//    transform(style) {
//        return this.sanitizer.bypassSecurityTrustHtml(style);
//    }
}