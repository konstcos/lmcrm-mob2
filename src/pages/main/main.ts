/**
 * Основные модули приложения
 */
import {Component} from '@angular/core';
import {NavController, NavParams, Nav, MenuController} from 'ionic-angular';


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

    /**
     * Инициация страниц
     */

        // страница входящих лидов
    obtain: any = ObtainPage;
    // отданные лиды
    deposited: any = DepositedPage;
    // открытые лиды
    open: any = OpenPage;


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
                public menuCtrl: MenuController) {

        // задаются страницы в меню, название и сама страница
        this.pages = [

            // страница клиентов (тут будут все сферы)
            {title: 'Customers filters', component: CustomersPage},
            {title: 'Salesmen', component: SalesmenPage},
            {title: 'Statistic', component: StatisticsPage},
            {title: 'Credits', component: CreditsPage}
        ];
    }


    /**
     * Действия по загрузке странице
     *
     */
    ionViewDidLoad() {
        this.menuCtrl.swipeEnable(false, 'filter');
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
     * Разлогинивание пользователя
     *
     */
    logout() {

        // метод разлогинивания
        this.user.logout();
        // переход на страницу логина
        this.nav.setRoot(LoginPage);
    }

}
