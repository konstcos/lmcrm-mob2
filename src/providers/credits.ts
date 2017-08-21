import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Api} from './api';
import 'rxjs/add/operator/map';

/*
 Generated class for the Credits provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class Credits {

    constructor(public http: Http,
                public api: Api) {
        console.log('Hello Credits Provider');
    }


    /**
     * Получение данных агента по заявкам
     *
     */
    getStatements(data: any) {
        return this.api.post('api/statements/get', data);
    }


    /**
     * Состояние пользователя по деньгам
     *
     */
    getCreditsData(data: any) {
        return this.api.post('api/credits/data', data);
    }


    /**
     * Получение транзакций пользователя
     *
     */
    getTransactions(data: any){
        return this.api.post('api/credits/transactions', data);
    }


    /**
     * Создание запроса на ввод денег
     *
     */
    createReplenishment(data: any) {
        return this.api.post('api/createReplenishment', data);
    }


    /**
     * Создание запроса на вывод денег
     *
     */
    createWithdrawal(data: any) {
        return this.api.post('api/credits/create/withdrawal', data);
    }


    /**
     * Оплата запроса на ввод денег
     *
     */
    payReplenishmentBankTransaction(data: any) {
        return this.api.post('api/replenishment/bank/transaction/pay', data);
    }


    /**
     * Получить данные по вводу денег
     *
     */
    getReplenishmentData() {
        return this.api.post('api/credits/replenishment/data/get', {});
    }


    /**
     * Получение данных на оплату запроса по кредитной карте
     *
     */
    getDetailCreditCardPayment(data: any) {
        return this.api.post('api/credit/detail/card/payment', data);
    }


    /**
     * Оплата через кредитную карту
     *
     */
    creditCardPayment(data: any) {
        return this.api.post('api/credit/card/payment', data);
    }


    /**
     * Получить данные по выводу денег
     *
     */
    getWithdrawalData() {
        return this.api.post('api/credits/withdrawal/data/get', {});
    }


    /**
     * Получить данные по выводу денег
     *
     */
    cancelStatement(data: any) {
        return this.api.post('api/credits/payment/cancel', data);
    }



}
