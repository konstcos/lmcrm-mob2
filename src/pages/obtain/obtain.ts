import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController, ModalController} from 'ionic-angular';

import {Obtain} from '../../providers/obtain';
import {ObtainDetailPage} from "../obtain-detail/obtain-detail";


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
     * Конструктор класса
     *
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public obtain: Obtain,
                public loadingCtrl: LoadingController,
                public modalCtrl: ModalController) {
    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad ObtainPage');
    }


    /**
     * Срабатывает когда открывается страница
     *
     */
    ionViewWillEnter() {

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

        // заводим переменную с присутствующими лидами в true
        this.isThereStillItems = true;

        // получение итемов с сервера
        this.get()
        // обработка итемов
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                // вычесляем количество итемов
                let itemsLength = data.auctionItems.length;

                // обработка итемов
                if (itemsLength != 0) {
                    // если больше нуля

                    // добавляем полученные итемы на страницу
                    this.items = data.auctionItems;

                } else {
                    // если итемов нет

                    // todo сообщаем что итемов нет

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

        // очищаем итемы
        this.items = [];

        // заводим переменную с присутствующими лидами в true
        this.isThereStillItems = true;

        // инициация окна загрузки
        let loading = this.loadingCtrl.create({
            content: 'Receiving leads, please wait...'
        });

        // показ окна загрузки
        loading.present();


        // получение итемов с сервера
        this.get()
        // обработка итемов
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                // вычесляем количество итемов
                let itemsLength = data.auctionItems.length;

                // обработка итемов
                if (itemsLength != 0) {
                    // если больше нуля

                    // добавляем полученные итемы на страницу
                    this.items = data.auctionItems;

                } else {
                    // если итемов нет

                    // todo показываем оповещение что итемов нет

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
     * Подгрузка следующей партии итемов
     *
     */
    loadMore(infiniteScroll) {

        // todo проверка это конец списка или нет

        console.log('сработал инфинити');

        if( this.isThereStillItems ){

            // получение итемов с сервера
            this.get()
            // обработка итемов
                .subscribe(result => {
                    // при получении итемов

                    // переводим ответ в json
                    let data = result.json();

                    // вычесляем количество итемов
                    let itemsLength = data.auctionItems.length;

                    // обработка итемов
                    if (itemsLength != 0) {
                        // если больше нуля

                        // добавляем полученные итемы на страницу
                        this.items = this.items.concat( data.auctionItems );

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
        return this.obtain.get({offset: offset, filter: this.filter});
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
        let modal = this.modalCtrl.create(ObtainDetailPage, {item: item});
        modal.present();
    }

}
