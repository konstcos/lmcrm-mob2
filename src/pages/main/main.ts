/**
 * Основные модули приложения
 */
import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Nav, MenuController, Events, Content} from 'ionic-angular';


/**
 * Провайдеры
 */

// модель пользователя
import {User} from "../../providers/user";


/**
 * Страницы
 */

// страница лдов пользователя с аукциона
import {ObtainPage} from '../obtain/obtain';
// страница с отдаными лидами пользователем
import {DepositedPage} from '../deposited/deposited';
// страница с открытыми лидами
import {OpenPage} from '../open/open';
// страница авторизации
import {LoginPage} from '../login/login';
// страница для фильтрования лидов
import {CustomersPage} from '../customers/customers';
// страница добавления нового лида
import {AddLeadPage} from '../add-lead/add-lead';
// добвление страницы салесмана
import {SalesmenPage} from '../salesmen/salesmen'
// добвление страницы статистики
import {StatisticsPage} from '../statistics/statistics'
// добвление страницы управления деньгами
import {CreditsPage} from '../credits/credits'
// страница сообщений
import {MessagesPage} from '../messages/messages'

/*
 Основная страница приложения.

 На странице расположенны основные данные для работы пользователя,
 основное меню и три таба по работе с лидами.
 На эту страницу пользователь будет попадать сразу после залогинивания,
 */
@Component({
    selector: 'page-main',
    templateUrl: 'main.html',
    // providers: [Content]

})
export class MainPage {

    @ViewChild(Content) content: Content;

    /**
     * Инициация страниц
     */

        // страница входящих лидов
    obtain: any = ObtainPage;
    // отданные лиды
    deposited: any = DepositedPage;
    // открытые лиды
    open: any = OpenPage;


    notices: number = 0;


    /**
     * Заголовки табов
     */

        // входящие лиды (которые на аукционе пользователя)
    obtainTitle = "INCOMING";
    // отданные лиды
    depositedTitle = "OUTGOING";
    // открытые лиды
    openTitle = "OPEN";


    /**
     * Текущая дочерняя страница
     *
     */
    childPage: string = 'obtain';


    /**
     * Данные по фильтру
     *
     */
    filter: any = {
        sphere: 0,
        mask: 0,
        openLeadStatus: 0,
        leadStatus: 0,
        source: 0,
        notOpenOnly: 0,
        period: {
            from: null,
            to: null,
        },
    };


    /**
     * Все сферы пользователя
     *
     */
    spheres: any = [];


    /**
     * Текущие маски пользователя
     *
     */
    currentMasks: any = [];


    /**
     * Статусы открытых лидов по сфере
     *
     */
    openLeadStatuses: any = [];


    /**
     * Статусы лида
     *
     */
    leadStatuses: any = [
        {id: 1, name: 'New Lead', status: false},
        {id: 2, name: 'Operator', status: false},
        {id: 3, name: 'Auction', status: false},
        {id: 4, name: 'Closed Deal', status: false},
    ];


    /**
     * Источник получения лида
     *
     */
    leadSources: any = [
        {id: 1, name: 'Private Group', status: false},
    ];

    /**
     * Локал сторедж
     *
     * По открытым лидам
     *    openLeadFilter
     *
     * По отданным лидам
     *    depositedFilter
     *
     * По полученным лидам
     *    obtainFilter
     *
     */


    /**
     * Страницы меню
     */

    pages: Array<{title: string, component: any}>;


