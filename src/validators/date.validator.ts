import {FormControl} from '@angular/forms'; 
export class DateValidator {
   static  isValidDate(control: FormControl){
        console.log('date validation called');
       
//        if (control.value != "" && ((control.value.length <= 5 || !EMAIL_REGEXP.test(control.value)) || (fakeEmails.indexOf(control.value) > -1) )) {
//            return { "Please provide a valid email": true };
//        }
        return null;
    }

}