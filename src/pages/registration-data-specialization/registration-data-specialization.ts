import {Component} from '@angular/core';
import {NavController, ViewController, AlertController, LoadingController, NavParams} from 'ionic-angular';

import {TranslateService} from 'ng2-translate/ng2-translate';

import {Badge} from '@ionic-native/badge';

import {LoginPage} from '../login/login'
import {User} from '../../providers/user';

/*
 Generated class for the Signup page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'registration-data-specialization',
    templateUrl: 'registration-data-specialization.html'
})
export class RegistrationDataSpecializationPage {


    /**
     * Массив с итемами сфер на странице
     *
     */
    items: any = [];

    /**
     * Роль пользователя
     * специализации выбираются относительно нее
     *
     */
    role: any = [];


    /**
     * Массив с выбранными сферами
     *
     */
    selectedSpecializations: any = [];


    constructor(public navCtrl: NavController,
                public user: User,
                private badge: Badge,
                public viewCtrl: ViewController,
                public alertCtrl: AlertController,
                public loadingCtrl: LoadingController,
                public navParams: NavParams,
                public translate: TranslateService) {


        this.selectedSpecializations = this.navParams.get('specializations');
        this.role = this.navParams.get('role');

        // console.log('специализация');
        // console.log( this.navParams.get('spheres') );


        // получение специализаций
        this.getSpecializations(this.role);

    }


    ionViewDidLoad() {
        // console.log('ionViewDidLoad registration data spheres');
    }


    /**
     * Получение специализаций
     *
     */
    getSpecializations(role) {

        // инициация окна загрузки
        let loading = this.loadingCtrl.create({
            content: 'Loading specializations...'
        });

        // запрос на получении данных сферы
        this.user.getSpecializations(role)
        // обработка итемов
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                // console.log('получил все специализаций с сервера');
                console.log(data);

                let specializations = data.specializations;

                // сценарий в зависимости от наличия данных сфер
                if (this.selectedSpecializations.length == 0) {
                    // если нет сохраненных сфер

                    // перебираем специализации, проставляем статус
                    for (let index in specializations) {
                        specializations[index].status = false;
                    }

                    this.items = specializations;

                } else {
                    // если уже есть сохраненные сферы

                    // перебираем все сферы
                    for (let index in specializations) {


                        specializations[index].status = false;

                        // перебираем все сохраненные сферы
                        for (let selected in this.selectedSpecializations) {

                            if (specializations[index].id == this.selectedSpecializations[selected]) {
                                // добавляем статус true
                                specializations[index].status = true;
                                specializations[index].defoult = true;
                            }
                        }
                    }

                    this.items = specializations;
                }


                // отключаем окно индикатора загрузки
                loading.dismiss();

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
                loading.dismiss();
            });

    }


    /**
     * Выбрать или убрать сферу
     *
     */
    selectSpecialization(item) {

        if (item.defoult) {
            item.defoult = false;
            return false;
        }

        let added = false;

        let newItems = [];

        for (let specialization in this.selectedSpecializations) {

            if (item.id != this.selectedSpecializations[specialization]) {

                newItems.push(this.selectedSpecializations[specialization])

            } else {

                added = true;
            }
        }

        if (!added) {
            newItems.push(item.id)
        }

        this.selectedSpecializations = newItems;

        console.log('выбрал сферу');
        console.log(this.selectedSpecializations);

        // this.selectedSpheres;

    }


    /**
     * Вывод алерта об отсутствующей специализации
     */
    notSpecializationAlertShow() {
        // console.log('notSpecializationAlertShow');


        let text = {
            "title": "Did not find your specialization?",
            "sub_title": "You can enter your phone number to solve the problem more quickly",
            "cancel": "Cancel",
            "to_report": "To report"
        };

        this.translate.get('specializations.not_specialization_alert', {}).subscribe((res: string) => {

            text['title'] = res['title'];
            text['sub_title'] = res['sub_title'];
            text['cancel'] = res['cancel'];
            text['to_report'] = res['to_report'];
        });


        const alert = this.alertCtrl.create({
            title: text['title'],
            subTitle: text['sub_title'],
            inputs: [
                {
                    name: 'name',
                    placeholder: 'Enter you name'
                },
                {
                    name: 'phone',
                    placeholder: 'Enter phone'
                }
            ],
            buttons: [
                {
                    text: text['cancel'],
                    role: 'cancel',
                    handler: data => {
                        // console.log('Cancel clicked');
                    }
                },
                {
                    text: text['to_report'],
                    handler: data => {

                        console.log('There is no specialization for me');
                        console.log(data);

                        let phone = false;

                        if (data.name.trim() == '') {

                            // сообщаем агенту об ошибке
                            this.notValidPhoneNumberAlert();

                            // останавливаем дальнейшую работу
                            return false;
                        }

                        // валидация телефона (при его наличии)
                        if (data.phone.length != 0) {

                            // регулярка на проверку телефона
                            let reg = /^\+?(972|0)(\-)?0?(([23489]{1}\d{7})|[5]{1}\d{8})$/;

                            // проверка телефона
                            let phoneValidate = reg.test(data.phone);

                            // прохождение валидации
                            if (!phoneValidate) {
                                // валидация не прошла

                                // сообщаем агенту об ошибке
                                this.notValidPhoneNumberAlert();

                                // останавливаем дальнейшую работу
                                return false;
                            }

                            phone = data.phone;

                        }
                        // можно отправлять и без телефона, поэтому этот блок не нужен
                        // else {
                        //     this.notValidPhoneNumberAlert();
                        //     return false;
                        // }

                        // отправка запроса на сервер
                        this.notSpecializationMake(data.name, phone);

                    }
                }
            ]
        });
        alert.present();
    }


    /**
     * Алерт сообщающий о невалидном телефонном номере
     *
     */
    notValidPhoneNumberAlert() {

        let text = {
            "title": "Phone",
            "sub_title": "Not valid phone number. Please enter a valid phone number, or remove it altogether.",
            "button_ok": "Ok"
        };

        this.translate.get('specializations.not_valid', {}).subscribe((res: string) => {

            text['title'] = res['title'];
            text['sub_title'] = res['sub_title'];
            text['button_ok'] = res['button_ok'];
        });

        const alert = this.alertCtrl.create({
            title: text['title'],
            subTitle: text['sub_title'],
            buttons: [text['button_ok']]
        });
        alert.present();
    }


    /**
     * Алерт сообщающий об успешном оповещении админа
     *
     */
    notificationSuccessful() {

        let text = {
            "title": "Request to re-contact",
            "sub_title": "Thank you, one of our representatives will contact you as soon as possible in order to join you in the arena with a suitable occupation",
            "button_ok": "Ok"
        };

        this.translate.get('specializations.notification_successful', {}).subscribe((res: string) => {

            text['title'] = res['title'];
            text['sub_title'] = res['sub_title'];
            text['button_ok'] = res['button_ok'];
        });

        const alert = this.alertCtrl.create({
            title: text['title'],
            subTitle: text['sub_title'],
            buttons: [
                {
                    text: text['button_ok'],
                    handler: data => {
                        this.goBack(true);
                    }
                }

            ]
        });
        alert.present();
    }


    /**
     * Отправка запроса на обработку по отсутствующей специализации
     *
     */
    notSpecializationMake(name: String, phone: any = false) {

        // инициация окна загрузки
        let loading = this.loadingCtrl.create({
            content: 'Loading, please wait...'
        });

        loading.present();

        // запрос на получении данных сферы
        this.user.notSpecializationMake(name, phone)
        // обработка итемов
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                // console.log('получил все специализаций с сервера');
                // console.log(data);

                if (data.status == 'success') {

                    loading.dismiss();
                    this.notificationSuccessful();
                    // this.goBack(true);

                } else {

                    loading.dismiss();
                    this.notificationSuccessful();
                    // this.goBack(true);
                }

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
                loading.dismiss();
            });


    }


    /**
     * Закрытие модального окна и передача данных
     */
    goBack(logout = false) {
        this.viewCtrl.dismiss({specializations: this.selectedSpecializations, logout: logout});
    }


    /**
     * Событие по кнопке возврата
     *
     */
    backButtonAction(){
        this.goBack();
    }
}