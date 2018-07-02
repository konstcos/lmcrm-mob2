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
import {LicensePage} from '../license/license'
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
    selector: 'registration-data',
    templateUrl: 'registration-data.html'
})
export class RegistrationDataPage {


    /**
     * Подтверждение соответствующего этапа
     */
    public confirmation: any = {
        // sphere: false,
        personal: false,
        role: false,
        agreement: false,
        leadBuyerOperatingMode: false,

        // разрешение на дальнейшее продвижение по режимам лидбайера
        // Диалмэйкеру можно двигатся в любом случае
        // Лидбайеру можно двигатся дальше только при выборе режима
        operationModeResolution: false,
        specialization: false,
    };

    /**
     * Показать убрать выбор режима работы лидбайера
     */
    public leadBuyerOperatingModeShow: boolean = false;

    /**
     * Сферы выбранные пользователем
     *
     */
    public sphereSelected: any = [];


    /**
     * Специализация
     *
     */
    public specializations: any = [];


    /**
     * Режим работы лидбайера
     *
     */
    public leadBuyerOperationMode: any = false;


    /**
     * Персональные данные пользователя
     *
     */
    public personalData: any = {
        firstName: '',
        lastName: '',
        company: '',
        address: '',
        passport: '',
        region: 1,
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
                private badge: Badge,
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
        let dataSpheres = this.modalCtrl.create(RegistrationDataSpheresPage,
            {spheres: this.sphereSelected},
            {showBackdrop: false, enableBackdropDismiss: false});
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
    fillingPersonal(phoneError: any = false) {

        // модальное окно со сферами системы
        let personalData = this.modalCtrl.create(RegistrationDataPersonalPage,
            {personal: this.personalData, phoneError: phoneError},
            {showBackdrop: false, enableBackdropDismiss: false});
        // показ модального окна со сферами
        personalData.present();


        // сценарий при закрытии модального окна со сферами
        personalData.onDidDismiss(data => {
            // сохранение выбранных сфер в модели
            this.personalData = data.personal;

            console.log('персональные данные: ');
            console.log(data);


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
        let personalData = this.modalCtrl.create(RegistrationDataRolePage,
            {role: this.role},
            {showBackdrop: false, enableBackdropDismiss: false});
        // показ модального окна со сферами
        personalData.present();

        // сценарий при закрытии модального окна со сферами
        personalData.onDidDismiss(data => {
            // сохранение выбранных сфер в модели
            this.role = data.role;

            // выставляем подтверждение режима лидбайера в false
            this.confirmation.leadBuyerOperatingMode = false;

            // обнуляем режим лидбайера
            this.leadBuyerOperationMode = false;

            // проверка валидности данных по личным данным
            this.confirmation.role = this.role != 0;

            // очищаем специализации
            this.specializations = [];

            // проверка валидности данных по личным данным
            this.confirmation.specialization = false;

            // проверка роли
            // если лидбайер, то появляется чекбокс выбора режима работы лидбайера
            this.leadBuyerOperatingModeShow = this.role == 1;

            // установка разрешение на дальнейшее продвижение
            if (this.role == 1 || this.role == 0) {
                // если роль не выбрана или выбрана роль лидбайера

                // дальше двигаться нельзя,
                // пока не выбран режим лидбайера
                // или соответствующая роль
                this.confirmation.operationModeResolution = false;

            } else {
                // в других случаях

                // если выбран диалмэйкер, можно двигаться дальше
                this.confirmation.operationModeResolution = true;
            }

            console.log('закрытие модального окна с ролями');
            console.log(data);
        });
    }


    /**
     * Выбор режима работы лидбайера
     *
     */
    switchLeadBuyerOperationMode() {

        // модальное окно со режимами лидбайера
        let operatingModePage = this.modalCtrl.create(RegistrationDataOperatingModePage,
            {leadBuyerOperationMode: this.leadBuyerOperationMode},
            {showBackdrop: false, enableBackdropDismiss: false});
        // показ модального окна с режимами лидбайера
        operatingModePage.present();

        // сценарий при закрытии модального окна с режимами лидбайеров
        operatingModePage.onDidDismiss(data => {
            // сохранение выбранных сфер в модели
            this.leadBuyerOperationMode = data.leadBuyerOperationMode == 0 ? false : data.leadBuyerOperationMode;

            if (this.leadBuyerOperationMode) {
                // выставляем подтверждение режима лидбайера в true
                this.confirmation.leadBuyerOperatingMode = true;
                this.confirmation.operationModeResolution = true;
            }

            // console.log('закрытие модального окна с режимами');
            // console.log(data);
        });

    }


    /**
     * Выбор специализации
     *
     */
    choiceSpecialization() {
        console.log('Specialization:');
        console.log(this.specializations);

        if (this.role === 0) {
            return false;
        }

        // модальное окно со режимами лидбайера
        let specializationPage = this.modalCtrl.create(RegistrationDataSpecializationPage,
            {specializations: this.specializations, role: this.role},
            {showBackdrop: false, enableBackdropDismiss: false});
        // показ модального окна с режимами лидбайера
        specializationPage.present();

        // сценарий при закрытии модального окна с режимами лидбайеров
        specializationPage.onDidDismiss(data => {
            // сохранение выбранных специализаций в модели
            this.specializations = (!data.specializations || data.specializations.length == 0) ? [] : data.specializations;

            this.confirmation.specialization = !data.specializations || data.specializations.length != 0;

            console.log('Specializations:');
            console.log(data.specializations);

            // console.log('Logoute:');
            // console.log(data.logout);

            if (data.logout) {
                this.goBack();
            }

            // if(this.leadBuyerOperationMode){
            //     // выставляем подтверждение режима лидбайера в true
            //     this.confirmation.leadBuyerOperatingMode = true;
            //     this.confirmation.operationModeResolution = true;
            // }

            console.log('закрытие модального окна с специализациями');
            console.log(data.specializations);
        });

    }


    /**
     * Сохранение данных
     *
     */
    saveRegistrationData() {

        // проверка данных
        if (!(this.confirmation.specialization && this.confirmation.operationModeResolution && this.confirmation.personal && this.confirmation.role)) {
            // если не все данные заполненны
            // выходим из метода
            console.log('не все данные заполненны');
            return false;
        }

        console.log('начало отправки данных');

        // данные для отправки на сервер
        let data = {
            personal: this.personalData,
            role: this.role,
            specializations: this.specializations,
            leadBuyerOperationMode: this.leadBuyerOperationMode,
        };

        // сохранение данных
        this.user.saveAgentData(data)
            .subscribe(result => {

                let data = result.json();

                console.log(data);

                if (data.status == 'success') {

                    this.nav.setRoot(LicensePage);

                } else {

                    if (data.info == 'validator error' && data.errors.phone && data.errors.phone.length > 0) {
                        console.log('data.info == \'validator error');
                        console.log(data);

                        this.fillingPersonal(data.errors.phone);
                    }

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


    /**
     * Подтверждение пользовательского соглашения
     *
     */
    confirmUserAgreement() {
        this.confirmation.agreement = !this.confirmation.agreement;
    }


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
    backButtonAction() {
        this.goBack();
    }
}
