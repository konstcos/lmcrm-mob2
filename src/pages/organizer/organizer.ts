import {Component} from '@angular/core';
import {
    NavController,
    NavParams,
    ViewController,
    ActionSheetController,
    ModalController,
    MenuController
} from 'ionic-angular';


import {OpenLeadOrganizerEditPage} from "../open-lead-organizer-edit/open-lead-organizer-edit";
import {OpenLeadOrganizerPage} from "../open-lead-organizer/open-lead-organizer";
import {OpenLeadOrganizer} from '../../providers/open-lead-organizer';
import {Organizer} from '../../providers/organizer';
import {MainPage} from '../main/main'
import {OpenDetailPage} from '../open-detail/open-detail'


/*
 Generated class for the OpenLeadOrganizer page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'organizer',
    templateUrl: 'organizer.html',
    providers: [Organizer]
})
export class OrganizerPage {


    /**
     * Итемы органайзера
     *
     */
    public items: any = [];


    /**
     * Текущая дата
     *
     */
    public currentDate: string = '';


    /**
     * Сегодняшняя дата
     *
     */
    public today: string = '';


    /**
     * Вчерашняя дата
     *
     */
    public yesterday: string = '';


    /**
     * Данные фильтра
     *
     */
    public filter: any = {
        state: []
    };


    /**
     * Данные рабочего фильтра
     *
     */
    public filterApplied: any = {
        state: []
    };


    /**
     * Состояние итемов
     *
     * просроченный, завершенный, в ожидании
     *
     */
    public allStates: any = [
        {id: 1, name: 'Pending', status: false},
        {id: 2, name: 'Overdue', status: false},
        {id: 3, name: 'Done', status: false},
    ];


    /**
     * Включен фильтр или нет
     *
     */
    public isOrganizerFilterOn: boolean = false;


    /**
     * Отсутствие итемов по органайзеру
     *
     */
    public isOrganizerEmpty: boolean = false;


    /**
     * Есть ли еще итемы органайзера, или нет
     *
     */
    public isThereStillOrganizerItems: boolean = false;


    /**
     * Нет итемов по фильтру
     *
     */
    public noOrganizerByFilter: boolean = false;


    /**
     * Индикатор загрузки
     *
     */
    public isLoading: any = false;


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public view: ViewController,
                public actionSheetCtrl: ActionSheetController,
                public organizer: Organizer,
                public modalCtrl: ModalController,
                public menuCtrl: MenuController) {


        let filter = localStorage.getItem('allOrganizerFilter');

        if (filter) {

            this.filterApplied = JSON.parse(filter);
            this.filter = JSON.parse(filter);

            this.filterRecount();
        }


        /** Формирование текущей даты */
        let date = new Date();

        let Y = date.getFullYear();
        let m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        let d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        let HH = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        let mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        let ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

        // let DYesterday = date.getDate() < 10 ? '0' + (date.getDate()-1) : date.getDate();

        // вчерашняя дата
        date.setDate(date.getDate() - 1);

        let Yy = date.getFullYear();
        let my = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        let dy = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();


        this.currentDate = Y + '-' + m + '-' + d + ' ' + HH + ':' + mm + ':' + ss;


        this.today = Y + '-' + m + '-' + d;

        this.yesterday = Yy + '-' + my + '-' + dy;

        // console.log(this.today);
        // console.log(this.yesterday);

        this.loadOrganizerItems();
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad OpenLeadOrganizerPage');

        this.menuCtrl.enable(true, 'organizer_filter');
    }


    /**
     * Переключение меню
     *
     */
    menuToggle() {

        this.whenFilterMenuClose();
        this.menuCtrl.toggle('right');
    }


    /**
     * Форматирование числа даты
     *
     */
    dateFormat(fullDate) {

        // распарсить дату по пробелу
        let date = fullDate.split(' ')[0];

        // сравнить с сегодняшней датой
        // если похоже вернуть 'today'
        if (this.today == date) {
            return 'today';
        }

        // сравнить с вчерашней датой
        // если похоже вернуть 'yesterday'
        if (this.yesterday == date) {
            return 'yesterday';
        }

        // если не похоже - распарсить по '-'
        let splitDate = date.split('-');

        let Y = splitDate[0];
        let m = splitDate[1];
        let d = splitDate[2];

        // вернуть дату через слеши
        let formatDate = d + '/' + m + '/' + Y;

        return formatDate;
    }


    /**
     * Форматирование времени даты
     *
     */
    timeFormat(fullDate) {


        // распарсить дату по пробелу
        let time = fullDate.split(' ')[1];

        // распарсить время по ':'
        let splitTime = time.split(':');

        let HH = splitTime[0];
        let mm = splitTime[1];
        let ss = splitTime[2];

        // вернуть в правильном формате
        let formatTime = HH + ':' + mm;

        return formatTime;
    }


    /**
     * Создание нового итема
     *
     */
    // addItem() {
    //
    //     let type = 'reminder';
    //
    //     if(this.organizerBlocks != 'reminders'){
    //
    //         type = 'comment';
    //     }
    //
    //     let modal = this.modalCtrl.create(OpenLeadOrganizerEditPage, {type: type, openLeadId: this.itemsId});
    //
    //
    //     modal.onDidDismiss(data => {
    //
    //         this.organizer.get({ openLeadId: this.itemsId })
    //             .subscribe(result => {
    //
    //                 // переводим ответ в json
    //                 let data = result.json();
    //
    //                 // let modal = this.modalCtrl.create(OpenLeadOrganizerPage, {items: data});
    //                 //
    //                 // modal.present();
    //
    //                 this.items = data.organizer;
    //
    //                 // console.log(data);
    //
    //             }, err => {
    //
    //                 console.log('ERROR: ' + err);
    //             });
    //
    //     });
    //
    //
    //     modal.present();
    //
    // }


    /**
     * Открытие данных по открытому лиду
     *
     */
    openLeadData(itemData) {
        let modal = this.modalCtrl.create(OpenDetailPage, {openLeadId: itemData.open_lead_id, pageFrom: 'organizer'});

        modal.onDidDismiss(data => {

            // console.log(data);

            this.loadOrganizerItems();


            // if (data.state != 'cancel') {
            //
            //     this.loadOrganizerItems();
            // }

        });

        modal.present();
    }


    /**
     * Открытие органайзера по открытому лиду
     *
     */
    openLeadOrganizer(itemData) {
        let modal = this.modalCtrl.create(OpenLeadOrganizerPage, {itemsId: itemData.open_lead_id});

        modal.onDidDismiss(data => {

            // console.log(data);

            this.loadOrganizerItems();


            // if (data.state != 'cancel') {
            //
            //     this.loadOrganizerItems();
            // }

        });

        modal.present();
    }


    /**
     * Редактирование итема
     *
     */
    editItem(itemData) {

        let type = 'reminder';

        let splitDateTime = itemData.time.split(' ');

        let splitTime = splitDateTime[1].split(':');

        let HH = splitTime[0];
        let mm = splitTime[1];

        itemData['dateDate'] = splitDateTime[0];
        itemData['dateTime'] = HH + ':' + mm;
        itemData['text'] = itemData.comment;


        console.log(itemData);

        let modal = this.modalCtrl.create(OpenLeadOrganizerEditPage, {type: type, itemData: itemData});


        modal.onDidDismiss(data => {

            // console.log(data);

            if (data.state != 'cancel') {

                this.loadOrganizerItems();
            }


            // this.organizer.get({ openLeadId: this.itemsId })
            //     .subscribe(result => {
            //
            //         // переводим ответ в json
            //         let data = result.json();
            //
            //         // let modal = this.modalCtrl.create(OpenLeadOrganizerPage, {items: data});
            //         //
            //         // modal.present();
            //
            //         this.items = data.organizer;
            //
            //         // console.log(data);
            //
            //     }, err => {
            //
            //         console.log('ERROR: ' + err);
            //     });

        });


        modal.present();

    }


    /**
     * Удаление итема
     *
     */
    dellItem(itemData) {

        this.organizer.dell({organizerId: itemData.id})
            .subscribe(result => {

                // переводим ответ в json
                let data = result.json();

                itemData.dell = true;

                // let modal = this.modalCtrl.create(OpenLeadOrganizerPage, {items: data});
                //
                // modal.present();

                // this.items = data.organizer;

                // this.organizer.get({ openLeadId: this.itemsId })
                //     .subscribe(result => {
                //
                //         // переводим ответ в json
                //         let data = result.json();
                //
                //         // let modal = this.modalCtrl.create(OpenLeadOrganizerPage, {items: data});
                //         //
                //         // modal.present();
                //
                //         this.items = data.organizer;
                //
                //         // console.log(data);
                //
                //     }, err => {
                //
                //         console.log('ERROR: ' + err);
                //     });


                console.log(data);

            }, err => {

                console.log('ERROR: ' + err);
            });
    }


    /**
     * Смена статуса итема
     *
     */
    applyItem(itemData) {

        let status;

        if (itemData.status != 1) {

            status = 'apply';

        } else {

            status = 'notApply';
        }

        this.organizer.apply({organizerId: itemData.id, status: status})
            .subscribe(result => {

                // переводим ответ в json
                let data = result.json();

                console.log(data);

                itemData.status = data.organizer.status;
                itemData.time = data.organizer.time;

            }, err => {

                console.log('ERROR: ' + err);
            });
    }


    /**
     * Рефреш страницы
     *
     */
    doRefresh(event) {

        this.loadOrganizerItems(event);
    }


    /**
     * Загрузка итемов органайзера
     *
     */
    loadOrganizerItems(refresher: any = false, itemClear: boolean = true) {

        if (!refresher) {
            this.isLoading = true;
        }

        if (itemClear) {
            this.items = [];
        }

        // помечаем что нотификации есть (здесь мы еще в это верим)
        this.isOrganizerEmpty = false;

        // отсутствие нотификаций по фильтру (помечаем что они есть)
        this.noOrganizerByFilter = false;

        // включаем переменную наличия итемов
        this.isThereStillOrganizerItems = true;

        this.organizer.get(this.items.length, this.filterApplied)
            .subscribe(result => {

                // переводим ответ в json
                let data = result.json();


                if (data.status == 'success') {

                    // сценарий обработки результата
                    if (data.organizer.length == 0 && this.items == 0) {
                        // если итемов не полученно и общее количество итемов равняется 0

                        // проверка включенного фильтра
                        if (this.isOrganizerFilterOn) {
                            // если фильтр включен

                            // блок отсутствия итемов по фильтру
                            this.noOrganizerByFilter = true;

                        } else {
                            // если фильтр выключен

                            // показываем блок отсутствия итемов
                            this.isOrganizerEmpty = true;
                        }

                        // this.isOrganizerEmpty = true;

                    } else if (data.organizer.length == 0 && this.items != 0) {
                        // если итемы не получены, но в целом, в системе итемы уже есть

                        // помечаем что на сервере больше нет итемов
                        this.isThereStillOrganizerItems = false;

                    } else {
                        // итемы полученны

                        // добавляем итемы к существующим
                        this.items = this.items.concat(data.organizer);
                    }

                }


                // this.items = data.organizer;

                if (!refresher) {

                    this.isLoading = false;

                } else {

                    refresher.complete();
                }

                console.log(data);

            }, err => {

                if (!refresher) {

                    this.isLoading = false;

                } else {

                    refresher.complete();
                }

                console.log('ERROR: ' + err);
            });
    }


    /**
     * Включение/выключение инфинити
     *
     */
    isLastPageReached(): boolean {

        return this.items.length != 0 && this.isThereStillOrganizerItems;
    }


    /**
     * Подгрузка дополнительных итемов
     *
     */
    loadMore(infinityScroll) {

        this.loadOrganizerItems(infinityScroll, false);
    }


    /**
     * Выбор статуса
     *
     */
    selectState(selectedState) {

        // перебираем все статусы
        for (let state in this.allStates) {

            if (this.allStates[state]['id'] == selectedState['id'] && this.allStates[state]['status']) {

                this.allStates[state]['status'] = false;
                // this.filter.leadStatus = 0;

                let stateData = [];
                this.filter.state.forEach(function (typeId, key) {

                    if (typeId != selectedState['id']) {
                        stateData.push(typeId);
                    }

                    // console.log('перечисляю фильтр');
                    // console.log(mask['id']);
                    // console.log(maskId);
                });

                this.filter.state = stateData;

                break;
            }


            if (this.allStates[state]['id'] == selectedState['id']) {
                this.allStates[state]['status'] = true;

                this.filter.state.push(selectedState['id']);
            }

        }

    }


    /**
     * Очистка состояния фильтра
     *
     */
    clearStateFilter() {

        // перебираем все состояния итемов
        for (let stateId in this.allStates) {

            this.allStates[stateId]['status'] = false;
        }

        this.filter.state = [];
    }


    /**
     * Закрытие меню
     *
     */
    whenFilterMenuClose() {
        // сохранение примененного фильтра из рабочего в примененный
        for (let filterData in this.filterApplied) {

            switch (filterData) {

                case 'state':

                    this.filter['state'] = JSON.parse(JSON.stringify(this.filterApplied['state']));
                    break;

            }
        }

        console.log('срабатывает когда меню закрывается: ');

        console.log(this.filter['state']);

        // сохранение фильтра в локалсторедже
        localStorage.setItem('openLeadOrganizerFilter', JSON.stringify(this.filterApplied));

        // пересчет фильтра
        this.filterRecount();
    }


    /**
     * Пересчет данных по фильтру
     *
     */
    filterRecount() {

        // выключение фильтра
        this.isOrganizerFilterOn = false;

        // пересчет выбранных состояний итемов
        for (let state in this.allStates) {

            this.allStates[state]['status'] = false;

            this.filter['state'].forEach(selectedState => {

                if (this.allStates[state]['id'] == selectedState) {

                    this.isOrganizerFilterOn = true;

                    this.allStates[state]['status'] = true;
                }
            });
        }

        // console.log(this.isFilterOn);
    }


    /**
     * Применить фильтр
     *
     */
    filterApply() {
        // сохранение примененного фильтра из рабочего в примененный
        for (let filterData in this.filterApplied) {

            switch (filterData) {

                case 'state':

                    this.filterApplied['state'] = JSON.parse(JSON.stringify(this.filter['state']));
                    break;

            }
        }

        // сохранение фильтра в локалсторедже
        localStorage.setItem('allOrganizerFilter', JSON.stringify(this.filterApplied));

        // пересчет фильтра
        this.filterRecount();

        // обновление итемов на странице с сервера
        this.loadOrganizerItems()
    }


    /**
     * Обнуление фильтра
     *
     */
    filterReset() {

        // обнуление рабочих данных
        this.filter = {
            state: []
        };

        // обнулние примененных данных
        this.filterApplied = {
            state: []
        };

        // сохранение в локалсторедже
        localStorage.setItem('allOrganizerFilter', JSON.stringify(this.filterApplied));

        // пересчет данных по фильтру
        this.filterRecount();

        // обновление итемов на странице с сервера
        this.loadOrganizerItems()

    }


    /**
     * Меню итема
     *
     */
    itemActionSheet(itemData) {

        // console.log(itemData);

        let title = itemData.surname ? itemData.surname : ' ';
        title = title + ' ' + itemData.name;

        let actionSheet;

        actionSheet = this.actionSheetCtrl.create({
            title: title,
            buttons: [
                {
                    text: 'Apply',
                    role: 'destructive',
                    icon: 'ios-checkbox-outline',
                    handler: () => {
                        // console.log('Apply clicked');
                        this.applyItem(itemData);
                    }
                },

                {
                    text: 'Open lead',
                    icon: 'ios-open-outline',
                    handler: () => {
                        // console.log('Apply clicked');
                        this.openLeadData(itemData);
                    }
                },

                {
                    text: 'Open lead Organizer',
                    icon: 'ios-alarm-outline',
                    handler: () => {
                        // console.log('Apply clicked');
                        this.openLeadOrganizer(itemData);
                    }
                },

                {
                    text: 'Edit',
                    icon: 'ios-create-outline',
                    handler: () => {
                        this.editItem(itemData);
                    }
                },

                {
                    text: 'Dell',
                    icon: 'ios-close-circle-outline',
                    handler: () => {
                        this.dellItem(itemData);
                    }
                },

                {
                    text: 'Cancel',
                    role: 'cancel',
                    icon: 'md-close',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });


        actionSheet.present();
    }


    close() {

        this.menuCtrl.enable(true, 'main_menu');

        this.navCtrl.setRoot(MainPage);
    }

}
