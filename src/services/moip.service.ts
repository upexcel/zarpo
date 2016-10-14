import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
declare var moip: any;

@Injectable()
export class MoipService {
    moipObj: any;
    creditCard: {} = {};
    constructor() {
        this.moipObj = moip;
    }
    validateCreditCard(card: {}) {
        var cardBrand: string;
        var ifCardValid = this.moipObj.creditCard.isValid(card['payee_card_no']);
        if (ifCardValid) {
            cardBrand = this.moipObj.creditCard.cardType(card['payee_card_no']);
            var isSecurityValid = this.moipObj.creditCard.isSecurityCodeValid(card['payee_card_no'], card['security']);
            var isExpiryValid = this.moipObj.creditCard.isExpiryDateValid(card['expiryMM'], card['expiryYY']);
        }
        var processedCard = {};
        if (cardBrand) {
            processedCard['cardBrand'] = cardBrand['brand'];
        } else {
            this.creditCard['hasError'] = true;
            this.creditCard['payee_card_no'] = false;
        }
        !ifCardValid ? processedCard['ifCardValid'] = false : processedCard['ifCardValid'] = ifCardValid;
        !isSecurityValid ? processedCard['isSecurityValid'] = false : processedCard['isSecurityValid'] = isSecurityValid;
        !isExpiryValid ? processedCard['isExpiryValid'] = false : processedCard['isExpiryValid'] = isExpiryValid;
        return Promise.resolve(processedCard);
    }



}
