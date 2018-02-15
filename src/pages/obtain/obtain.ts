import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController, ModalController, Events} from 'ionic-angular';

import {Obtain} from '../../providers/obtain';
import {ObtainDetailPage} from "../obtain-detail/obtain-detail";
// страница для фильтрования лидов
import {CustomersPage} from '../customers/customers';
import {Badge} from '@ionic-native/badge';

/*
 Generated class for the Obtain page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-obtain',
    templateUrl: 'obtain.html'
})
export class ObtainPage {

    /**
     * Массив с итемами на странице
     *
     */
    public items: any = [];

    /**
     * Данные по фильтру
     */
    public filter: any = {
        sphere: '',
        mask: '',
        opened: ''
    };

    /**
     * Переменная которая помнит есть ли еще итемы на сервере
     * нужно ли их еще подгружать или нет
     */
    public isThereStillItems: boolean = true;

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


    /**
     * Конструктор класса
     *
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public obtain: Obtain,
                public loadingCtrl: LoadingController,
                public modalCtrl: ModalController,
                public events: Events,
                private badge: Badge) {
    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad ObtainPage');

        this.events.unsubscribe('obtainFilter');

        // событие по смене фильтра
        this.events.subscribe('obtainFilter', () => {

            // console.log('событие по фильтру в полученных лидах');

            this.filter = JSON.parse(localStorage.getItem('obtainFilter'));

            this.loadItems();
        });


        this.events.unsubscribe('obtainFilterChange');

        // событие по смене фильтра
        this.events.subscribe('obtainFilterChange', (data) => {

            this.isFilterOn = data.status;
        });


        this.events.unsubscribe('incoming:mark');

        // событие по смене фильтра
        this.events.subscribe('incoming:mark', () => {

            this.loadItems();
        });
    }

    // ionViewWillUnload() {
    //
    //     this.events.unsubscribe('obtainFilter');
    // }


    /**
     * Срабатывает когда открывается страница
     *
     */
    ionViewWillEnter() {

        this.isFilterOn = localStorage.getItem('obtainFilterOn') && localStorage.getItem('obtainFilterOn') == 'true';

        // событие на смену страницы
        this.events.publish("page:change", {page: 'obtain'});
        // загрузка новых итемов
        this.loadItems();

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


                /**
                 * Количество уведомлений
                 *
                 */
                let notices = {
                    notice: data.notices,
                    auction: data.auctionCount,
                };
                // применяем уведомления
                this.checkNotices(notices);


                console.log('обновление обтэин: ');
                console.log(data);


                // вычесляем количество итемов
                let itemsLength = data.auctionItems.length;

                // обработка итемов
                if (itemsLength != 0) {
                    // если больше нуля

                    // добавляем полученные итемы на страницу
                    this.items = data.auctionItems;

                } else {
                    // если итемов нет

                    // todo проверка включенного фильтра
                    // сообщаем что итемов нет
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
     * Метод проверки уведомлений
     *
     */
    checkNotices(notices) {
        this.events.publish('notice:new', notices.notice);
        this.events.publish('badge:set', notices.auction);

        console.log('нотификации по аукциону, новые');
        console.log(notices.auction);

        this.badge.set(notices.auction);
    }


    /**
     * Загрузк итемов открытых лидов в модель
     *
     */
    loadItems() {

        // очищаем итемы
        this.items = [];

        // заводим переменную с присутствующими лидами в true
        this.isThereStillItems = true;

        this.noItems = false;

        this.isLoading = true;

        // todo показываем индикатор загрузки

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


                // console.log('Данные агента: ');
                console.log(data);

                localStorage.setItem('roles', JSON.stringify(data.roles));

                let agentData = {
                    roles: data.roles,
                    name: data.name,
                    surname: data.surname,
                    email: data.email,
                    prices: data.spherePrice,
                    wallet: data.wallet,
                    leadsBySphere: data.leadsBySphere,
                };


                this.events.publish('agentData:get', agentData);
                this.roles = data.roles;

                /**
                 * Количество уведомлений
                 *
                 */
                let notices = {
                    notice: data.notices,
                    auction: data.auctionCount,
                };

                // console.log('загрузил итемы: ');
                // console.log(notices);
                this.checkNotices(notices);


                // вычесляем количество итемов
                let itemsLength = data.auctionItems.length;

                this.isLoading = false;

                // обработка итемов
                if (itemsLength != 0) {
                    // если больше нуля

                    // console.log(data.auctionItems);

                    // добавляем полученные итемы на страницу
                    this.items = data.auctionItems;

                } else {
                    // если итемов нет

                    // todo проверка включенного фильтра

                    // показываем оповещение что итемов нет
                    this.noItems = true;
                }

                // отключаем окно индикатора загрузки
                // loading.dismiss();

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                this.isLoading = false;

                // todo выводится сообщение об ошибке (нету связи и т.д.)

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

        if (this.isThereStillItems) {

            // получение итемов с сервера
            this.get()
            // обработка итемов
                .subscribe(result => {
                    // при получении итемов

                    // переводим ответ в json
                    let data = result.json();

                    /**
                     * Количество уведомлений
                     *
                     */
                    let notices = {
                        notice: data.notices,
                        auction: data.auctionCount,
                    };
                    console.log(notices);
                    // применяем уведомления
                    this.checkNotices(notices);

                    // вычесляем количество итемов
                    let itemsLength = data.auctionItems.length;

                    // обработка итемов
                    if (itemsLength != 0) {
                        // если больше нуля

                        // добавляем полученные итемы на страницу
                        this.items = this.items.concat(data.auctionItems);

                    } else {
                        // если итемов нет

                        // помечаем что итемы закончились и больше не вызываем эту функцию
                        this.isThereStillItems = false;
                    }

                    this.badge.set(data.auctionCount);

                    // отключаем окно индикатора загрузки
                    infiniteScroll.complete();

                }, err => {
                    // в случае ошибки

                    console.log('ERROR: ' + err);

                    // todo выводится сообщение об ошибке (нету связи и т.д.)

                    // отключаем окно индикатора загрузки
                    infiniteScroll.complete();
                });
        } else {
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
        return this.obtain.get({offset: offset, filter: this.filter});
    }


    /**
     * Включение/выключение инфинити
     *
     */
    isLastPageReached(): boolean {

        return this.items.length != 0 && this.isThereStillItems;
    }


    /**
     * Подробности по итему
     *
     */
    detail(item) {
        // модальное окно с подробностями по лиду через id аукциона
        let modal = this.modalCtrl.create(ObtainDetailPage, {itemId: item.auctionId, item: item, roles: this.roles});
        modal.present();

        if(item.isSeen == 0) {

            // помечаем итем что он уже просмотрен
            this.obtain.markSeenAuction({auctionId: item.auctionId})
            // обработка ответа
                .subscribe(result => {
                    // при получении ответа

                    // переводим ответ в json
                    let data = result.json();

                    // console.log('данные обнуления баджей:');
                    // console.log(data);

                    if (data.status == 'success') {
                        item.isSeen = 1;

                        this.events.publish('badge:set', data.un_seen_count);

                        // data.un_seen_count


                        // this.badge.set(date)

                    }


                    // console.log('Данные агента: ');
                    // console.log(data);

                }, err => {
                    // в случае ошибки

                    console.log('ERROR: ' + err);
                });

        }



    }


    customerPage() {
        // this.navCtrl.setRoot(CustomersPage);

        // let modal = this.modalCtrl.create(CustomersPage);
        // modal.present();
        this.events.publish("main:openCustomer");

        // CustomersPage
    }

}
