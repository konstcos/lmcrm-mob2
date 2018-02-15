/**
 * Основные модули приложения
 */
import {Component, ViewChild} from '@angular/core';
import {
    NavController,
    NavParams,
    Nav,
    MenuController,
    Events,
    Content,
    Tabs,
    PopoverController,
    ModalController,
    AlertController
} from 'ionic-angular';
import {Badge} from '@ionic-native/badge';

/**
 * Провайдеры
 */

// модель пользователя
import {User} from "../../providers/user";
// модель obtain
import {Obtain} from '../../providers/obtain';


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
// страница редактирования профиля
import {ProfilePage} from '../profile/profile'
// поповер главной страницы
import {MainPopoverPage} from "../main-popover/main-popover";
// страница поиска
import {SearchPage} from "../search/search";
// страница поддержки
import {SupportPage} from "../support/support";
// страница калькулятора
import {CreditCalculatorPage} from "../credit-calculator/credit-calculator";
// страница кошелька
import {WalletPage} from "../wallet/wallet";

/*
 Основная страница приложения.

 На странице расположенны основные данные для работы пользователя,
 основное меню и три таба по работе с лидами.
 На эту страницу пользователь будет попадать сразу после залогинивания,
 */
@Component({
    selector: 'page-main',
    templateUrl: 'main.html'
})
export class MainPage {

    @ViewChild(Content) content: Content;
    @ViewChild('mainTabs') tabRef: Tabs;

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
    obtainTitle = "mainTabTitle.incoming";
    // отданные лиды
    depositedTitle = "mainTabTitle.outgoing";
    // открытые лиды
    openTitle = "mainTabTitle.expose";

