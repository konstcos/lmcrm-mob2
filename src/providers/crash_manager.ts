import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {App, Events, ViewController} from 'ionic-angular';
import {Api} from './api';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import {LoginPage} from '../pages/login/login'
// import {CrashPage} from '../pages/crash/crash'


/*
 Generated class for the Open provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class CrashManager {


    /**
     * Переменная с респонсом
     *
     */
    public response: any = false;


    /**
     * Статус респонса
     *
     */
    public responseStatus: any = false;

    /**
     * Переменная хранящая вероятную ошибку респонса
     *
     */
    public responseErrorReason: any = false;

    /**
     * Возможные ошибки в работе
     *
     *    false - ошибок нет
     *    true - ошибоки есть
     */
    public errors: any = {
        // ошибки по респонсу (нету его, не установился и т.д.)
        response: false,
        // статус респонса
        responseStatus: false,


    };

    constructor(public events: Events,
                public http: Http,
                public api: Api,
                public app: App) {




    }


    public isDebug() {
        return this.api.debug;
    }

    /**
     * Обработать аварийную ситуацию
     *
     */
    responseHandler(response) {

        // сохраняем респонс в объекте
        this.setResponse(response);

        // анализируем респонс
        this.responseErrorAnalyze();

        // запускаем обработку ошибки по респонсу
        this.startResponseErrorProcessing();

        return true;
    }


    /**
     * Сохранение респонса с ошибкой в объекте
     *
     */
    private setResponse(response) {

        // проверка на наличие данных в переменной
        if (!response) {
            // если нет - возвращаем ошибку
            this.errors.response = true;
            return false;
        }

        // добавляем респонс в переменную объекта
        this.response = response;
        // выставляем ошибку в false
        this.errors.response = false;

        // выбираем статус ответа
        this.setResponseStatus();

        return true;
    }


    /**
     * Установка статуса респонса
     *
     */
    private setResponseStatus() {

        // проверка респонса на ошибку
        if (this.errors.response) {
            // если в респонсе есть ошибка, выходим из метода
            return false;
        }

        // проверка наличия статуса в респонсе
        if (this.response.status === undefined) {
            // выставляем ошибки в переменных ошибки респонса и статуса
            this.errors.response = true;
            this.errors.responseStatus = true;
        }

        // сохраняем статус в моделе
        this.responseStatus = this.response.status;
        // убираем ошибку из переменной ошибок
        this.errors.responseStatus = false;

        return true;
    }


    /**
     * Анализ ошибки респонса
     *
     */
    private responseErrorAnalyze() {

        // проверка респонса и статуса на ошибку
        if (this.errors.response || this.errors.responseStatus) {
            // если в респонсе или статусе есть ошибка, выходим из метода
            return false;
        }

        // анализ респонса на основе статуса
        switch (this.responseStatus) {

            case 0:
                // ошибка связи (нет инэта или что-то страшное)
                this.responseErrorReason = 'connection_error';
                break;

            case 404:
            case 500:
                // ошибка сервера, что-то не так на сервере
                this.responseErrorReason = 'server_error';
                break;

            default:
                // по умолчанию выставляем ошибку сервера (если ничего другого не подошло)
                this.responseErrorReason = 'connection_error';
        }

        return this.responseErrorReason;
    }


    /**
     * Запуск обработки ошибки
     *
     */
    private startResponseErrorProcessing() {

        // проверка необходимых параметров
        if (this.errors.response || this.errors.responseStatus || this.errors.responseErrorReason) {
            // если параметров не достаточно - отменяем метод
            return false;
        }

        // действия по ошибкам
        switch (this.errors.responseErrorReason) {

            case 'connection_error':
                // ошибка связи (нет инэта или что-то страшное)
                this.connectError();
                break;

            case 'server_error':
                // ошибка сервера, что-то не так на сервере
                this.serverError();
                break;

            default:
                // непонятная ошибка по серверу
                this.unknownError();
        }
    }


    /**
     * Ошибка подключения к серверу
     */
    connectError() {
        this.events.publish('crash:page.open', {crashData: {response: this.response, reason: this.responseErrorReason}});
    }


    /**
     * Ошибка сервера
     */
    serverError() {
        this.events.publish('crash:page.open', {crashData: {response: this.response, reason: this.responseErrorReason}});
    }


    /**
     * Непонятная ошибка
     */
    unknownError() {
        this.events.publish('crash:page.open', {crashData: {response: this.response, reason: this.responseErrorReason}});
    }


    /**
     * Некоторые моменты и заметки которые нужно будет потом доделалать
     *
     */
    todoPotom() {

        return false;

        // проверка активной вьюшки

        // this.app.getRootNav().setRoot(CrashPage);

        // let nav = this.app.getActiveNav();
        // let activeView: ViewController = nav.getActive();
        // let activeView = this.nav.getActive();

        // if (activeView != null) {
        //
        //     if (typeof activeView.instance.backButtonAction === 'function') {
        //
        //         activeView.instance.backButtonAction();
        //     }
        //
        //
        //     if(nav.canGoBack()) {
        //         nav.pop();
        //     }else if (typeof activeView.instance.backButtonAction === 'function')
        //         activeView.instance.backButtonAction();
        //     else nav.parent.select(0); // goes to the first tab
        // }

    }


}
