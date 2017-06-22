import {Component, ViewChild} from '@angular/core';
import {
    NavController,
    LoadingController,
    MenuController,
    Content
} from 'ionic-angular';

import {TranslateService} from 'ng2-translate/ng2-translate';

import {LoginPage} from '../login/login'
import {MainPage} from '../main/main'

import {MessagesFilterPage} from '../messages-filter/messages-filter'

import {User} from '../../providers/user';
import {Notification} from '../../providers/notification';

/*
 Generated class for the Signup page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'messages',
    templateUrl: 'messages.html'
})
export class MessagesPage {

    @ViewChild(Content) content: Content;


    /**
     * Переменная с переключением сегментов
     *
     */
    segmentSwitch: any = 'notice';


    /**
     * Итемы оповещений
     *
     */
    public notices: any = [];


    /**
     * Есть еще нотификации на сервере или нет
     *
     */
    public isThereStillNoticeItems: boolean = true;


    /**
     * Есть еще итемы нотификаций или нет
     *
     * true - нотификаций больше нет
     * false - нотификации еще есть
     *
     */
    public isNotificationEmpty: boolean = false;


    /**
     * Показывает общий индикатор загрузке
     *
     * общая загрузка, не по обновлению сообщений
     * или подгрузке данных, а общая...
     *
     */
    public isLoading: boolean = false;


    /**
     * Фильтр оповещений
     *
     */
    public noticesFilter: any = {

        period: {
            form: null,
            to: null
        },

        types: [],

        // all, marked, not_market
        status: 'all'
    };


    /**
     * Примененный фильтр оповещений
     *
     */
    public noticesFilterApplied: any = {

        period: {
            form: null,
            to: null
        },

        types: [],

        // all, marked, not_market
        status: 'all'
    };


    /**
     * Типы уведомлений
     *
     */
    public noticeTypes: any = [];


    /**
     * Включен фильтр нотификаций или выключен
     *
     */
    public isNoticeFilterOn: boolean = false;


    /**
     * Отсутствие уведомлений по фильтру
     *
     */
    public noNotificationByFilter: boolean = false;


    constructor(public navCtrl: NavController,
                public user: User,
                public notification: Notification,
                public loadingCtrl: LoadingController,
                public translateService: TranslateService,
                public menuCtrl: MenuController) {

        let noticesFilter = localStorage.getItem('noticesFilter');

        if (noticesFilter) {

            this.noticesFilterApplied = JSON.parse(noticesFilter);
            this.noticesFilter = JSON.parse(noticesFilter);

            this.noticeFilterRecount();
        }

        // загрузка типов нотификаций
        this.getNotificationTypes();

        // загрузка итемов нотификаций
        this.loadNotifications();
    }


    /**
     * События по загрузке компонента
     *
     */
    ionViewDidLoad() {

    }


    /**
     * События при входе в компонент
     *
     */
    ionViewWillEnter() {

        // отключение главного меню
        this.menuCtrl.enable(false, 'main_menu');


        if (this.segmentSwitch == 'notice') {

            // отключение фильтра сообщений
            this.menuCtrl.enable(false, 'messages_filter');
            // включение фильтра
            this.menuCtrl.enable(true, 'notice_filter');

        } else {

            // отключение фильтра сообщений
            this.menuCtrl.enable(false, 'notice_filter');
            // включение фильтра
            this.menuCtrl.enable(true, 'messages_filter');
        }

    }


    /**
     * Загрузка типов уведомлений
     *
     */
    getNotificationTypes() {

        this.notification.getNoticeTypes()
            .subscribe(result => {

                let data = result.json();

                console.log(data);

                if (data.status == 'success') {

                    // добавление статуса в итемы
                    data.types.forEach(function (type) {

                        type['status'] = false;
                    });


                    this.noticeTypes = data.types;

                    this.noticeFilterRecount();

                } else {

                    console.log('error loading notices types');
                }


                console.log(this.noticeTypes);

            }, err => {

                console.log('Error ' + err);
            });

    }


    /**
     * Обновление страницы по сваяпу в низу
     *
     */
    refresh(refresher) {

        // проверить активную страницу
        if (this.segmentSwitch == 'notice') {
            // если оповещения

            this.loadNotifications(refresher);

        } else if (this.segmentSwitch == 'messages') {
            // если сообщения


        }
    }


    /**
     * Подгрузка итемов
     *
     */
    loadMore(infinityScroll) {

        // проверить активную страницу
        if (this.segmentSwitch == 'notice') {
            // если оповещения

            this.loadNotifications(infinityScroll, false);

        } else if (this.segmentSwitch == 'messages') {
            // если сообщения


        }
    }


    /**
     * Получение всех уведомлений
     *
     */
    loadNotifications(refresher: any = false, itemClear: boolean = true) {

        // если есть указание на очистку итемов
        if (itemClear) {

            // обнулить все итемы уведомлений
            this.notices = [];

            // todo завести переменную наличия итемов в true
        }

        // если загрузка идет не по рефрешу или инфинити
        // показывается индикатор общей загрузки
        if (!refresher) {
            this.isLoading = true;
        }

        // помечаем что нотификации есть (здесь мы еще в это верим)
        this.isNotificationEmpty = false;

        // отсутствие нотификаций по фильтру (помечаем что они есть)
        this.noNotificationByFilter = false;

        // включаем переменную наличия итемов
        this.isThereStillNoticeItems = true;

        // если итемов нет и обновление не по рефрешеру
        // todo спрятать все окна и показать спинер загрузки


        // запрос на получение итемов нотификаций
        this.getNotices()
        // подписываемся на результат
            .subscribe(result => {

                // преобразование результата в json
                let res = result.json();

                console.log(res);


                // если спинер включен - выключить
                if (this.isLoading) {
                    this.isLoading = false;
                }

                // если было обновление страницы
                if (refresher) {
                    // отключаем окно индикатора загрузки
                    refresher.complete();
                }

                // сценарий обработки результата
                if (res.notices.length == 0 && this.notices == 0) {
                    // если итемов не получанно и общее количество итемов равняется 0

                    // проверка включенного фильтра
                    if (this.isNoticeFilterOn) {
                        // если фильтр включен

                        // блок отсутствия итемов по фильтру
                        this.noNotificationByFilter = true;

                    } else {
                        // если фильтр выключен

                        // показываем блок отсутствия итемов
                        this.isNotificationEmpty = true;
                    }

                } else if (res.notices.length == 0 && this.notices != 0) {
                    // если итемы не получены, но в целом, в системе итемы уже есть

                    // помечаем что на сервере больше нет итемов
                    this.isThereStillNoticeItems = false;

                } else {
                    // итемы полученны

                    // добавляем итемы к существующим
                    this.notices = this.notices.concat(res.notices);
                }

            }, err => {

                // todo если спинер включен - включить

                // если было обновление страницы
                if (refresher) {
                    // отключаем окно индикатора загрузки
                    refresher.complete();
                }

                // если было обновление страницы
                if (refresher) {
                    // отключаем окно индикатора загрузки
                    refresher.complete();
                }

                this.notices = [];

                this.isNotificationEmpty = true;

                console.log('Error ' + err);
            });
    }


    /**
     * Обнуление периода
     *
     */
    resetPeriod() {
        this.noticesFilter.period.from = null;
        this.noticesFilter.period.to = null;
    }


    /**
     * Включение/выключение инфинити
     *
     */
    isLastPageReached(): boolean {

        // проверить активную страницу
        if (this.segmentSwitch == 'notice') {
            // если оповещения

            return this.notices.length != 0 && this.isThereStillNoticeItems;

        } else if (this.segmentSwitch == 'messages') {
            // если сообщения


        }


    }


    /**
     * Загрузка итемов оповещений с сервера
     *
     */
    getNotices() {

        // получаем количество уже загруженных итемов
        let offset = this.notices.length;

        // возвращает promise с итемами
        return this.notification.get(offset, this.noticesFilterApplied);
    }


    /**
     * Отметить нотификацию
     *
     */
    markNotice(notice) {


        this.notification.mark(notice.id)
            .subscribe(result => {

                let res = result.json();

                if (res.status == 'success') {
                    notice.status = !notice.status;
                }

                console.log(res);


            }, err => {

                console.log('Error ' + err);
            });

    }


    /**
     * Открытые меню
     */
    filterMenuOpen() {

        if (this.segmentSwitch == 'notice') {

            // отключение фильтра сообщений
            this.menuCtrl.enable(false, 'messages_filter');
            // включение фильтра
            this.menuCtrl.enable(true, 'notice_filter');

        } else {

            // отключение фильтра сообщений
            this.menuCtrl.enable(false, 'notice_filter');
            // включение фильтра
            this.menuCtrl.enable(true, 'messages_filter');
        }

        // открывает главное меню
        // this.menuCtrl.open();
        this.menuCtrl.toggle('right');
    }


    /**
     * Закрытие меню фильтра уведомлений
     *
     */
    whenNoticeFilterMenuClose() {

        // сохранение примененного фильтра из рабочего в примененный
        for (let filterData in this.noticesFilterApplied) {

            switch (filterData) {

                case 'period':

                    this.noticesFilter['period']['from'] = this.noticesFilterApplied['period']['from'];
                    this.noticesFilter['period']['to'] = this.noticesFilterApplied['period']['to'];
                    break;

                case 'types':
                    this.noticesFilter['types'] = this.noticesFilterApplied['types'];
                    break;

                case 'status':
                    this.noticesFilter['status'] = this.noticesFilterApplied['status'];
                    break;
            }
        }

        this.noticeFilterRecount();

        console.log('menu is close');
    }


    /**
     * Выбор статуса по фильтру
     *
     */
    selectStatus(status) {

        this.noticesFilter.status = status;
    }


    /**
     * Очистка типа по фильтру
     *
     */
    clearTypeFilter() {

        // перебираем все статусы
        for (let type in this.noticeTypes) {

            this.noticeTypes[type]['status'] = false;
        }


        this.noticesFilter.types = [];
    }


    /**
     * Применить фильтр
     *
     */
    noticeFilterApply() {

        // сохранение примененного фильтра из рабочего в примененный
        for (let filterData in this.noticesFilterApplied) {

            switch (filterData) {

                case 'period':

                    this.noticesFilterApplied['period']['from'] = this.noticesFilter['period']['from'];
                    this.noticesFilterApplied['period']['to'] = this.noticesFilter['period']['to'];
                    break;

                case 'types':
                    this.noticesFilterApplied['types'] = this.noticesFilter['types'];
                    break;

                case 'status':
                    this.noticesFilterApplied['status'] = this.noticesFilter['status'];
                    break;
            }
        }

        // сохранение фильтра в локалсторедже
        localStorage.setItem('noticesFilter', JSON.stringify(this.noticesFilterApplied));

        // пересчет фильтра
        this.noticeFilterRecount();

        // обновление итемов на странице с сервера
        this.loadNotifications(false, true)
    }


    /**
     * Обнуление фильтра нотификаций
     *
     */
    noticeFilterReset() {

        // обнуление рабочих данных
        this.noticesFilter = {

            period: {
                form: null,
                to: null
            },

            types: [],

            // all, marked, not_market
            status: 'all'
        };

        // обнулние примененных данных
        this.noticesFilterApplied = {

            period: {
                form: null,
                to: null
            },

            types: [],

            // all, marked, not_market
            status: 'all'
        };

        // сохранение в локалсторедже
        localStorage.setItem('noticesFilter', JSON.stringify(this.noticesFilterApplied));

        // пересчет данных по фильтру
        this.noticeFilterRecount();

        // обновление итемов на странице с сервера
        this.loadNotifications(false, true)
    }


    /**
     * Пересчет фильтра уведомлений
     *
     */
    noticeFilterRecount() {

        this.isNoticeFilterOn = false;

        // проверка периода "От"
        if (this.noticesFilter['period']['from']) {
            this.isNoticeFilterOn = true;
        }

        // проверка периода "До"
        if (this.noticesFilter['period']['to']) {
            this.isNoticeFilterOn = true;
        }


        // пересчет выбранных типов лида
        for (let type in this.noticeTypes) {

            this.noticeTypes[type]['status'] = false;

            this.noticesFilter['types'].forEach(selectedType => {

                if (this.noticeTypes[type]['id'] == selectedType) {

                    this.isNoticeFilterOn = true;

                    this.noticeTypes[type]['status'] = true;
                }
            });
        }


        // проверка статуса
        if (this.noticesFilter['status'] != 'all') {
            this.isNoticeFilterOn = true;
        }

    }


    /**
     * Выбор типа по фильтру
     *
     */
    selectType(selectedType) {

        // перебираем все статусы
        for (let type in this.noticeTypes) {

            if (this.noticeTypes[type]['id'] == selectedType['id'] && this.noticeTypes[type]['status']) {

                this.noticeTypes[type]['status'] = false;
                // this.filter.leadStatus = 0;

                let typeData = [];
                this.noticesFilter.types.forEach(function (typeId, key) {

                    if (typeId != selectedType['id']) {
                        typeData.push(typeId);
                    }

                    // console.log('перечисляю фильтр');
                    // console.log(mask['id']);
                    // console.log(maskId);
                });

                this.noticesFilter.types = typeData;

                break;
            }


            if (this.noticeTypes[type]['id'] == selectedType['id']) {
                this.noticeTypes[type]['status'] = true;

                this.noticesFilter.types.push(selectedType['id']);

                // todo запоминать по локалСтореджу
            }

        }


        console.log(this.noticesFilter.types);
    }


    /**
     * Показывать итем нотификации или нет
     *
     * (к примеру, когда фильтр только по не отмеченным итемам,
     * а агент отметил итем)
     *
     */
    showNoticeItem(notice): boolean {

        // условие отображение имени
        if (this.noticesFilterApplied['status'] == 'all') {

            return true;

        } else if (this.noticesFilterApplied['status'] == 'marked') {

            if (notice.status == 1) {

                return true;

            } else {

                return false;
            }

        } else if (this.noticesFilterApplied['status'] == 'not_market') {

            if (notice.status == 1) {

                return false;

            } else {

                return true;
            }
        }

        return true;
    }


    /**
     * Возврат на главную страницу
     */
    goBack() {
        this.navCtrl.setRoot(MainPage);
    }

}
