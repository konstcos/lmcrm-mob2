import {Component} from '@angular/core';
import {NavController, NavParams, Nav, AlertController} from 'ionic-angular';

// главная страница
import {MainPage} from '../main/main'

import {Credits} from '../../providers/credits'


/*
 Generated class for the Credits page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-credits',
    providers: [Credits],
    templateUrl: 'credits.html'
})
export class CreditsPage {

    /**
     * Итемы кредитной истории
     *
     */
    items: any = [];

    /**
     * Статусы кредитной истории
     *
     */
    statuses: any = [];

    /**
     * Описание типов кредитной истории
     *
     */
    types: any = [];

    /**
     * Реквезиты на оплату
     *
     */
    requisites: any = false;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public nav: Nav,
                public credits: Credits,
                public alertCtrl: AlertController) {

        this.get();
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad CreditsPage');
    }


    /**
     * Обновление данных на странице
     *
     */
    refresh(refresher) {

        this.credits.get({})
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                if (data.status == 'success') {

                    this.items = data.credits.requestsPayments;
                    this.statuses = data.credits.statuses;
                    this.types = data.credits.types;

                    this.requisites = data.requisites;

                } else {

                }

                // отключаем окно индикатора загрузки
                refresher.complete();

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
                refresher.complete();
            });
    }


    /**
     * Получение кредитной истории пользователя
     *
     */
    get() {
        this.credits.get({})
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                if (data.status == 'success') {

                    this.items = data.credits.requestsPayments;
                    this.statuses = data.credits.statuses;
                    this.types = data.credits.types;

                    this.requisites = data.requisites;

                } else {

                }

                // отключаем окно индикатора загрузки
                // loading.dismiss();

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
                // loading.dismiss();
            });

    }


    /**
     * Вывод диалога по созданию запроса на ввод средств
     *
     */
    showReplenishmentDialog() {
        let prompt = this.alertCtrl.create({
            title: 'Replenishment',
            message: "Enter the amount to enter into the system",
            inputs: [
                {
                    name: 'amount',
                    placeholder: '0'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        // console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Replenishment',
                    handler: data => {
                        // console.log('Saved clicked');
                        // console.log(data);

                        this.credits.createReplenishment({amount: data.amount})
                            .subscribe(result => {
                                // при получении итемов

                                // переводим ответ в json
                                let resData = result.json();

                                console.log(resData);

                                if (resData.status == 'success') {

                                    this.navCtrl.setRoot(this.navCtrl.getActive().component);

                                } else {

                                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                                }

                                // отключаем окно индикатора загрузки
                                // loading.dismiss();

                            }, err => {
                                // в случае ошибки

                                console.log('ERROR: ' + err);

                                // todo выводится сообщение об ошибке (нету связи и т.д.)

                                // отключаем окно индикатора загрузки
                                // loading.dismiss();
                            });

                    }
                }
            ]
        });

        prompt.present();
    }


    /**
     * Оплата запроса
     *
     */
    payReplenishment(item) {

        this.credits.payReplenishment({item_id: item.id})
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                if (data.status == 'success') {

                    this.navCtrl.setRoot(this.navCtrl.getActive().component);

                } else {

                    this.navCtrl.setRoot(this.navCtrl.getActive().component);
                }

                // отключаем окно индикатора загрузки
                // loading.dismiss();

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
                // loading.dismiss();
            });
    }


    /**
     * Возврат назад
     *
     */
    goBack() {

        this.nav.setRoot(MainPage);
    }
}
