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

// import {OpenPage} from '../open/open'

import {LoginPage} from '../login/login'
import {RegistrationDataSpheresPage} from '../registration-data-spheres/registration-data-spheres'
import {RegistrationDataPersonalPage} from '../registration-data-personal/registration-data-personal'
import {RegistrationDataRolePage} from '../registration-data-role/registration-data-role'
import {RegistrationWaitingConfirmation} from '../registration-waiting-confirmation/registration-waiting-confirmation'
import {User} from '../../providers/user';

/*
 Generated class for the Signup page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'registration-data',
    templateUrl: 'registration-data.html'
})
export class RegistrationDataPage {


    /**
     * Подтверждение соответствующего этапа
     */
    public confirmation: any = {
        sphere: false,
        personal: false,
        role: false,
    };


    /**
     * Сферы выбранные пользователем
     *
     */
    public sphereSelected: any = [];


    /**
     * Персональные данные пользователя
     *
     */
    public personalData: any = {
        firstName: '',
        lastName: '',
        company: '',
        phone: '',
    };


    /**
     * Выбранная агентом роль
     *
     */
    public role: number = 0;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public user: User,
                public nav: Nav,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController,
                public translateService: TranslateService,
                public modalCtrl: ModalController) {

    }


    /**
     * Выбор сферы системы
     *
     */
    selectSpheres() {

        // модальное окно со сферами системы
        let dataSpheres = this.modalCtrl.create(RegistrationDataSpheresPage, {spheres: this.sphereSelected});
        // показ модального окна со сферами
        dataSpheres.present();

        // сценарий при закрытии модального окна со сферами
        dataSpheres.onDidDismiss(data => {
            // сохранение выбранных сфер в модели
            this.sphereSelected = data;
            // пометка пройденного этапа, или наоборот - что этап не пройден
            this.confirmation.sphere = this.sphereSelected.length != 0;
        });
    }


    /**
     * Заполнение персонральных данных агента
     *
     */
    fillingPersonal() {

        // модальное окно со сферами системы
        let personalData = this.modalCtrl.create(RegistrationDataPersonalPage, {personal: this.personalData});
        // показ модального окна со сферами
        personalData.present();

        // сценарий при закрытии модального окна со сферами
        personalData.onDidDismiss(data => {
            // сохранение выбранных сфер в модели
            this.personalData = data.personal;

            // проверка валидности данных по личным данным
            this.confirmation.personal = data.status;

            // console.log('закрытие модального окна с персональными данными');
            // console.log(data);
        });
    }


    /**
     * Выбор на соответствие роли
     *
     */
    roleMatching() {

        // модальное окно со сферами системы
        let personalData = this.modalCtrl.create(RegistrationDataRolePage, {role: this.role});
        // показ модального окна со сферами
        personalData.present();

        // сценарий при закрытии модального окна со сферами
        personalData.onDidDismiss(data => {
            // сохранение выбранных сфер в модели
            this.role = data.role;

            // проверка валидности данных по личным данным
            this.confirmation.role = this.role != 0;

            console.log('закрытие модального окна с ролями');
            console.log(data);
        });
    }


    /**
     * Сохранение данных
     *
     */
    saveRegistrationData() {

        // проверка данных
        if(!(this.confirmation.sphere && this.confirmation.personal && this.confirmation.role)){
            // если не все данные заполненны
            // выходим из метода
            console.log('не все данные заполненны');
            return false;
        }

        console.log('начало отправки данных');

        // данные для отправки на сервер
        let data = {
            spheres: this.sphereSelected,
            personal: this.personalData,
            role: this.role
        };


        // сохранение данных
        this.user.saveAgentData(data)
            .subscribe(result => {
                // If the API returned a successful response, mark the user as logged in

                let data = result.json();

                console.log(data);

                if (data.status == 'success') {
                    this.nav.setRoot(RegistrationWaitingConfirmation);
                }


                // loading.dismiss();

            }, err => {
                console.error('ERROR', err);
                // alert('ERROR: ' + err);
                // loading.dismiss();
            });

        // console.log('работаю');
        // console.log(data);
    }


    goBack() {
        // метод разлогинивания
        this.user.logout();
        // переходим на страницу логина
        this.nav.setRoot(LoginPage);
    }

}
