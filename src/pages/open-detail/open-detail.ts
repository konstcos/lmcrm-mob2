import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController, ViewController, ModalController, Events, ToastController} from 'ionic-angular';
import {OpenLeadStatusesPage} from "../open-lead-statuses/open-lead-statuses";
import {OpenLeadOrganizerPage} from "../open-lead-organizer/open-lead-organizer";
import {TranslateService} from 'ng2-translate/ng2-translate';
import {Open} from '../../providers/open';

import {CallNumber} from '@ionic-native/call-number';
import {OpenLeadDealPage} from "../open-lead-deal/open-lead-deal";
import { Clipboard } from '@ionic-native/clipboard';

/*
 Generated class for the OpenDetail page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-open-detail',
    templateUrl: 'open-detail.html',
    providers: [Open, CallNumber, Clipboard]
})
export class OpenDetailPage {


    /**
     * Данные итема
     *
     */
    public item: any = false;


    /**
     *  id лида
     *
     */
    public leadId: any = false;


    /**
     * id открытого лида
     *
     */
    public openLeadId: any = false;


    /**
     * Переход со страницы obtain
     *
     */
    public fromObtain: any = false;


    /**
     * Роли пользователя
     *
     */
    public roles: any = {
        role: 'any',
        subRole: 'any',
    };


    /**
     * Указание на необходимость обновления
     * родительского компонента
     *
     */
    public reloadNeeded: boolean = false;


    /**
     * Области с данными на странице
     *
     */
    public sections: any = {
        // область со спинером загрузки
        loading: true,
        // область с данными
        data: false,
        // подтверждение отправки лида на аукцион
        auction: false,
        // вывод ошибки
        error: false
    };


    constructor(public navCtrl: NavController,
                public view: ViewController,
                public navParams: NavParams,
                public modalCtrl: ModalController,
                public events: Events,
                public open: Open,
                public translate: TranslateService,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                private clipboard: Clipboard,
                private callNumber: CallNumber) {

        // получение id открытого лида
        let itemId = navParams.get('itemId');

        // получение ролей, если они есть
        this.roles = navParams.get('roles');

        // компонент может выбираться из разных мест,
        // в каждом месте свои нюансы, поэтому
        // выборка данных так усложненна
        // позже, желательно, доделать

        // проверка наличия id открытого лида
        if (itemId) {
            // если передан id открытого лида

            // сохраняем его id в компоненте
            this.openLeadId = itemId;
            this.loadData();

        } else {
            // если итема нет

            // получение имени компонента,
            // с которого был вызван этот компонент
            let pageFrom = navParams.get('pageFrom');

            // проверка имени родительского компонента
            if (pageFrom != 'organizer') {
                // если страница вызвана не с органайзера

                // сохраняе в компоненте что нужно вернутся
                // на страницу incoming
                this.fromObtain = true;
            }

            // попытка найти id открытого лида
            let openLeadId = navParams.get('openLeadId');

            // проверка наличия id открытого лида
            if (openLeadId) {
                // если есть

                // сохраняем id открытого лида в компоненте
                this.openLeadId = openLeadId;

                // подгрузка итемов с сервера
                this.loadData();

            } else {
                // если нет

                // попытка найти id лида
                this.leadId = navParams.get('leadId');

                // проверка наличия id лида
                if (this.leadId) {
                    // если id лида есть
                    // подгружаем итемы с сервера
                    this.loadDataByLeadId();

                } else {
                    // если итема нет

                    // выводим страницу с ошибками
                    this.section('error');
                }
            }
        }
    }


    /**
     * Событие при загрузки компонента
     *
     */
    ionViewDidLoad() {
    }


    /**
     * Переключение областей на странице
     *
     * три области на странице:
     *     loading - область со спинером загрузки, показывается во время загрузки
     *     data - область с данными, показывается когда данные успешно загруженны
     *     auction - подтверждение отправки лида на аукцион
     *     error - область с ошибками, появляется во время ошибки загрузки
     */
    section(sectionName: any = false) {

        // закрываются все разделы
        this.closeAllSections();

        switch (sectionName) {

            case 'loading':
                // область со спинером загрузки
                this.sections.loading = true;
                break;

            case 'data':
                // область основных данных
                this.sections.data = true;
                break;

            case 'auction':
                // вывод ошибки
                this.sections.auction = true;
                break;

            case 'error':
                // вывод ошибки
                this.sections.error = true;
                break;

            default:
                // alert('wrong area name');
                break;
        }
    }


    /**
     * Закрывает все области
     *
     */
    closeAllSections() {
        // закрытие всех областей
        for (let section in this.sections) {
            // перебираем все области
            // закрываем их
            this.sections[section] = false;
        }
    }


    /**
     * Окно смены статуса итема
     *
     */
    changeStatus(item) {
        // this.navCtrl.push(OpenLeadStatusesPage);

        // проверка статуса
        if (item.status_info && item.status_info.type == 5) {


            let modal = this.modalCtrl.create(OpenLeadDealPage, {item: item});

            modal.onDidDismiss(data => {

            });

            modal.present();

        } else {

            let modal = this.modalCtrl.create(OpenLeadStatusesPage, {item: item});

            modal.onDidDismiss(data => {


                if (data.status) {
                    item.status_info = data.status;
                    item.status = data.status.id;

                    if (data.dealPrice) {
                        item['close_deal_info'] = {
                            'price': data.dealPrice
                        };
                    }

                    for (let type in this.item.statuses) {

                        for (let stat of this.item.statuses[type]) {

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

            });

            modal.present();

        }
    }


    /**
     * Загрузка данных открытого лида по id открытого лида
     *
     */
    loadData() {

        // проверка наличия id открытого лида
        if (!this.openLeadId) {
            // если его нет
            // переходим на страницу ошибки
            this.section('error');
            return false;
        }

        // выбираем id открытого лида
        // для удобства
        let openLeadId = this.openLeadId;

        // включаем блок спинера загрузки
        this.section('loading');

        // запрос на получение данных
        this.open.loadOpenLeadData(openLeadId)
            .subscribe(result => {
                // данные с сервера получены успешно

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                // определяем статус запроса
                if (data.status == 'success') {
                    // при успешном статусе

                    // заносим данные в модель
                    // данные итема
                    this.item = data.data.openLead;
                    // данные роли
                    this.roles.role = data.data.roles.role;
                    // данные дополнительной роли
                    this.roles.subRole = data.data.roles.subRole;

                    // выводим секцию с данными
                    this.section('data');

                } else {
                    // при ошибке

                    // выводим секцию с ошибкой
                    this.section('error');
                }

            }, err => {
                // ошибка при получении данных с сервера

                // выводим секцию с ошибкой
                this.section('error');
            });

    }


    /**
     * Подгрузки итемов открытого лида по id лида
     *
     */
    loadDataByLeadId() {

        // проверка наличия id лида
        if (!this.leadId) {
            // если его нет
            // переходим на страницу ошибки
            this.section('error');
            return false;
        }

        // если есть id лида

        // выбираем id лида для удобства
        let leadId = this.leadId;

        // включаем блок спинера загрузки
        this.section('loading');

        // запрос на получение данных
        this.open.loadOpenLeadDataByLeadId(leadId)
            .subscribe(result => {
                // данные с сервера получены успешно
                // переводим ответ в json
                let data = result.json();

                // определяем статус запроса
                if (data.status == 'success') {
                    // при успешном статусе

                    // заносим данные в модель
                    // данные итема
                    this.item = data.data.openLead;
                    // данные роли
                    this.roles.role = data.data.roles.role;
                    // данные дополнительной роли
                    this.roles.subRole = data.data.roles.subRole;

                    // выводим секцию с данными
                    this.section('data');

                } else {
                    // при ошибке

                    // выводим секцию с ошибкой
                    this.section('error');
                }

            }, err => {
                // ошибка при получении данных с сервера

                // выводим секцию с ошибкой
                this.section('error');
            });

    }

    /**
     * Окно органайзера
     *
     */
    openLeadOrganizer() {

        let modal = this.modalCtrl.create(OpenLeadOrganizerPage, {itemsId: this.item.id});

        modal.present();
    }


    /**
     * Подтверждение отправки лида на аукцион
     */
    auctionConfirmation() {
        this.section('auction');
    }


    /**
     * Отмена отправки лида на аукцион
     *
     */
    auctionCanceled() {
        this.section('data');
    }


    /**
     * Сделать телефонный звонок
     *
     */
    makeCall(item) {

        this.callNumber.callNumber(item.lead.phone.phone, true)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.log('Error launching dialer'));
    }


    /**
     * Обновление данных на странице
     *
     */
    refresh() {

        // проверка наличия id лида в компоненте
        if (this.leadId) {
            // если он есть, загружаем по нему данные
            this.loadDataByLeadId();
            return true;
        }

        // если в компоненте не сохранен id лида

        // проверяем наличие id открытого лида
        if (this.openLeadId) {
            // если есть - загружаем данные по id открытого лида
            this.loadData();
            return true;
        }

        // в компоненте нет ни id лида,
        // ни id открытого лида

        // выходим из метода
        return false;
    }


    /**
     * Отправка лида на аукцион
     *
     */
    sendToAuction() {

        let loader = this.loadingCtrl.create({
            content: "Please wait...",
        });
        loader.present();

        // запрос на отправку лида на аукцион
        this.open.sendLeadToAuction({id: this.item.id})
            .subscribe(result => {
                // при получении итемов

                // переводим ответ в json
                let data = result.json();

                // проверка на ошибку
                if (data.status === 'fail') {
                    // если ошибка есть

                    // убираем загрузчик
                    loader.dismiss();
                    // выводим ошибку
                    this.section('error');
                    // выходим из метода
                    return false;
                }

                // убираем загрузчик
                loader.dismiss();
                // указание что родительский
                // компонент нужно обновить
                this.reloadNeeded = true;
                // закрыть текущий компонент
                this.close();

            }, err => {
                // в случае ошибки

                // убираем загрузчик
                loader.dismiss();
                // выводим ошибку
                this.section('error');
            });
    }


    /**
     * Копирование имени в буфер обмена
     *
     */
    copyNameToClipboard() {

        // формируем имя лида
        let name = this.item.lead.name;
        // добавляем фамилию, если есть
        name += this.item.lead.surname ? ' ' + this.item.lead.surname : '';

        // формируем текст для оповещения в тосте
        let name_text = '';
        // получаем перевод
        this.translate.get('open_lead_deal.name_copied_to_clipboard', {name: name}).subscribe((res: any) => {
            name_text = res;
        });

        // копируем имя в буфер омбена
        this.clipboard.copy(name);

        // показываем тост с сообщением
        let toast = this.toastCtrl.create({
            message: name_text,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    }


    /**
     * Копирование телефона в буфер обмена
     *
     */
    copyPhoneToClipboard() {

        // копирование данных в буфер обмена
        this.clipboard.copy(this.item.lead.phone.phone);

        // формируем текст для оповещения в тосте
        let phone_text = '';
        // получаем перевод
        this.translate.get('open_lead_deal.phone_copied_to_clipboard', {phone_number: this.item.lead.phone.phone}).subscribe((res: any) => {
            phone_text = res;
        });

        // показываем тост с сообщением
        let toast = this.toastCtrl.create({
            message: phone_text,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();

    }


    /**
     * Закрытие окна
     *
     */
    close() {

        // проверка указания на обновления
        if(this.reloadNeeded) {
            // если есть указание на обновление
            // закрыть окно и обновить предыдущий компонент
            this.view.dismiss({reload: true});
        }

        // проверка секции аукциона
        if (this.sections.auction) {
            // если открыт раздел аукциона
            // переходим на раздел данных
            this.section('data');
            // выходим из метода
            return false;
        }

        // проверка компонента с которого
        // попали в этот компонент
        if (this.fromObtain) {
            // если пришли со страницы Incoming
            // т.е. окно данных открылось сразу
            // после открытия лида
            // принудительно переходим на открытые лиды
            this.events.publish('goTo:open');
        }

        // если компонент вызван с компонента открытых лидов
        // возвращаемся в открытые лиды
        this.view.dismiss(this.item);
    }

}
