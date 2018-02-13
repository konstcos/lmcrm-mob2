import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Api} from './api';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


/*
 Generated class for the Open provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class Open {

    constructor(public http: Http,
                public api: Api) {
    }


    /**
     * Получение с сервера итемов открытых лидов
     */
    get(data: any) {
        return this.api.post('api/opened', data);
    }


    /**
     * Получение с сервера данных открытого лида
     */
    loadOpenLeadData(openLeadId: number) {
        return this.api.post('api/data/opened/lead', {openLeadId: openLeadId});
    }


    /**
     * Получение с сервера данных открытого лида
     */
    loadOpenLeadDataByLeadId(leadId: number) {

        console.log(leadId);

        return this.api.post('api/data/opened/lead', {leadId: leadId});
    }


    /**
     * Поиск лидов
     */
    search(data: any) {
        return this.api.post('api/lead/search', data);
    }


    /**
     * Смена статуса открытого лида
     */
    changeStatus(data: any) {
        return this.api.post('api/changeOpenLeadStatus', data);
    }


    /**
     * Получение статусов по открытому лиду
     */
    getOpenLeadStatuses(data: any) {
        return this.api.post('api/lead/open/statuses/get', data);
    }


    /**
     * Смена статуса открытого лида
     */
    archive(data: any) {
        return this.api.post('api/lead/open/archive', data);
    }


    /**
     * Смена статуса открытого лида
     */
    getDealData(data: any) {
        return this.api.post('api/deal/data', data);
    }


    /**
     * Загрузка файла
     */
    uploadFile(data: any) {
        return this.api.post('api/file/upload', data);
    }


    /**
     * Удаление файла
     */
    deleteFile(data: any) {
        return this.api.post('api/file/delete', data);
    }


    /**
     * Данные по проплате за сделку с кошелька
     */
    paymentDealWalletData(data: any) {
        return this.api.post('api/deal/wallet/payment/data', data);
    }


    /**
     * Проплата за сделку через системный кошелек
     */
    paymentDealWalletMake(data: any) {
        return this.api.post('api/deal/wallet/payment/make', data);
    }


    /**
     * Создание следующей проплаты по сделке
     */
    dealNextPayment(data: any) {
        return this.api.post('api/deal/next/payment', data);
    }


    /**
     * Завершение сделки с несколькими платежами
     */
    closeFewPaymentDeal(data: any) {
        return this.api.post('api/deal/few/payments/close', data);
    }


    /**
     * Проплата сделки банковской транзакцией
     */
    paymentDealBankTransaction(data: any) {
        return this.api.post('api/deal/bank/payment/make', data);
    }


    /**
     * Получение данных по оплате сдлеки кредитной карточкой
     */
    getDataForCreditCardTransaction(data: any) {
        return this.api.post('api/deal/credit/card/payment/data', data);
    }


    /**
     * Делает денежную транзакцию через кредитную карточку
     * (по сути, получает данные с invoice4u и вставляет их в iFrame)
     */
    makeCreditCardTransaction(data: any) {
        return this.api.post('api/deal/credit/card/payment/make', data);
    }


}