    /**
     * Конструктор класса
     *
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public nav: Nav,
                public user: User,
                public menuCtrl: MenuController,
                public events: Events,
                // public content: Content
    ) {


        this.notices = Number(localStorage.getItem('notice'));

        this.events.subscribe("notices:clear", () => {
            this.notices = 0;
        });

        // events.subscribe("child:test", (items)=> {
        //     this.setNewNotices(items);
        // });

        // задаются страницы в меню, название и сама страница
        this.pages = [

            // страница клиентов (тут будут все сферы)
            {title: 'Customers filters', component: CustomersPage},
            {title: 'Salesmen', component: SalesmenPage},
            {title: 'Statistic', component: StatisticsPage},
            {title: 'Credits', component: CreditsPage}
        ];


        // Получение всех сфер пользователя
        this.user.getSpheres()
        // подписываемся на получение результата
            .subscribe(resp => {
                // обработка результата

                // преобразование результата в json
                let res = resp.json();

                if (res.status == 'success') {

                    // добавляем сферы в модель
                    this.spheres = res.spheres;

                    // перебираем все сферы и добавляем status
                    for (let sphere in this.spheres) {

                        this.spheres[sphere]['status'] = false;

                        for (let mask in this.spheres[sphere]['masks']) {

                            this.spheres[sphere]['masks'][mask]['status'] = false;
                        }

                    }

                }

                console.log(res);

                console.log('сферы: ');
                console.log(this.spheres);

                // loading.dismiss();

            }, (err) => {

                console.log(err);

                // this.navCtrl.push(MainPage);
                // Unable to log in
                // let toast = this.toastCtrl.create({
                //     message: this.loginErrorString,
                //     duration: 3000,
                //     position: 'top'
                // });
                // toast.present();
                // loading.dismiss();
            });


    }


    setNewNotices(items) {
        // console.log('mainCTRL');
        // alert(typeof items);
        // alert('catch event function ' +items);

        // this.notices = this.notices + 1;
        this.notices = items;

        alert('catch event notices ' + this.notices);

    }

    /**
     * Действия по загрузке странице
     *
     */
    ionViewDidLoad() {

        this.events.subscribe("main:openCustomer", () => {
            // alert('открытие страницами');
            this.nav.setRoot(CustomersPage);
        });


        /**
         * Смена основной страницы пользователя
         *
         */
        this.events.subscribe("page:change", (data) => {

            this.childPage = data.page;


            // todo получения данных из локалстореджа в зависимости от страницы нахождения


            // пересчет данных фильтра
            this.filterRecount();

            console.log('сменилась страница');
            console.log(data);
        });


        this.menuCtrl.swipeEnable(false, 'filter');


        this.events.subscribe("child:test", (items) => {
            // this.setNewNotices(items);

            this.notices = items;

            // this.content.resize();

            // alert('catch event ' +items);
        });

    }


    /**
     * Выбор сферы фильтра
     *
     */
    selectSphereFilter(sphere) {

        // перебираем все сферы и добавляем status
        for (let currentSphere in this.spheres) {

            if (this.spheres[currentSphere]['id'] == sphere['id'] && this.spheres[currentSphere]['status']) {

                this.spheres[currentSphere]['status'] = false;

                // очистка масок
                for (let mask in this.spheres[currentSphere]['masks']) {

                    this.spheres[currentSphere]['masks'][mask]['status'] = false;
                }

                this.filter.sphere = 0;
                this.currentMasks = [];
                break;
            }


            this.spheres[currentSphere]['status'] = false;

            // очистка масок
            for (let mask in this.spheres[currentSphere]['masks']) {

                this.spheres[currentSphere]['masks'][mask]['status'] = false;
            }

            if (this.spheres[currentSphere]['id'] == sphere['id']) {
                this.spheres[currentSphere]['status'] = true;

                this.filter.sphere = sphere['id'];
                this.currentMasks = sphere.masks;

                // получение всех статусов по открытому лиду
                this.getOpenLeadStatuses(sphere['id']);

                // todo запоминать по локалСтореджу
            }

        }

    }


    /**
     * Выбор маски фильтра
     *
     */
    selectMaskFilter(mask) {

        // перебираем все сферы и добавляем status
        for (let currentMask in this.currentMasks) {

            if (this.currentMasks[currentMask]['id'] == mask['id'] && this.currentMasks[currentMask]['status']) {

                this.currentMasks[currentMask]['status'] = false;
                this.filter.mask = 0;
                break;
            }


            this.currentMasks[currentMask]['status'] = false;

            if (this.currentMasks[currentMask]['id'] == mask['id']) {
                this.currentMasks[currentMask]['status'] = true;

                this.filter.mask = mask['id'];

                // todo запоминать по локалСтореджу
            }

        }

    }


    /**
     * Получение всех статусов открытого лида по сфере
     */
    getOpenLeadStatuses(sphereId) {

        this.user.getSphereStatuses(sphereId)
            .subscribe(result => {
                // If the API returned a successful response, mark the user as logged in

                let data = result.json();

                console.log(data);

                if (data.status == 'success') {

                    this.openLeadStatuses = data.statuses;

                    // перебираем все сферы и добавляем status
                    for (let openLeadStatus in this.openLeadStatuses) {

                        if (this.openLeadStatuses[openLeadStatus]['id'] == this.filter.openLeadStatus) {

                            this.openLeadStatuses[openLeadStatus]['status'] = true;

                        } else {

                            this.openLeadStatuses[openLeadStatus]['status'] = false;
                        }

                    }
                }

            }, err => {
                console.error('ERROR', err);
                // alert('ERROR: ' + err);
            });

        console.log('Статусы открытого лида');
    }


