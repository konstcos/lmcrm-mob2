import {Component} from '@angular/core';
import {
    NavController,
    ToastController,
    Nav,
    LoadingController,
    AlertController,
    ModalController,
    NavParams
} from 'ionic-angular';

import {TranslateService} from 'ng2-translate/ng2-translate';

import {Badge} from '@ionic-native/badge';

// import {OpenPage} from '../open/open'

import {LoginPage} from '../login/login'
import {MainPage} from '../main/main'
import {RegistrationDataSpheresPage} from '../registration-data-spheres/registration-data-spheres'
import {RegistrationDataPersonalPage} from '../registration-data-personal/registration-data-personal'
import {RegistrationDataRolePage} from '../registration-data-role/registration-data-role'
import {RegistrationDataOperatingModePage} from '../registration-data-operation-mode/registration-data-operation-mode'
import {RegistrationDataSpecializationPage} from '../registration-data-specialization/registration-data-specialization'
import {RegistrationWaitingConfirmation} from '../registration-waiting-confirmation/registration-waiting-confirmation'
import {User} from '../../providers/user';

/*
 Generated class for the Signup page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'license',
    templateUrl: 'license.html'
})
export class LicensePage {


    /**
     * Данные лицензии
     *
     */
    public licenseData = '';


    public signLaterCheckbox: boolean = false;


    /**
     * Проверка перехода
     * (со страницы логина или других страниц)
     *
     */
    public isLoginPage: boolean = true;


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public user: User,
                public nav: Nav,
                private badge: Badge,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController,
                public translateService: TranslateService,
                public modalCtrl: ModalController) {

        // проверка с какой страницы был переход
        let isFromLoginPage = navParams.get('loginPage');

        if(!isFromLoginPage) {
            this.isLoginPage = false;
        }

        console.log('isFromLoginPage');
        console.log(isFromLoginPage);

        console.log('страница для лицензии');

        // получение лицензии с сервера
        this.getLicense();
    }


    /**
     * Метод получения лицензии
     *
     */
    getLicense() {

        const loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });

        loading.present();

        // получение лицензии
        this.user.getAgentLicense()
            .subscribe(result => {

                let data = result.json();

                // console.log(data);

                if(data.status == 'success'){

                    this.licenseData = data.license.license;

                } else {

                    this.goBack();
                }

                loading.dismiss();

            }, err => {
                console.error('ERROR', err);
                // alert('ERROR: ' + err);
                loading.dismiss();
            });

        // console.log('получение лицензии');

    }


    /**
     * Подтверждение лицензии
     *
     */
    makeAgree() {

        const loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });

        loading.present();

        // получение лицензии
        this.user.agreeAgentLicense()
            .subscribe(result => {

                let data = result.json();

                console.log('подтверждение лицензии:');
                console.log(data);

                if(data.status == 'success'){

                    location.reload();
                    // this.nav.setRoot(MainPage);

                } else {

                    this.goBack();
                }

                loading.dismiss();

            }, err => {
                console.error('ERROR', err);
                // alert('ERROR: ' + err);
                loading.dismiss();
            });

    }


    /**
     * Переход на главную страницу без подписания договора
     */
    goToMainPage() {
        this.nav.setRoot(MainPage);
    }


    /**
     * Возврат на страницу логина (разлогинивание)
     *
     */
    goBack() {

        // обнуляем баджик
        this.badge.set(0);
        // метод разлогинивания
        this.user.logout();
        // переходим на страницу логина
        this.nav.setRoot(LoginPage);
    }


    /**
     * Событие по кнопке возврата
     *
     */
    backButtonAction(){
        this.goBack();
    }
}
