import {Component} from '@angular/core';
import {NavController, ToastController, ViewController, LoadingController, Events, NavParams} from 'ionic-angular';

import {TranslateService} from 'ng2-translate/ng2-translate';

import {LoginPage} from '../login/login'
import {RegistrationDataPage} from '../registration-data/registration-data'
import {User} from '../../providers/user';
import {CrashManager} from '../../providers/crash_manager';
import {SafeResourceUrl, DomSanitizer} from '@angular/platform-browser';

/*
 Generated class for the Signup page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'crash-page',
    templateUrl: 'crash.html'
})
export class CrashPage {


    /**
     * Сообщение об ошибке
     *
     */
    public error: boolean = false;


    /**
     * Данные по крашу
     *
     */
    public crashData: any = false;


    /**
     * Дебаг, включен/выключен
     *
     */
    public debug: boolean = false;


    /**
     * Разделы страницы
     *
     */
    public sections: any = {
        connectionError: false,
        serverError: false,
        loading: false,
        unknown: false
    };

    constructor(public navCtrl: NavController,
                public user: User,
                public navParams: NavParams,
                public view: ViewController,
                public toastCtrl: ToastController,
                private domSanitizer: DomSanitizer,
                public loadingCtrl: LoadingController,
                public translateService: TranslateService,
                public crash: CrashManager,
                public events: Events) {

        this.section('loading');

        // установка уровня дебага
        this.debug = crash.isDebug();

        // console.log('проверка дебага из восстановление пароля');
        // console.log(crash.isDebug());
        // console.log('конец проверке');

        this.crashData = this.navParams.get('crashData');

        this.section('serverError');

        // console.log('это со страницы ошибок');
        // console.log(this.crashData.response._body);
    }


    /**
     * Переключатель областей
     *
     *     loading - загрузка
     *     connectionError - ошибка связи
     *     serverError - ошибка сервера
     *     unknown - непонятно в чем ошибка
     *
     */
    section(sectionName: any = false) {

        // закрываем все разделы страницы
        this.closeAllSections();

        switch (sectionName) {

            case 'loading':
                // область со спинером загрузки
                this.sections.loading = true;
                break;


            case 'connectionError':
                // область со спинером загрузки
                this.sections.connectionError = true;
                break;


            case 'serverError':
                // область со спинером загрузки
                this.sections.serverError = true;
                break;


            case 'unknown':
                // область со спинером загрузки
                this.sections.unknown = true;
                break;

            default:
                // alert('wrong area name');
        }

    }


    /**
     * Закрывает все разделы
     *
     */
    closeAllSections() {
        // закрытие всех областей
        for (let section in this.sections) {
            // перебираем все области
            // закрываем их
            this.sections[section] = false;
        }
    }


    // todo проверка какую ошибку указать
    // todo проверка какую ошибку указать

    webPage(){

        // return this.domSanitizer.bypassSecurityTrustResourceUrl(this.crashData.response._body);
        return this.domSanitizer.bypassSecurityTrustHtml(this.crashData.response._body);
    }


    reload() {
        location.reload();
    }


    /**
     * Возврат на страницу логина
     *
     */
    goBack() {
        // переходим на страницу логина
        this.view.dismiss();
        // this.nav.setRoot(PasswordRecovery);

    }

}