    /**
     * Выбор статуса открытого лида
     *
     */
    selectOpenLeadStatuses(status) {


        // перебираем все сферы и добавляем status
        for (let openLeadStatus in this.openLeadStatuses) {

            if (this.openLeadStatuses[openLeadStatus]['id'] == status['id'] && this.openLeadStatuses[openLeadStatus]['status']) {

                this.openLeadStatuses[openLeadStatus]['status'] = false;
                this.filter.openLeadStatus = 0;
                break;
            }


            this.openLeadStatuses[openLeadStatus]['status'] = false;

            if (this.openLeadStatuses[openLeadStatus]['id'] == status['id']) {
                this.openLeadStatuses[openLeadStatus]['status'] = true;

                this.filter.openLeadStatus = status['id'];

                // todo запоминать по локалСтореджу
            }

        }

    }


    /**
     * Выбор статуса лида
     *
     */
    selectLeadStatuses(status) {

        // перебираем все сферы и добавляем status
        for (let leadStatus in this.leadStatuses) {

            if (this.leadStatuses[leadStatus]['id'] == status['id'] && this.leadStatuses[leadStatus]['status']) {

                this.leadStatuses[leadStatus]['status'] = false;
                this.filter.leadStatus = 0;
                break;
            }


            this.leadStatuses[leadStatus]['status'] = false;

            if (this.leadStatuses[leadStatus]['id'] == status['id']) {
                this.leadStatuses[leadStatus]['status'] = true;

                this.filter.leadStatus = status['id'];

                // todo запоминать по локалСтореджу
            }

        }

    }


    /**
     * Выбор статуса лида
     *
     */
    selectLeadSource(source) {

        // перебираем все сферы и добавляем status
        for (let leadSource in this.leadSources) {

            if (this.leadSources[leadSource]['id'] == source['id'] && this.leadSources[leadSource]['status']) {

                this.leadSources[leadSource]['status'] = false;
                this.filter.source = 0;
                break;
            }


            this.leadSources[leadSource]['status'] = false;

            if (this.leadSources[leadSource]['id'] == source['id']) {
                this.leadSources[leadSource]['status'] = true;

                this.filter.source = source['id'];

                // todo запоминать по локалСтореджу
            }

        }

    }


    /**
     * Выбор только не открытых лидов
     *
     */
    selectNotOpenOnly() {

        this.filter.notOpenOnly = !this.filter.notOpenOnly;
    }


    /**
     * Открытие страницы меню
     *
     */
    openPage(page) {

        // переход на страницу
        this.nav.setRoot(page.component);

        // переход на страницу с кнопкой возврата назад
        //  this.navCtrl.push(page.component);
    }


    /**
     * Обновление данных по фильтрам
     *
     * Локал сторедж
     *
     * По открытым лидам
     *    openLeadFilter
     *
     * По отданным лидам
     *    depositedFilter
     *
     * По полученным лидам
     *    obtainFilter
     *
     */
    filterUpdate() {

        let filterData = {};

        let storageData = '';

        // получение данных с локалстореджа в зависимости от текущей страницы
        if (this.childPage == 'open') {
            // страница открытых лидов
            storageData = localStorage.getItem('openLeadFilter');

        } else if (this.childPage == 'deposited') {
            // страница отданных лидов
            storageData = localStorage.getItem('depositedFilter');

        } else if (this.childPage == 'obtain') {
            // страница фильтра
            storageData = localStorage.getItem('obtainFilter');

        }

        console.log('Сохраненные данные по фильтру');
        console.log(storageData);

        if (!storageData) {
            this.filter = {
                sphere: 0,
                mask: 0,
                openLeadStatus: 0,
                leadStatus: 0,
                source: 0,
                notOpenOnly: 0,
                period: {
                    from: null,
                    to: null,
                },
            };

        } else {

            this.filter = JSON.parse(storageData);

            console.log('данные по фильтру');
            console.log(storageData);
        }


        this.filterRecount();

    }