    // баджик на табе страницы incoming (obtain, входящих лидов)
    incomingBadge: any = "";

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
        exposureOnly: 0,
        archiveShow: 0,
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
        {id: 1, name: 'filter.statusesList.bad_lead', status: false},
        {id: 2, name: 'filter.statusesList.new_lead', status: false},
        {id: 3, name: 'filter.statusesList.auction', status: false},
        {id: 4, name: 'filter.statusesList.closed_deal', status: false},
    ];


    /**
     * Источник получения лида
     *
     */
    leadSources: any = [
        {id: 1, name: 'filter.purposeList.auction', status: false},
        {id: 2, name: 'filter.purposeList.for_deals', status: false},
        {id: 3, name: 'filter.purposeList.private_group', status: false},
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
        role: '',
        subRole: '',
    };


    /**
     * Данные агента
     *
     */
    public name: string = '';
    public surname: string = '';
    public email: string = '';
    public wallet: Number = 0;
    public prices: any = [];
    public leadsBySphere: any = [];

    public leadsBySphereSum: number = 0;

    public highestPrice: number = 0;

    /**
     * Состояние дополнительного блока с кредитами
     * открыт/закрыт
     *
     */
    public creditsAmountBlock: boolean = false;


    /**
     * Количество лидов по каждой сфере
     * открыт/закрыт
     *
     */
    public leadCountBlock: boolean = false;


    /**
     * Количество непросмотренных входящих лидов
     *
     */
    public newIncomingLeadsCount: number = 0;


    /**
     * Конструктор класса
     *
     */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public nav: Nav,
                public user: User,
                public obtainProvider: Obtain,
                public menuCtrl: MenuController,
                public events: Events,
                public popoverCtrl: PopoverController,
                public modalCtrl: ModalController,
                private badge: Badge,
                public alertCtrl: AlertController) {


        this.events.unsubscribe("notices:clear");
        this.events.subscribe("notices:clear", () => {
            this.notices = 0;
        });



        this.events.unsubscribe("agentData:get",);
        this.events.subscribe("agentData:get", (agentData) => {

            console.log('полученные данные агента: ');
            console.log(agentData);

            this.roles.role = agentData.roles.role;
            this.roles.subRole = agentData.roles.subRole == 'leadbayer' ? 'leadbuyer' : agentData.roles.subRole;
            this.name = agentData.name;
            this.surname = agentData.surname;
            this.email = agentData.email;
            this.prices = agentData.prices;
            this.wallet = agentData.wallet;
            this.leadsBySphere = agentData.leadsBySphere ? agentData.leadsBySphere : [];

            if (this.leadsBySphere.length != 0) {

                this.leadsBySphereSum = 0;

                this.leadsBySphere.forEach((leadsCountData) => {
                    this.leadsBySphereSum = this.leadsBySphereSum + leadsCountData.count;
                    console.log(this.leadsBySphereSum);
                });

            }

            if (this.prices) {

                this.prices.forEach((sphere) => {

                    sphere.masks.forEach((mask) => {

                        if (mask.leadsCount) {

                            if (this.highestPrice < mask.leadsCount) {
                                this.highestPrice = mask.leadsCount;
                            }
                        }

                        // console.log(mask);
                    });
                });
            }


        });


        // задаются страницы в меню, название и сама страница
        this.pages = [

            // страница клиентов (тут будут все сферы)
            {title: 'pages.customer_filter', component: CustomersPage},

            // Страница продавцов
            {title: 'pages.salesmen', component: SalesmenPage},

            // Статистика
            {title: 'pages.statistic', component: StatisticsPage},

            // Деньги
            {title: 'pages.credits', component: CreditsPage},

            // Приватная группа
            {title: 'pages.private_group', component: PrivateGroupPage},

            // Органайзер
            {title: 'pages.organizer', component: OrganizerPage},

            // Редактирование профиля
            {title: 'pages.profile', component: ProfilePage}
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

                // console.log(res);
                //
                // console.log('сферы: ');
                // console.log(this.spheres);

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

            // console.log('нотификации');
            // console.log(items);

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


    ionViewDidEnter() {
        // this.tabRef.select(1);
    }


    /**
     * Действия по загрузке странице
     *
     */
    ionViewDidLoad() {

        let default_route = localStorage.getItem('default_route');

        if (default_route && default_route == 'outgoing') {

            this.tabRef.select(0);

        } else {

            this.tabRef.select(2);
        }

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

        this.events.unsubscribe("goTo:open",);
        // переход на страницу опен
        this.events.subscribe("goTo:open", () => {
            // alert('открытие страницами');
            this.tabRef.select(1);
        });


        this.events.unsubscribe("page:change");

        /**
         * Смена основной страницы пользователя
         *
         */
        this.events.subscribe("page:change", (data) => {

            this.childPage = data.page;

            // console.log(this.childPage);

            // todo получения данных из локалстореджа в зависимости от страницы нахождения


            // пересчет данных фильтра
            this.filterUpdate();

            // console.log('сменилась страница');
            // console.log(data);
        });


        this.menuCtrl.swipeEnable(false, 'filter');

        this.events.unsubscribe("notice:new");
        this.events.subscribe("notice:new", (items) => {

            // console.log('нотификации');
            // console.log(items);

            this.notices = items;

        });


        this.events.unsubscribe("child:test",);
        this.events.subscribe("child:test", (items) => {
            // this.setNewNotices(items);

            this.notices = items;

            // this.content.resize();

            // alert('catch event ' +items);
        });

        // переходим на вкладку входящих лидов
        this.events.unsubscribe("tab:switch_incoming");
        this.events.subscribe("tab:switch_incoming", (data) => {
            this.tabRef.select(2);
        });


        // this.events.unsubscribe("badge:set");
        // this.events.subscribe("badge:set", (date) => {
        //
        //     console.log('баджи в мэин');
        //     console.log(date);
        //
        //     if (date == 0) {
        //
        //         this.incomingBadge = '';
        //
        //     } else {
        //
        //         this.incomingBadge = date;
        //     }
        //
        //
        // });


        // подписываемся на получение количества непросмотренных лидов
        this.events.unsubscribe("badge:set");
        this.events.subscribe("badge:set", (data) => {

            this.newIncomingLeadsCount = data;
            console.log('количество новых непросмотренных лидов: ');
            console.log(this.newIncomingLeadsCount);

            console.log('баджи в мэин');
            console.log(data);

            if (data == 0) {

                this.incomingBadge = '';

            } else {

                this.incomingBadge = data;
            }
        });

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

        // console.log(this.filter.mask);

    }


    /**
     * Получение всех статусов открытого лида по сфере
     */
    getOpenLeadStatuses(sphereId) {

        this.user.getSphereStatuses(sphereId)
            .subscribe(result => {

                let data = result.json();

                // console.log(data);

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

                    // console.log('статусы сферы');
                    // console.log(this.openLeadStatuses);


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

        // console.log('Статусы открытого лида');
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

        // console.log(this.filter.source);
    }


    /**
     * Открытие блока с кредитами
     *
     */
    openCredits() {

        this.creditsAmountBlock = !this.creditsAmountBlock;
    }


    /**
     * Открытие блока с кредитами
     *
     */
    openLeadsCount() {

        this.leadCountBlock = !this.leadCountBlock;
    }


    /**
     * Выбор только не открытых лидов
     *
     */
    selectNotOpenOnly() {

        this.filter.notOpenOnly = !this.filter.notOpenOnly;
    }


    /**
     * Выбор просмотр архивных открытых лидов
     *
     */
    selectShowArchive() {

        this.filter.archiveShow = !this.filter.archiveShow;
    }


    /**
     * Выбор только не просмотренных лидов
     *
     */
    selectExposureOnly() {

        this.filter.exposureOnly = !this.filter.exposureOnly;
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

        // console.log('Сохраненные данные по фильтру');
        // console.log(storageData);

        if (!storageData) {
            this.filter = {
                sphere: 0,
                mask: [],
                openLeadStatus: [],
                leadStatus: [],
                source: [],
                notOpenOnly: 0,
                exposureOnly: 0,
                archiveShow: 0,
                period: {
                    from: null,
                    to: null,
                },
            };

            this.isFilterOn = false;

        } else {

            this.filter = JSON.parse(storageData);
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

        // проверка не просмотренных лидов
        if (this.filter.exposureOnly == 1) {
            this.isFilterOn = true;
        }

        // проверка только неоткрытых лидов
        if (this.filter.notOpenOnly == 1) {
            this.isFilterOn = true;
        }

        // проверка архивных лидов
        if (this.filter.archiveShow == 1) {
            this.isFilterOn = true;
        }

        // console.log(this.isFilterOn);

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
            exposureOnly: 0,
            archiveShow: 0,
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
     * Открыть поповер
     *
     */
    popoverMenu(myEvent) {

        // если нет новых непросмотренных входящих лидов - выходим из метода
        if (this.newIncomingLeadsCount < 10) {
            return false;
        }

        // console.log('Поповер открыт');

        let popover = this.popoverCtrl.create(MainPopoverPage);

        popover.onDidDismiss(data => {

            if (data && data.action == 'markAllIncomingAsViewed') {

                this.confirmMarkSeenAuction();
            }
        });


        popover.present({
            ev: myEvent
        });


        // obtainProvider
    }


    /**
     * Попап на подтверждения отметки всех лидов как просмотренных
     *
     */
    confirmMarkSeenAuction() {

        let confirm = this.alertCtrl.create({
            title: 'Confirmation',
            message: 'All new incoming leads will be marked as viewed',
            buttons: [
                {
                    text: 'Cancel',
                    // handler: () => {
                    //     console.log('Disagree clicked');
                    // }
                },
                {
                    text: 'Ok',
                    handler: () => {
                        this.markSeenAuction();
                    }
                }
            ]
        });
        confirm.present();
    }


    /**
     * Отметить все входящие новые лиды как увиденные
     *
     */
    markSeenAuction() {

        // помечаем итем что он уже просмотрен
        this.obtainProvider.markSeenAuction({auctionId: 0})
        // обработка ответа
            .subscribe(result => {
                // при получении ответа

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                if (data.status == 'success') {

                    this.badge.set(0);

                    if (this.childPage == 'obtain') {
                        this.events.publish('incoming:mark')
                    }
                }

                // console.log('Данные агента: ');

            }, err => {
                // в случае ошибки

                console.log('ERROR: ' + err);
            });

    }


    /**
     * Открыть страницу поиска
     *
     */
    openSearchPage() {
        let modal = this.modalCtrl.create(SearchPage);
        modal.present();
    }


    /**
     * Открыть страницу калькуляторя
     *
     */
    openCalculatorPage() {
        let modal = this.modalCtrl.create(CreditCalculatorPage);
        modal.present();
    }


    /**
     * Открыть страницу поддержки
     *
     */
    openSupportPage() {
        // this.nav.setRoot(SearchPage);
        let modal = this.modalCtrl.create(SupportPage);
        modal.present();
    }


    /**
     * Открыть страницу кошелька
     *
     */
    openWalletPage() {
        let modal = this.modalCtrl.create(WalletPage);

        modal.onDidDismiss(data => {
            console.log('закрылось окно кошелька');
        });

        modal.present();
    }


    /**
     * Разлогинивание пользователя
     *
     */
    logout() {

        localStorage.setItem('default_route', 'incoming');

        this.badge.set(0);

        // метод разлогинивания
        this.user.logout();
        // переход на страницу логина
        this.nav.setRoot(LoginPage);
    }


    testClick() {
        this.events.publish("child:test");
    }

}
