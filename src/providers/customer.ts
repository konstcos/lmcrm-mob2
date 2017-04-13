import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Api} from './api';
import 'rxjs/add/operator/map';

/*
 Generated class for the Customer provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class Customer {

    constructor(public http: Http,
                public api: Api) {

        // console.log('Hello Customer Provider');
    }


    /**
     * Получение с сервера всех сфер агента с сводными данными по всем маскам
     */
    getSpheres() {
        return this.api.post('api/agentSphereMasks', {});
    }


    /**
     * Получение всех масок по одной сфере
     */
    getSphereMasks(sphereId: number) {
        return this.api.post('api/agentSphereMasksData', {sphereId: sphereId});
    }


    /**
     * Переключение активности масок
     *
     */
    switchMaskActive(maskId: number) {
        return this.api.post('api/maskActiveSwitch', {maskId: maskId});
    }


    /**
     * Получение данных для редактирования маски
     *
     */
    editMask(maskId: number) {
        return this.api.post('api/sphereMasksEdit', {maskId: maskId});
    }


    /**
     * Сохранение данных по маске
     *
     */
    saveMask(mask: any, newMask: boolean) {

        // todo переделать на один роут

        if (newMask) {

            return this.api.post('api/saveNewMask', {mask: mask});

        } else {

            return this.api.post('api/saveMask', {mask: mask});
        }

    }


    /**
     * Удаление маски
     *
     */
    deleteMask(maskId: number) {
        return this.api.post('api/dellMask', {maskId: maskId});
    }

}
