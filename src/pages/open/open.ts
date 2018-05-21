import {Component} from '@angular/core';
import {
    NavController,
    NavParams,
    LoadingController,
    ModalController,
    Events,
    ToastController,
    AlertController
} from 'ionic-angular';

import {TranslateService} from 'ng2-translate/ng2-translate';

import {OpenDetailPage} from '../open-detail/open-detail'
import {OpenLeadStatusesPage} from "../open-lead-statuses/open-lead-statuses";
import {OpenLeadOrganizerPage} from "../open-lead-organizer/open-lead-organizer";
import {OpenLeadDealPage} from "../open-lead-deal/open-lead-deal";

import {OpenLeadOrganizer} from '../../providers/open-lead-organizer';
import {User} from '../../providers/user';
import {Settings} from '../../providers/settings';
import {Storage} from '@ionic/storage';

import {Open} from '../../providers/open';

import {CallNumber} from '@ionic-native/call-number';

/*
 Generated class for the Open page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    providers: [CallNumber],
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
     * Голосовые записи
     */
    public voices: any = {};


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public user: User,
                public settings: Settings,
                public storage: Storage,
                public open: Open,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                public modalCtrl: ModalController,
                public organizer: OpenLeadOrganizer,
                public alertCtrl: AlertController,
                public events: Events,
                private callNumber: CallNumber,
                public translate: TranslateService) {


        storage.ready().then(() => {

            console.log('сторедж');
            console.log(storage.driver);

            // storage.set('name', 'Max');
            // storage.set('aaa', 'ddd');


            storage.keys().then(data => {
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
            console.log(settings.settings);

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

        // отписываемся от события по смене фильтра
        this.events.unsubscribe('openLeadFilter');

        // событие по смене фильтра
        this.events.subscribe('openLeadFilter', () => {

            console.log('событие по фильтру в открытых лидах');

            this.filter = JSON.parse(localStorage.getItem('openLeadFilter'));

            this.loadItems();
        });


        this.events.unsubscribe('openLeadFilterChange');

        // событие по смене фильтра
        this.events.subscribe('openLeadFilterChange', (data) => {

            this.isFilterOn = data.status;
        });
    }


    ionViewWillEnter() {
        // console.log('OpenPage View');

        this.isFilterOn = localStorage.getItem('openLeadFilterOn') && localStorage.getItem('openLeadFilterOn') == 'true';


        // событие на смену страницы
        this.events.publish("page:change", {page: 'open'});

        // todo событие по смене фильтра
        // this.events.subscribe('openLeadFilter', () => {
        //
        //     console.log('событие по фильтру в открытых лидах');
        //
        //     this.filter = JSON.parse(localStorage.getItem('openLeadFilter'));
        //
        //     this.loadItems();
        // });

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

                /**
                 * Количество уведомлений
                 *
                 */
                let notices = {
                    notice: data.notices,
                    auction: data.auctionCount,
                };

                // console.log('Баджи из отданных лидов');
                console.log(notices);
                // применение нотификаций к апликации
                this.checkNotices(notices);

                // вычесляем количество итемов
                let itemsLength = data.openedLeads.length;

                // обработка итемов
                if (itemsLength != 0) {
                    // если больше нуля

                    // получаем записи разговоров
                    // по полученным итемам
                    // this.getVoices(data.openedLeads);

                    // добавляем полученные итемы на страницу
                    this.items = data.openedLeads;

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
     * Метод проверки уведомлений
     *
     */
    checkNotices(notices) {
        this.events.publish('notice:new', notices.notice);
        this.events.publish('badge:set', notices.auction);
    }


    /**
     * Загрузк итемов открытых лидов в модель
     *
     */
    loadItems() {

        // console.log('привет от фильтра');

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

                /**
                 * Количество уведомлений
                 *
                 */
                let notices = {
                    notice: data.notices,
                    auction: data.auctionCount,
                };

                // console.log('Баджи из отданных лидов');
                // console.log(data.notices);
                // применение нотификаций к апликации
                this.checkNotices(notices);

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

                // console.log('Роли:');
                // console.log(this.roles);

                // вычесляем количество итемов
                let itemsLength = data.openedLeads.length;

                this.isLoading = false;

                // обработка итемов
                if (itemsLength != 0) {
                    // если больше нуля

                    // получаем записи разговоров
                    // по полученным итемам
                    // this.getVoices(data.openedLeads);

                    // добавляем полученные итемы на страницу
                    this.items = data.openedLeads;

                } else {
                    // если итемов нет

                    // todo показываем оповещение что итемов нет
                    this.noItems = true;
                }

                // отключаем окно индикатора загрузки
                // loading.dismiss();

            }, err => {
                // в случае ошибки

                this.isLoading = false;

                console.log('ERROR: ' + err);

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

        console.log('сработал инфинити');

        if (this.isThereStillItems) {

            // получение итемов с сервера
            this.get()
            // обработка итемов
                .subscribe(result => {
                    // при получении итемов

                    // переводим ответ в json
                    let data = result.json();

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

                    /**
                     * Количество уведомлений
                     *
                     */
                    let notices = {
                        notice: data.notices,
                        auction: data.auctionCount,
                    };

                    // console.log('Баджи из отданных лидов');
                    // console.log(notices);
                    // применение нотификаций к апликации
                    this.checkNotices(notices);


                    // вычесляем количество итемов
                    let itemsLength = data.openedLeads.length;

                    // обработка итемов
                    if (itemsLength != 0) {
                        // если больше нуля

                        // получаем записи разговоров
                        // по полученным итемам
                        // this.getVoices(data.openedLeads);

                        // добавляем полученные итемы на страницу
                        this.items = this.items.concat(data.openedLeads);

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
        return this.open.get({offset: offset, filter: this.filter});
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

        // модальное окно со статусами
        let modal = this.modalCtrl.create(OpenDetailPage, {itemId: item.id, roles: this.roles});

        modal.onDidDismiss(data => {

            // item = data;

            // проверка на обновление
            if (data.reload) {
                // если есть указание на обновление
                // обновляем страницу
                this.loadItems();
            }

            item.status = data.status;
            item.status_info = data.status_info;
            item.close_deal_info = data.close_deal_info;

            console.log(data);

        });

        modal.present();
    }


    /**
     * Окно органайзера
     *
     */
    openLeadOrganizer(item) {


        let modal = this.modalCtrl.create(OpenLeadOrganizerPage, {itemsId: item.id});

        modal.present();


        // this.organizer.get({ openLeadId: item.id })
        //     .subscribe(result => {
        //
        //         // переводим ответ в json
        //         let data = result.json();
        //
        //         let modal = this.modalCtrl.create(OpenLeadOrganizerPage, {items: data});
        //
        //         modal.present();
        //
        //         console.log(data);
        //
        //     }, err => {
        //
        //         // в случае ошибки
        //
        //         console.log('ERROR: ' + err);
        //
        //         // todo выводится сообщение об ошибке (нету связи и т.д.)
        //
        //         // отключаем окно индикатора загрузки
        //         // infiniteScroll.complete();
        //
        //     });


    }


    /**
     * Архивировать итем
     *
     */
    archive(item) {

        console.log(item);

        this.open.archive({openLeadId: item.id, archive: !item.archive})
        // обработка итемов
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                // console.log(data);

                if (data.status == 'success') {

                    item.archive = data.info.archive;

                    let message = 'Archive error';

                    if (item.archive == 0) {

                        message = item.lead.name + ' extraction from archive';

                    } else if (item.archive == 1) {

                        message = item.lead.name + ' sent to the archive';
                    }

                    let toast = this.toastCtrl.create({
                        message: message,
                        duration: 3000,
                        position: 'bottom'
                    });
                    toast.present();

                } else {

                    console.log(data);

                    if (data.info == 'wrong_status') {


                        let alert = this.alertCtrl.create({
                            title: 'Cant archive',
                            message: 'You can not archive a lead with this status',
                            buttons: ['OK']
                        });
                        alert.present();


                        // let toast = this.toastCtrl.create({
                        //     message: 'Wrong status 123',
                        //     duration: 3000,
                        //     position: 'bottom'
                        // });
                        // toast.present();

                    } else {

                        let toast = this.toastCtrl.create({
                            message: 'Error in archiving',
                            duration: 3000,
                            position: 'bottom'
                        });
                        toast.present();
                    }


                }


            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)
            });

        // console.log('архивировать: ');
        // console.log(item.id);
    }


    /**
     * Сделать телефонный звонок
     *
     */
    makeCall(item) {
        // console.log(item.lead.phone.phone);

        this.callNumber.callNumber(item.lead.phone.phone, true)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.log('Error launching dialer'));
    }


    /**
     * Смена статуса
     *
     */
    changeStatus(item) {
        // this.navCtrl.setRoot(OpenLeadStatusesPage);

        // проверка статуса
        if (item.status_info && item.status_info.type == 5) {
            // если статус сделки

            console.log('сделка');
            // OpenLeadDealPage

            // console.log(statuses);
            let modal = this.modalCtrl.create(OpenLeadDealPage, {item: item});

            modal.onDidDismiss(data => {

                console.log('данные по сделкам');
                console.log(data);

            });

            modal.present();

        } else {
            // если обычный статус

            // console.log(statuses);
            let modal = this.modalCtrl.create(OpenLeadStatusesPage, {item: item});


            modal.onDidDismiss(data => {

                console.log('данные по статусу');
                console.log(data);

                console.log('итэм до: ');
                console.log(item);

                // перебираем статусы и меняем правильный
                if (data.status) {
                    // добавляем статус в модель
                    item.status_info = data.status;
                    item.status = data.status.id;

                    if (data.dealPrice) {
                        item['close_deal_info'] = {
                            'price': data.dealPrice
                        };
                    }

                    for (let type in item.statuses) {

                        for (let stat of item.statuses[type]) {

                            if (stat.id == data.status.id) {

                                stat.checked = false;
                                stat.lock = true;

                            } else {

                                stat.checked = false;
                            }
                        }
                    }

                    // проверка на роль
                    if (this.roles.subRole == 'dealmaker') {
                        // если диалмэкер

                        // открываем сделку (если это сделка)
                        if (item.status_info && item.status_info.type == 5) {
                            this.changeStatus(item);
                        }
                    }

                }

                // console.log(item);
                // console.log(data);
            });

            modal.present();
        }


        // // console.log(statuses);
        // let modal = this.modalCtrl.create(OpenLeadStatusesPage, {item: item});
        //
        // modal.onDidDismiss(data => {
        //
        //     console.log('данные по статусу');
        //     console.log(data);
        //
        //     if (data.status) {
        //         item.status_info = data.status;
        //         item.status = data.status.id;
        //
        //         for (let type in item.statuses) {
        //
        //             for (let stat of item.statuses[type]) {
        //
        //                 if (stat.id == data.status.id) {
        //
        //                     stat.checked = false;
        //                     stat.lock = true;
        //
        //                 } else {
        //
        //                     stat.checked = false;
        //                 }
        //
        //             }
        //         }
        //     }
        //
        //     // console.log(item);
        //     // console.log(data);
        // });
        //
        // modal.present();
    }


    /**
     * Окно подтверждения отправки открытого лида на аукцион
     *
     */
    sendToAuctionConfirmation(item) {

        let text = {
            "title": "Send to auction",
            "message": "The Lead will be sent for auction. It disappears from the Exposed section and appears in the Outgoing section. As with other introduced Leads, you will be able to profit from this Leads.",
            "cancel_button": "cancel",
            "apply_button": "send to auction"
        };

        this.translate.get('exposed_detail.send_to_auction', {}).subscribe((res: any) => {
            text['title'] = res['button_title'];
            text['message'] = res['text'];
            text['cancel_button'] = res['cancel_button'];
            text['apply_button'] = res['apply_button'];
        });

        // алерт подтверждения на передачу открытого лида на акуцион
        let prompt = this.alertCtrl.create({
            title: text['title'],
            message: text['message'],
            buttons: [
                {
                    text: text['cancel_button'],
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: text['apply_button'],
                    handler: data => {
                        console.log('Send clicked');
                        this.sendToAuction(item);
                    }
                }
            ]
        });
        prompt.present();


    }


    /**
     * Отправка лида на аукцион
     *
     */
    sendToAuction(item) {

        this.open.sendLeadToAuction({id: item.id})
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                console.log('пришел ответ с сервера');
                console.log(data);

                // проверка на ошибку
                if (data.status === 'fail') {
                    // если ошибка есть
                    console.log('Ошибка');
                    return false;
                }

                // если ошибки нет, обновляем страницу лидов
                this.loadItems();

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);

                // todo выводится сообщение об ошибке (нету связи и т.д.)

                // отключаем окно индикатора загрузки
            });

        console.log('пошел отправлять лид на аукцион');
        console.log(item);

    }


    customerPage() {

        this.events.publish("main:openCustomer");
    }


    /**
     * Условия, при которых блок итема с аудиозаписями будет показан
     *
     */
    isVoiceShow(item) {

        // if (this.voices[item.lead_id] && item.voiceShow && item.voiceShow == true) {
        if (item['voice'] && item.voiceShow && item.voiceShow == true) {
            // lead_id
            return true;
        }

        return false;
    }


    /**
     * Показать или спрятать блок с аудиозаписями итема
     *
     */
    switchVoiceShow(item) {

        // if (!this.voices[item.lead_id]) {
        //     return false;
        // }

        if (!item['voice']) {
            return false;
        }

        if (!item.voiceShow) {
            item.voiceShow = true;
            return true;
        }

        item.voiceShow = false;
        return true;
    }


    /**
     * Переход на страницу фильтров по фильтру
     *
     */
    goToIncomingPage() {
        // console.log('переход на страницу входящих лидов');
        this.events.publish("tab:switch_incoming", {});
    }

    /**
     * Получение голосовых записей по итемам
     *
     */
    getVoices(items) {

        // если итемов нет, выходим из метода
        if (items.length === 0) return false;

        // локальный массив с итемами по
        // которым нужно получить записи звуков
        let itemsIdArray = [];

        // если есть итемы
        // перебираем все и формируем
        // общий массив и локальный
        for (let item of items) {
            // запись в локальный массив
            itemsIdArray.push(item.lead_id);
            // запись в общий массив
            this.voices[item.lead_id] = 'loading';
        }

        // получение записей с сервера
        this.open.getVoices({leads: itemsIdArray})
        // обработка записей
            .subscribe(result => {
                // при удачном получении

                // переводим ответ в json
                let data = result.json();

                // проверка запроса
                if(data.status === 'success') {
                    // если успешний

                    // добавляем звуковые записи в объект
                    for(let item of itemsIdArray) {
                        this.voices[item] = data.voices[item] ? data.voices[item] : false;
                    }

                } else {
                    // при ошибке выставляем все в false
                    for(let item of itemsIdArray) {
                        this.voices[item] = false;
                    }
                }

            }, err => {
                // в случае ошибки

                // выставляем все записи в false
                for(let item of itemsIdArray) {
                    this.voices[item] = false;
                }

                console.log('ERROR 1: ' + err);
            });
    }

}
