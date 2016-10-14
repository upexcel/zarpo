import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PaymentService {
    constructor() {
    }
    installment(amount: number) {
        var emiSet: any = [];
        for (var emi = 1; emi <= 12; emi++) {
            if (emi > 0 && emi < 4) {
                var v: any = amount / emi;
                var sum: any = v.toFixed(2) * emi;
                var obj = {
                    intallment: v.toFixed(2),
                    total: sum.toFixed(2),
                    num_emi: emi
                }
                emiSet.push(obj);
            } else {
                var p: any = amount;
                var r = .0199;
                var t: any = 1.0199;
                var n = emi;
                var pr = p * r;
                var rn = Math.pow(t, n);
                var prn = pr * rn;
                var div = rn - 1;
                var v: any = prn / div;
                var sum: any = v * emi;
                var obj = {
                    intallment: v.toFixed(2),
                    total: sum.toFixed(2),
                    num_emi: emi
                }
                emiSet.push(obj);
            }
        }
        return Promise.resolve(emiSet);
    }

}
