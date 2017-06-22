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
// страница приватной группы
import {PrivateGroupPage} from '../private-group/private-group'
// страница органайзера
import {OrganizerPage} from '../organizer/organizer'

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
        mask: [],
        openLeadStatus: [{id: 0, name: 'No status', status: false}],
        leadStatus: [],
        source: [],
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
        {id: 1, name: 'Bad lead', status: false},
        {id: 2, name: 'New Lead', status: false},
        {id: 3, name: 'Auction', status: false},
        {id: 4, name: 'Closed Deal', status: false},
    ];


    /**
     * Источник получения лида
     *
     */
    leadSources: any = [
        {id: 1, name: 'Auction', status: false},
        {id: 2, name: 'For Deals', status: false},
        {id: 3, name: 'Private Group', status: false},
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
     * Фильтр включен или выключен
     *
     */
    public isFilterOn: boolean = false;

    /**
     * Страницы меню
     *
     */
    pages: Array<{title: string, component: any}>;

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
                public nav: Nav,
                public user: User,
                public menuCtrl: MenuController,
                public events: Events) {


        // this.notices = Number(localStorage.getItem('notice'));

        this.events.unsubscribe("notices:clear");

        this.events.subscribe("notices:clear", () => {
            this.notices = 0;
        });


        this.events.unsubscribe("roles:get",);
        this.events.subscribe("roles:get", (roles) => {
            // this.setNewNotices(items);

            // this.notices = data;

            this.roles.role = roles.role;
            this.roles.subRole = roles.subRole;

            console.log('Роли из главного компонента:');
            console.log(this.roles);

            // : any = {
            //     role: false,
            //     subRole: false,
            // };

            // this.content.resize();

            // alert('catch event ' +items);
        });


        // events.subscribe("child:test", (items)=> {
        //     this.setNewNotices(items);
        // });

        // задаются страницы в меню, название и сама страница
        this.pages = [

            // страница клиентов (тут будут все сферы)
            {title: 'Customers filters', component: CustomersPage},

            // Страница продавцов
            {title: 'Salesmen', component: SalesmenPage},

            // Статистика
            {title: 'Statistic', component: StatisticsPage},

            // Деньги
            {title: 'Credits', component: CreditsPage},

            // Приватная группа
            {title: 'Private Group', component: PrivateGroupPage},

            // Органайзер
            {title: 'Organizer', component: OrganizerPage}
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

        this.events.unsubscribe("notice:new");

        this.events.subscribe("notice:new", (items) => {

            console.log('нотификации');
            console.log(items);

            this.notices = items;

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



        // включение главного меню
        this.menuCtrl.enable(true, 'main_menu');
        // отключение фильтра лидов и фильтра сообщений
        this.menuCtrl.enable(false, 'filter');
        this.menuCtrl.enable(false, 'massages_filter');



        this.events.unsubscribe("main:openCustomer");

        this.events.subscribe("main:openCustomer", () => {
            // alert('открытие страницами');
            this.nav.setRoot(CustomersPage);
        });



        this.events.unsubscribe("page:change");

        /**
         * Смена основной страницы пользователя
         *
         */
        this.events.subscribe("page:change", (data) => {

            this.childPage = data.page;


            // todo получения данных из локалстореджа в зависимости от страницы нахождения


            // пересчет данных фильтра
            this.filterUpdate();

            console.log('сменилась страница');
            console.log(data);
        });


        this.menuCtrl.swipeEnable(false, 'filter');

        this.events.unsubscribe("notice:new");
        this.events.subscribe("notice:new", (items) => {

            console.log('нотификации');
            console.log(items);

            this.notices = items;

        });


        this.events.unsubscribe("child:test",);
        this.events.subscribe("child:test", (items) => {
            // this.setNewNotices(items);

            this.notices = items;

            // this.content.resize();

            // alert('catch event ' +items);
        });


        // this.events.unsubscribe("roles:get",);
        // this.events.subscribe("roles:get", (roles) => {
        //     // this.setNewNotices(items);
        //
        //     // this.notices = data;
        //
        //     this.roles.role = roles.role;
        //     this.roles.subRole = roles.subRole;
        //
        //     console.log('Роли из главного компонента:');
        //     console.log(this.roles);
        //
        //     // : any = {
        //     //     role: false,
        //     //     subRole: false,
        //     // };
        //
        //     // this.content.resize();
        //
        //     // alert('catch event ' +items);
        // });

    }


    /**
     * Срабатывает когда открывается страница
     *
     */
    ionViewWillEnter() {
        // включение главного меню
        this.menuCtrl.enable(true, 'main_menu');
        // отключение фильтра лидов и фильтра сообщений
        this.menuCtrl.enable(false, 'filter');
        this.menuCtrl.enable(false, 'massages_filter');
        this.menuCtrl.enable(false, 'notice_filter');
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

            // если этот итем маски уже отмечен (совпадают id и статус "true")
            if (this.currentMasks[currentMask]['id'] == mask['id'] && this.currentMasks[currentMask]['status']) {

                // убираем отметку с этой маски
                this.currentMasks[currentMask]['status'] = false;


                let maskData = [];
                // перебираем фильтр и убираем маску из результата
                // this.filter.mask = 0;
                this.filter.mask.forEach(function (maskId, key) {

                    if (maskId != mask['id']) {
                        maskData.push(maskId);
                    }

                    // console.log('перечисляю фильтр');
                    // console.log(mask['id']);
                    // console.log(maskId);
                });

                this.filter.mask = maskData;

                // прерываем цикл
                break;
            }

            // помечаем маску не помеченной среди списка масок
            // this.currentMasks[currentMask]['status'] = false;

            // если id маски, равен id маски в списке масок
            if (this.currentMasks[currentMask]['id'] == mask['id']) {
                // помечаем его как отмеченный
                this.currentMasks[currentMask]['status'] = true;

                // добавляем маску
                // this.filter.mask = mask['id'];
                this.filter.mask.push(mask['id']);

                // todo запоминать по локалСтореджу
            }

        }

        console.log(this.filter.mask);

    }


    /**
     * Получение всех статусов открытого лида по сфере
     */
    getOpenLeadStatuses(sphereId) {

        this.user.getSphereStatuses(sphereId)
            .subscribe(result => {

                let data = result.json();

                console.log(data);

                if (data.status == 'success') {

                    this.openLeadStatuses = data.statuses;

                    this.openLeadStatuses.unshift({id: 0, name: 'No status', status: false});

                    // перебираем все сферы и добавляем status
                    for (let openLeadStatus in this.openLeadStatuses) {

                        this.openLeadStatuses[openLeadStatus]['status'] = false;

                        this.filter.openLeadStatus.forEach((openLeadStatusId) => {

                            if (this.openLeadStatuses[openLeadStatus]['id'] == openLeadStatusId) {

                                this.openLeadStatuses[openLeadStatus]['status'] = true;

                            }

                        });

                    }

                    console.log('статусы сферы');
                    console.log(this.openLeadStatuses);


                    // for (let openLeadStatus in data.statuses) {
                    //
                    //     data.statuses[openLeadStatus]['status'] = false;
                    //
                    //     this.filter.openLeadStatus.forEach((openLeadStatusId) => {
                    //
                    //         if (data.statuses['id'] == openLeadStatusId) {
                    //
                    //             data.statuses['status'] = true;
                    //
                    //         }
                    //
                    //     });
                    //
                    //     this.openLeadStatuses.push(data.statuses[openLeadStatus]);
                    // }


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
                // this.filter.openLeadStatus = 0;


                let openLeadStatusData = [];
                // перебираем фильтр и убираем маску из результата
                // this.filter.mask = 0;
                this.filter.openLeadStatus.forEach(function (openLeadStatusId, key) {

                    if (openLeadStatusId != status['id']) {
                        openLeadStatusData.push(openLeadStatusId);
                    }

                    // console.log('перечисляю фильтр');
                    // console.log(mask['id']);
                    // console.log(maskId);
                });

                this.filter.openLeadStatus = openLeadStatusData;

                break;
            }


            // this.openLeadStatuses[openLeadStatus]['status'] = false;

            if (this.openLeadStatuses[openLeadStatus]['id'] == status['id']) {
                this.openLeadStatuses[openLeadStatus]['status'] = true;

                // this.filter.openLeadStatus = status['id'];
                this.filter.openLeadStatus.push(status['id']);

                // todo запоминать по локалСтореджу
            }

        }

    }


    /**
     * Выбор статуса лида
     *
     */
    selectLeadStatuses(status) {

        // перебираем все статусы
        for (let leadStatus in this.leadStatuses) {

            if (this.leadStatuses[leadStatus]['id'] == status['id'] && this.leadStatuses[leadStatus]['status']) {

                this.leadStatuses[leadStatus]['status'] = false;
                // this.filter.leadStatus = 0;

                let leadStatusData = [];
                this.filter.leadStatus.forEach(function (leadStatusId, key) {

                    if (leadStatusId != status['id']) {
                        leadStatusData.push(leadStatusId);
                    }

                    // console.log('перечисляю фильтр');
                    // console.log(mask['id']);
                    // console.log(maskId);
                });

                this.filter.leadStatus = leadStatusData;

                break;
            }


            if (this.leadStatuses[leadStatus]['id'] == status['id']) {
                this.leadStatuses[leadStatus]['status'] = true;

                this.filter.leadStatus.push(status['id']);

                // todo запоминать по локалСтореджу
            }

        }

        // console.log(this.filter.leadStatus);
    }


    /**
     * Очистка статусов лида
     *
     */
    clearLeadStatuses() {
        this.filter.leadStatus = [];

        this.filterRecount();
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
                // this.filter.source = 0;

                let sourceData = [];
                this.filter.source.forEach(function (sourceId, key) {

                    if (sourceId != source['id']) {
                        sourceData.push(sourceId);
                    }

                    // console.log('перечисляю фильтр');
                    // console.log(mask['id']);
                    // console.log(maskId);
                });

                this.filter.source = sourceData;

                break;
            }


            // this.leadSources[leadSource]['status'] = false;

            if (this.leadSources[leadSource]['id'] == source['id']) {
                this.leadSources[leadSource]['status'] = true;

                this.filter.source.push(source['id']);

                // todo запоминать по локалСтореджу
            }

        }

        console.log(this.filter.source);
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
                mask: [],
                openLeadStatus: [],
                leadStatus: [],
                source: [],
                notOpenOnly: 0,
                period: {
                    from: null,
                    to: null,
                },
            };

            this.isFilterOn = false;

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

        this.isFilterOn = false;

        // пересчет сферы
        // перебираем все сферы и добавляем status
        for (let currentSphere in this.spheres) {

            this.spheres[currentSphere]['status'] = false;

            if (this.spheres[currentSphere]['id'] == this.filter.sphere) {

                this.isFilterOn = true;

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

            this.filter.mask.forEach((maskId) => {

                if (this.currentMasks[currentMask]['id'] == maskId) {

                    this.isFilterOn = true;

                    this.currentMasks[currentMask]['status'] = true;

                    // todo запоминать по локалСтореджу
                }
            });
        }


        // пересчет статус открытого лида делается в методе получения статусов, сразу после их получения с сервера


        // пересчет статус лида
        for (let leadStatus in this.leadStatuses) {

            this.leadStatuses[leadStatus]['status'] = false;


            this.filter.leadStatus.forEach((status) => {

                if (this.leadStatuses[leadStatus]['id'] == status) {

                    this.isFilterOn = true;

                    this.leadStatuses[leadStatus]['status'] = true;
                }
            });
        }


        // пересчет источника
        for (let leadSource in this.leadSources) {

            this.leadSources[leadSource]['status'] = false;


            this.filter.source.forEach((source) => {

                if (this.leadSources[leadSource]['id'] == source) {

                    this.isFilterOn = true;

                    this.leadSources[leadSource]['status'] = true;
                }


                // if (this.leadStatuses[leadStatus]['id'] == status) {
                //
                //     this.leadStatuses[leadStatus]['status'] = true;
                //
                // }
            });


            // if (this.leadSources[leadSource]['id'] == this.filter.source) {
            //
            //     this.leadSources[leadSource]['status'] = true;
            //
            //     // todo запоминать по локалСтореджу
            // }

        }

        console.log(this.isFilterOn);

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
            localStorage.setItem('openLeadFilterOn', 'true');

            this.events.publish('openLeadFilter');
            this.events.publish('openLeadFilterChange', {status: true});

        } else if (this.childPage == 'deposited') {
            // страница отданных лидов
            localStorage.setItem('depositedFilter', JSON.stringify(this.filter));
            localStorage.setItem('depositedFilterOn', 'true');

            this.events.publish('depositedFilter');
            this.events.publish('depositedFilterChange', {status: true});

        } else if (this.childPage == 'obtain') {
            // страница фильтра
            localStorage.setItem('obtainFilter', JSON.stringify(this.filter));
            localStorage.setItem('obtainFilterOn', 'true');

            this.events.publish('obtainFilter');
            this.events.publish('obtainFilterChange', {status: true});
        }

        this.filterRecount();

        // todo публикация события на обновление данных на странице

    }


    /**
     * Очистка фильтра
     *
     */
    filterReset() {

        this.filter = {
            sphere: 0,
            mask: [],
            openLeadStatus: [],
            leadStatus: [],
            source: [],
            notOpenOnly: 0,
            period: {
                from: null,
                to: null,
            },
        };

        this.isFilterOn = false;

        // сохранение фильтра в локласторедже, в зависимости от страницы
        if (this.childPage == 'open') {
            // страница открытых лидов
            localStorage.setItem('openLeadFilter', JSON.stringify(this.filter));
            localStorage.setItem('openLeadFilterOn', 'false');

            this.events.publish('openLeadFilter');
            this.events.publish('openLeadFilterChange', {status: false});


        } else if (this.childPage == 'deposited') {
            // страница отданных лидов
            localStorage.setItem('depositedFilter', JSON.stringify(this.filter));
            localStorage.setItem('depositedFilterOn', 'false');

            this.events.publish('depositedFilter');
            this.events.publish('depositedFilterChange', {status: false});

        } else if (this.childPage == 'obtain') {
            // страница фильтра
            localStorage.setItem('obtainFilter', JSON.stringify(this.filter));
            localStorage.setItem('obtainFilterOn', 'false');

            this.events.publish('obtainFilter');
            this.events.publish('obtainFilterChange', {status: false});
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
     * Очистка фильтра масок
     *
     */
    clearMasksFilter() {
        this.filter.mask = [];

        this.filterRecount();
    }


    /**
     * Очистка назначения лида
     *
     */
    clearLeadSource() {
        this.filter.source = [];

        this.filterRecount();
    }


    /**
     * Очистка статусов открытого лида
     *
     */
    clearOpenLeadStatusesFilter() {
        this.filter.openLeadStatus = [];

        this.filterRecount();
    }


    /**
     * Очистка сфер
     *
     */
    clearSphereFilter() {
        this.filter.sphere = 0;

        this.filterRecount();
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

        this.navCtrl.setRoot(MessagesPage);

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
