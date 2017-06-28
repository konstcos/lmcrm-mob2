import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController, ModalController, Events} from 'ionic-angular';

import {DepositedDetailPage} from "../deposited-detail/deposited-detail";

import {Deposited} from '../../providers/deposited';
import {Settings} from '../../providers/settings';

/*
 Generated class for the Deposited page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-deposited',
    templateUrl: 'deposited.html'
})
export class DepositedPage {

    /**
     * Массив с итемами на странице
     *
     */
    items: any = [];

    /**
     * Данные по фильтру
     */
    filter: any = {
        sphere: '',
        mask: '',
        opened: ''
    };

    /**
     * Переменная которая помнит есть ли еще итемы на сервере
     * нужно ли их еще подгружать или нет
     */
    isThereStillItems = true;

    /**
     * Спинер загрузки
     *
     */
    public isLoading: boolean = true;

    /**
     * Нет итемов
     *
     */
    public noItems: boolean = false;

    /**
     * Фильтр включен или выключен
     *
     */
    public isFilterOn: boolean = false;

    /**
     * Роли пользователя
     *
     */
    public roles: any = {
        role: 'any',
        subRole: 'any',
    };


    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public settings: Settings,
        public deposited: Deposited,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController,
        public events: Events) {

    }




    ionViewDidLoad() {
        // console.log('ionViewDidLoad DepositedPage');

        // отписываемся от события по добавлению нового лида
        this.events.unsubscribe("lead:new_added");

        // событие добавления нового лида
        this.events.subscribe("lead:new_added", () => {
            // this.notices = 0;

            console.log('отданные лиды, добавлен новый лид');
            this.loadItems();
        });

        // отписываемся от событие по смене фильтра
        this.events.unsubscribe('depositedFilter');

        // событие по смене фильтра
        this.events.subscribe('depositedFilter', () => {

            console.log('событие по фильтру в отданных лидах');

            this.filter = JSON.parse(localStorage.getItem('depositedFilter'));

            this.loadItems();
        });


        this.events.unsubscribe('depositedFilterChange');

        // событие по смене фильтра
        this.events.subscribe('depositedFilterChange', (data) => {

            this.isFilterOn = data.status;
        });

    }


    /**
     * Сценарий при загрузке страницы
     *
     */
    ionViewWillEnter() {
        console.log('DepositedPage View');
        // console.log( this.settings.settings )
        // загрузка новых итемов

        // событие на смену страницы
        this.events.publish("page:change", {page: 'deposited'});

        // todo событие по смене фильтра
        // this.events.subscribe('depositedFilter', () => {
        //
        //     console.log('событие по фильтру в отданных лидах');
        //
        //     this.filter = JSON.parse(localStorage.getItem('depositedFilter'));
        //
        //     this.loadItems();
        // });

        this.isFilterOn = localStorage.getItem('depositedFilterOn') &&  localStorage.getItem('depositedFilterOn') == 'true';

        this.loadItems();
    }


    /**
     * Метод проверки уведомлений
     *
     */
    checkNotices(notices) {
        this.events.publish('notice:new', notices);
        this.events.publish('badge:set', notices);
    }


    /**
     * обновление контента
     *
     */
    refresh(refresher) {

        // очищаем итемы
        this.items = [];

        this.noItems = false;

        // заводим переменную с присутствующими лидами в true
        this.isThereStillItems = true;

        // получение итемов с сервера
        this.get()
        // обработка итемов
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                this.checkNotices(data.notices);

                // вычесляем количество итемов
                let itemsLength = data.leads.length;

                // обработка итемов
                if (itemsLength != 0) {
                    // если больше нуля

                    // добавляем полученные итемы на страницу
                    this.items = data.leads;

                } else {
                    // если итемов нет

                    // todo сообщаем что итемов нет
                    this.noItems = true;
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
     * Загрузк итемов открытых лидов в модель
     *
     */
    loadItems() {

        // console.log('запустил loadItems deposited');

        // очищаем итемы
        this.items = [];

        // заводим переменную с присутствующими лидами в true
        this.isThereStillItems = true;

        this.noItems = false;

        this.isLoading = true;

        // инициация окна загрузки
        // let loading = this.loadingCtrl.create({
        //     content: 'Receiving leads, please wait...'
        // });

        // показ окна загрузки
        // loading.present();


        // получение итемов с сервера
        this.get()
        // обработка итемов
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log('получил депозитед: ');
                console.log(data);

                localStorage.setItem('roles', JSON.stringify(data.roles));
                this.events.publish('roles:get', data.roles);

                this.roles = data.roles;

                this.checkNotices(data.notices);

                // вычесляем количество итемов
                let itemsLength = data.leads.length;

                this.isLoading = false;

                // обработка итемов
                if (itemsLength != 0) {
                    // если больше нуля

                    // добавляем полученные итемы на страницу
                    this.items = data.leads;

                } else {
                    // если итемов нет

                    // todo показываем оповещение что итемов нет
                    this.noItems = true;
                }

                // отключаем окно индикатора загрузки
                // loading.dismiss();

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)
                this.isLoading = false;

                // отключаем окно индикатора загрузки
                // loading.dismiss();
            });

    }


    /**
     * Подгрузка следующей партии итемов
     *
     */
    loadMore(infiniteScroll) {

        // todo проверка это конец списка или нет

        // console.log('сработал инфинити');

        if( this.isThereStillItems ){

            // получение итемов с сервера
            this.get()
            // обработка итемов
                .subscribe(result => {
                    // при получении итемов

                    // переводим ответ в json
                    let data = result.json();

                    // вычесляем количество итемов
                    let itemsLength = data.leads.length;

                    // обработка итемов
                    if (itemsLength != 0) {
                        // если больше нуля

                        // добавляем полученные итемы на страницу
                        this.items = this.items.concat( data.leads );

                    } else {
                        // если итемов нет

                        // помечаем что итемы закончились и больше не вызываем эту функцию
                        this.isThereStillItems = false;
                    }

                    // отключаем окно индикатора загрузки
                    infiniteScroll.complete();

                }, err => {
                    // в случае ошибки

                    console.log('ERROR: ' + err);

                    // todo выводится сообщение об ошибке (нету связи и т.д.)

                    // отключаем окно индикатора загрузки
                    infiniteScroll.complete();
                });
        }else{
            // отключаем окно индикатора загрузки
            infiniteScroll.complete();
        }
    }


    /**
     * Загрузка итемов открытых лидов с сервера
     *
     */
    get() {

        // получаем количество уже загруженных итемов
        let offset = this.items.length;

        // возвращаем promise с итемами
        return this.deposited.get({offset: offset, filter: this.filter});
    }


    /**
     * Включение/выключение инфинити
     *
     */
    isLastPageReached():boolean {

        return this.items.length != 0 && this.isThereStillItems;
    }


    /**
     * Подробности по итему
     *
     */
    detail(item) {
        let modal = this.modalCtrl.create(DepositedDetailPage, {item: item});
        modal.present();
    }


    customerPage() {

        this.events.publish("main:openCustomer");
    }

}