    /**
     * Пересчет фильтра
     *
     */
    filterRecount() {

        // пересчет сферы
        // перебираем все сферы и добавляем status
        for (let currentSphere in this.spheres) {

            this.spheres[currentSphere]['status'] = false;

            if (this.spheres[currentSphere]['id'] == this.filter.sphere) {

                this.spheres[currentSphere]['status'] = true;

                this.currentMasks = this.spheres[currentSphere].masks;

                // получение всех статусов по открытому лиду
                this.getOpenLeadStatuses(this.spheres[currentSphere]['id']);

                // todo запоминать по локалСтореджу
            }

        }

        // пересчет масок
        for (let currentMask in this.currentMasks) {

            this.currentMasks[currentMask]['status'] = false;

            if (this.currentMasks[currentMask]['id'] == this.filter.mask) {

                this.currentMasks[currentMask]['status'] = true;

                // todo запоминать по локалСтореджу
            }

        }


        // пересчет статус открытого лида делается в методе получения статусов, сразу после их получения с сервера


        // пересчет статус лида
        for (let leadStatus in this.leadStatuses) {

            this.leadStatuses[leadStatus]['status'] = false;

            if (this.leadStatuses[leadStatus]['id'] == this.filter.leadStatus) {

                this.leadStatuses[leadStatus]['status'] = true;

                // todo запоминать по локалСтореджу
            }

        }


        // todo пересчет источника
        for (let leadSource in this.leadSources) {

            this.leadSources[leadSource]['status'] = false;

            if (this.leadSources[leadSource]['id'] == this.filter.source) {

                this.leadSources[leadSource]['status'] = true;

                // todo запоминать по локалСтореджу
            }

        }

    }


    /**
     * Применение фильтра
     *
     */
    filterApply() {

        // сохранение фильтра в локласторедже, в зависимости от страницы
        if (this.childPage == 'open') {
            // страница открытых лидов
            localStorage.setItem('openLeadFilter', JSON.stringify(this.filter));

            this.events.publish('openLeadFilter');

        } else if (this.childPage == 'deposited') {
            // страница отданных лидов
            localStorage.setItem('depositedFilter', JSON.stringify(this.filter));

            this.events.publish('depositedFilter');

        } else if (this.childPage == 'obtain') {
            // страница фильтра
            localStorage.setItem('obtainFilter', JSON.stringify(this.filter));

            this.events.publish('obtainFilter');
        }

        // todo публикация события на обновление данных на странице

    }


    /**
     * Применение фильтра
     *
     */
    filterReset() {

        this.filter = {
            sphere: 0,
            mask: 0,
            openLeadStatus: 0,
            leadStatus: 0,
            source: 0,
            notOpenOnly: 0,
            period: {
                from: null,
                to: null,
            },
        };

        // сохранение фильтра в локласторедже, в зависимости от страницы
        if (this.childPage == 'open') {
            // страница открытых лидов
            localStorage.setItem('openLeadFilter', JSON.stringify(this.filter));

            this.events.publish('openLeadFilter');

        } else if (this.childPage == 'deposited') {
            // страница отданных лидов
            localStorage.setItem('depositedFilter', JSON.stringify(this.filter));

            this.events.publish('depositedFilter');

        } else if (this.childPage == 'obtain') {
            // страница фильтра
            localStorage.setItem('obtainFilter', JSON.stringify(this.filter));

            this.events.publish('obtainFilter');
        }

        // todo публикация события на обновление данных на странице

    }


    /**
     * Открытие страницы масок агента (список сфер агента)
     *
     */
    openSalesmen() {

        this.nav.setRoot(SalesmenPage);
    }


    /**
     * Открытые меню
     */
    mainMenuOpen() {

        // открывает главное меню
        this.menuCtrl.open();
    }


    /**
     * Открывает фильтр
     */
    filterOpen() {

        // получение данных по фильтру
        this.filterUpdate();

        // отключение главного меню
        this.menuCtrl.enable(false, 'main_menu');
        // включение фильтра
        this.menuCtrl.enable(true, 'filter');

        // открытие фильтра
        this.menuCtrl.open();
    }


    /**
     * Действия по закрытию фильтра
     *
     * выключает фильтр и включает основное меню
     */
    filterClose() {

        // включение основного меню
        this.menuCtrl.enable(true, 'main_menu');
        // выключение фильтра
        this.menuCtrl.enable(false, 'filter');
    }


    /**
     * Переход на страницу создания нового лида
     *
     */
    addLead() {

        // переход на страницу создания нового лида
        // this.nav.setRoot(AddLeadPage);
        this.nav.push(AddLeadPage);
    }


    /**
     * Обнулить период
     *
     */
    resetPeriod() {

        this.filter.period.from = null;
        this.filter.period.to = null;

    }


    openMessages() {

        this.nav.setRoot(MessagesPage);

    }


    /**
     * Разлогинивание пользователя
     *
     */
    logout() {

        // метод разлогинивания
        this.user.logout();
        // переход на страницу логина
        this.nav.setRoot(LoginPage);
    }


    testClick() {
        this.events.publish("child:test");
    }

}
