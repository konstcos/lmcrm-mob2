import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController, ModalController} from 'ionic-angular';

import {OpenDetailPage} from '../open-detail/open-detail'

import {User} from '../../providers/user';
import {Settings} from '../../providers/settings';
import { Storage } from '@ionic/storage';

import {Open} from '../../providers/open';


/*
 Generated class for the Open page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-open',
    templateUrl: 'open.html'
})
export class OpenPage {


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


    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public user: User,
        public settings: Settings,
        public storage: Storage,
        public open: Open,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController) {


        storage.ready().then(() => {

            console.log('сторедж');
            console.log( storage.driver );

            // storage.set('name', 'Max');
            // storage.set('aaa', 'ddd');


            storage.keys().then(data=>{
                console.log('сторедж:');
                console.log(data);
            });

            storage.get('name').then((val) => {
                console.log('get name');
                console.log(val);
            });

            // settings.allSettings().then(data=>{
            //     console.log('settings:');
            //     console.log(data)
            // });

            // setValue
            // settings.setValue('swer', '678');
            console.log('получилось:');
            console.log( settings.settings );

            // settings.settings['swer'] = '11111111';

            // storage.keys(data=>{
            //     console.log(data);
            // });

            // aaa.subscribe(data=>{
            //     console.log(data);
            // });

            // set a key/value
            // storage.set('name', 'Max');

            // Or to get a key/value pair
            // storage.get('age').then((val) => {
            //     console.log('Your age is', val);
            // })
        });

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad OpenPage');
        console.log( this.settings.settings );
    }


    ionViewWillEnter() {
        console.log('OpenPage View');

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
                let itemsLength = data.openedLeads.length;

                // обработка итемов
                if (itemsLength != 0) {
                    // если больше нуля

                    // добавляем полученные итемы на страницу
                    this.items = data.openedLeads;

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

                console.log('получил open: ');
                console.log(data);

                // вычесляем количество итемов
                let itemsLength = data.openedLeads.length;

                // обработка итемов
                if (itemsLength != 0) {
                    // если больше нуля

                    // добавляем полученные итемы на страницу
                    this.items = data.openedLeads;

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
                    let itemsLength = data.openedLeads.length;

                    // обработка итемов
                    if (itemsLength != 0) {
                        // если больше нуля

                        // добавляем полученные итемы на страницу
                        this.items = this.items.concat( data.openedLeads );

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
        return this.open.get({offset: offset, filter: this.filter});
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
        let modal = this.modalCtrl.create(OpenDetailPage, {item: item});
        modal.present();
    }

}
